// Lunar.tsx
'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Lunar: React.FC = () => {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [responseData, setResponseData] = useState<string | null>(null);
    const [text1, setText1] = useState<string>('');
    const [text2, setText2] = useState<string>('');
    const [text3, setText3] = useState<string>('');

    const handleTextChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        if (value.length <= 35) {
            setter(value);
        }
    };

    const generateImage = async () => {
        try {
            // ปิดปุ่ม "Finish" หลังจากกด
            setButtonDisabled(true);

            const response = await fetch('/api/stable-diffusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "text_prompts": [
                        {
                            "text": text1,
                        },
                        {
                            "text": text2,
                        },
                        {
                            "text": text3,
                        },
                    ],
                }),
            });
            const responseData = await response.json();

            // Update the state with the base64 string of the generated image
            setResponseData(responseData.data[0].base64);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // Enable the "Finish" button after the image is generated
            setButtonDisabled(false);
        }
    };
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 relative">
            <div className="absolute top-0 left-0 flex items-center justify-center p-4">
                <Link href="/">
                    <button className="text-white bg-blue-500 rounded-lg px-4 py-2 hover:bg-blue-700">
                        Back
                    </button>
                </Link>
            </div>

            <div className="mt-8 text-center max-w-screen-xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Enter text to generate lunar new year mobile wallpaper</h1>
            </div>


            <div className="mt-8 text-center max-w-screen-xl mx-auto">

                <Image src="/generated_images/txt2img.png" alt="Generated Image" className="rounded-lg shadow-md mb-8" width={180} height={500} />

            </div>

            <div className="flex justify-between w-full mb-8">
                <input
                    type="text"
                    placeholder="Enter text 1"
                    value={text1}
                    onChange={(e) => handleTextChange(setText1, e.target.value)}
                    className="border p-4 rounded-md w-1/4 mr-8 text-2xl"
                />

                <input
                    type="text"
                    placeholder="Enter text 2"
                    value={text2}
                    onChange={(e) => handleTextChange(setText2, e.target.value)}
                    className="border p-4 rounded-md w-1/4 mr-8 text-2xl"
                />

                <input
                    type="text"
                    placeholder="Enter text 3"
                    value={text3}
                    onChange={(e) => handleTextChange(setText3, e.target.value)}
                    className="border p-4 rounded-md w-1/4 text-2xl"
                />
            </div>

            <button
                onClick={generateImage}
                className="bg-green-500 text-white px-24 py-5 rounded-full hover:bg-green-700"
                disabled={buttonDisabled}
            >
                Finish
            </button>

        </main>
    );
};

export default Lunar;
