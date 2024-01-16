import fetch from 'node-fetch'
import fs from "fs";

interface TextToImageResponse {
    artifacts: Array<{
        seed: number;
        base64: string;
    }>;
}

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

        responseData.artifacts.forEach((image, index) => {
            fs.writeFileSync(
                `public/generated_images/txt2img.png`,
                Buffer.from(image.base64, 'base64')
            );
        });
        return new Response(null, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
