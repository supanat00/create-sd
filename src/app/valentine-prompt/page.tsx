// Valentine.tsx
'use client'
import Link from 'next/link';
import { useState } from 'react';

const Valentine: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
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
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text1,
                    text2,
                    text3,
                }),
            });
            const data = await response.json();

            if (response.ok && data.imageUrl) {
                setImageUrl(data.imageUrl);
            } else {
                console.error(`Non-200 response: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
                <h1 className="text-3xl font-bold mb-4">Enter text to generate Valentine mobile wallpaper</h1>
            </div>

            {imageUrl && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-2">Generated Image:</h2>
                    <img src={imageUrl} alt="Generated Image" className="rounded-lg shadow-md" />
                </div>
            )}

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
            >
                Finish
            </button>
        </main>
    );
};

export default Valentine;
