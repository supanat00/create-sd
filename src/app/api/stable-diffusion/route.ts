'use server'
import fetch from 'node-fetch'
import fs from "fs";

export async function GET(request: Request) {
    return new Response('hi')
}
interface TextToImageResponse {
    artifacts: Array<{
        seed: number;
        base64: string;
    }>;
}

export async function POST(req: Request) {

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
                height: 1536,
                width: 640,
                steps: 50,
                samples: 1,
            }),
        }
    )

    if (!response.ok) {
        throw new Error(`Non-200 response: ${await response.text()}`)
    }

    const responseJSON: TextToImageResponse = <TextToImageResponse>await response.json();

    responseJSON.artifacts.forEach((image, index) => {
        fs.writeFileSync(
            `public/generated_images/txt2img.png`,
            Buffer.from(image.base64, 'base64')
        );
    });
};
