/* eslint-disable react/no-unescaped-entities */
// Lunar.tsx
'use client'
import Link from 'next/link';
import { useState } from 'react';

const Lunar: React.FC = () => {

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
            const response = await fetch('/api/stable-diffusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "text_prompts": [
                        {
                            "text": text1,
                            "weight": 1
                        },
                        {
                            "text": text2,
                            "weight": 1
                        },
                        {
                            "text": text3,
                            "weight": 1
                        },
                    ],
                }),
            });

            const responseData = await response.json();

        } catch (error) {
            console.error('Error fetching data:', error);
        };
    }

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
                <h1 className="text-3xl font-bold mb-4">ใส่ "Keyword" ของคุณ เพื่อสร้างภาพหน้าจอพื้นหลังมงคล</h1>
            </div>

            <div className="flex justify-between w-full mb-8">
                <input
                    type="text"
                    placeholder="Keyword 01"
                    value={text1}
                    onChange={(e) => handleTextChange(setText1, e.target.value)}
                    className="border p-4 rounded-md w-1/4 mr-8 text-2xl"
                />

                <input
                    type="text"
                    placeholder="Keyword 02"
                    value={text2}
                    onChange={(e) => handleTextChange(setText2, e.target.value)}
                    className="border p-4 rounded-md w-1/4 mr-8 text-2xl"
                />

                <input
                    type="text"
                    placeholder="Keyword 03"
                    value={text3}
                    onChange={(e) => handleTextChange(setText3, e.target.value)}
                    className="border p-4 rounded-md w-1/4 text-2xl"
                />
            </div>
            <Link href="/lunar-prompt/show-pic">
                <button
                    onClick={generateImage}
                    className="bg-green-500 text-white px-24 py-5 rounded-full hover:bg-green-700"
                >
                    Finish
                </button>
            </Link>
        </main>
    );
};

export default Lunar;
