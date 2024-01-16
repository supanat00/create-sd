// Show-pic.tsx
'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Showpic: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [cloudinaryUrl, setCloudinaryUrl] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/stable-diffusion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const responseData = await response.json();
                const image = responseData.artifacts[0];
                const dataUrl = `data:image/png;base64,${image.base64}`;

                // Upload image to Cloudinary and get the URL
                const cloudinaryResponse = await fetch('/api/upload-to-cloudinary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        base64Data: image.base64,


                        publicId: 'olympic_flag', // Optional, use the desired publicId
                        folder: 'stability',
                    }),
                });
                const cloudinaryData = await cloudinaryResponse.json();
                const cloudinaryImageUrl = cloudinaryData.url;

                setCloudinaryUrl(cloudinaryImageUrl);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
                        src={cloudinaryUrl}
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
