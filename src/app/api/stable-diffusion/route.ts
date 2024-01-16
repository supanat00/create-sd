'use server'
import fetch from 'node-fetch'
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TextToImageResponse {
    artifacts: Array<{
        seed: number;
        base64: string;
    }>;
}

interface PosteringData {
    namepic?: string;
    photo: string;
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const engineId = 'stable-diffusion-xl-1024-v1-0'
        const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
        const apiKey = process.env.STABILITY_API_KEY

        if (!apiKey) throw new Error('Missing Stability API key.')

        // ดึงข้อมูล text_prompts จาก body ของ request
        const { text_prompts } = await req.json();

        const response = await fetch(
            `${apiHost}/v1/generation/${engineId}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    text_prompts,
                    cfg_scale: 7,
                    height: 1344,
                    width: 768,
                    steps: 50,
                    samples: 1,
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`Non-200 response: ${await response.text()}`)
        }

        const responseData: TextToImageResponse = <TextToImageResponse>await response.json();

        // Assuming there's only one image in the response
        const image = responseData.artifacts[0];

        // Upload image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(`data:image/png;base64,${image.base64}`, {


            public_id: 'olympic_flag',
            folder: 'stability',
        });

        console.log('Cloudinary response:', cloudinaryResponse);

        const cloudinaryUrl = cloudinaryResponse.url;
        console.log('Cloudinary URL:', cloudinaryUrl);

        // Save data to MongoDB using Prisma
        const postData: PosteringData = {
            namepic: 'Lunar-day', // Replace with your actual data
            photo: cloudinaryUrl,
        };

        const savedPostering = await prisma.postering.create({
            data: postData,
        });

        console.log('Saved to MongoDB:', savedPostering);

        // Close Prisma connection
        await prisma.$disconnect();

        return new Response(JSON.stringify({ cloudinaryUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
