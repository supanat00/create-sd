// Show-pic.tsx
'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TextToImageResponse {
    artifacts: Array<{
        base64: string;
    }>;
}

const Showpic: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [imageDataUrl, setImageDataUrl] = useState<string>('');

    useEffect(() => {
        const fetchData = async (apiEndpoint: string, requestData: any) => {
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                // Check if the response status is OK (200-299)
                if (!response.ok) {
                    throw new Error(`Non-OK response: ${response.status} ${response.statusText}`);
                }

                const responseData: TextToImageResponse = await response.json();

                // Assuming there's only one image in the response
                const image = responseData.artifacts[0];

                // Create a data URL from the base64 data
                const imageDataUrl = `data:image/png;base64,${image.base64}`;

                setLoading(false);
                setImageDataUrl(imageDataUrl);
            } catch (error) {
                console.error('Error fetching data:', { status: 500 });
                // Handle the error, e.g., show a user-friendly message or retry logic
            }
        };

        fetchData('/api/stable-diffusion', {});
    }, []); // The empty dependency array ensures that this effect runs once after the initial render

    return (
        <main className="mt-8 text-center max-w-screen-xl mx-auto flex justify-center items-center">
            <div className="absolute top-0 left-0 flex items-center justify-center p-4">
                <Link href="/">
                    <button className="text-white bg-blue-500 rounded-lg px-4 py-2 hover:bg-blue-700">
                        Back
                    </button>
                </Link>
            </div>

            <div className="flex-1">
                {loading ? (
                    // แสดง Loader หรือข้อความ "Loading..."
                    <div className="rounded-lg shadow-md mb-8" style={{ width: 450, height: 100, backgroundColor: 'lightgray' }}>
                        Loading...
                    </div>
                ) : (
                    // แสดงรูปภาพเมื่อโหลดเสร็จสิ้น
                    <Image
                        src={imageDataUrl}
                        alt="Generated Image"
                        className="rounded-lg shadow-md mb-8"
                        width={450}
                        height={100}
                    />
                )}
            </div>

            <div className="flex flex-col items-center">
                <div className="mb-8">
                    <Image src="/generated_images/load-test.png" alt="Generated Image" className="rounded-lg shadow-md" width={300} height={300} />
                </div>

                <Link href="/">
                    <button className="mb-2 bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-700">
                        OK
                    </button>
                </Link>

                <button className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-700">
                    Re-generate
                </button>
            </div>


        </main>
    )

}


export default Showpic;
