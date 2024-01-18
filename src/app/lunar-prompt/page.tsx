/* eslint-disable react/no-unescaped-entities */
// Lunar.tsx
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../styles.module.css";
import Image from 'next/image'

// Assets 
import background from "../../../public/UI/lunarday/lunarday-theme.png";

export default function Page() {
    const themes = ["(lunar new year, Pop art)", "(lunar new year, Graphic,minimal)", "(lunar new year, Abstract)", "(lunar new year, unreal engine, art station)", "(lunar new year, photography)"];

    const [generating, setGenerating] = useState(false);

    const router = useRouter();

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
            setGenerating(true); // เริ่ม generate

            // สุ่มคำธีมจากอาเรย์
            const randomTheme = themes[Math.floor(Math.random() * themes.length)];

            // สร้าง text_prompts
            const textPrompts = [
                { "text": text1, "weight": 1 },
                { "text": text2, "weight": 1 },
                { "text": text3, "weight": 1 },
                { "text": randomTheme, "weight": 1 },
            ];

            const response = await fetch('/api/stable-diffusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "text_prompts": textPrompts,
                }),
            });

            console.log('text_prompts:', textPrompts);

            const responseData = await response.json();

            router.push('/lunar-prompt/show-pic');

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setGenerating(false); // สิ้นสุดการ generate
        }
    }

    return (
        <div>
            {/* background */}
            <div className={styles.bgWrap}>
                <Image
                    alt="Background Image"
                    src={background}
                    placeholder="blur"
                    quality={100}
                    fill={true}
                    style={{ objectFit: "cover" }}
                />
            </div>

            <div
                className={`absolute left-1/2 top-72 transform -translate-x-1/2 bg-white rounded-3xl  shadow-md opacity-50 blur-lg w-5/6 h-96`}>
            </div>

            <div className={`absolute left-1/2 top-72 bottom-1/2 transform -translate-x-1/2 w-5/6 h-80 flex flex-col justify-center items-center`}>

                <h1 className="text-center mt-10 text-white text-5xl font-bold mb-4">ใส่ "Keyword" ของคุณ เพื่อสร้างภาพหน้าจอพื้นหลังมงคล</h1>

                <h1 className="text-center text-2xl text-gray-200 font-semibold">(กรุณากรอก Keyword เป็นภาษาอังกฤษเท่านั้น)</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Keyword 01"
                        value={text1}
                        onChange={(e) => handleTextChange(setText1, e.target.value)}
                        className={`rounded-full mt-10 text-center p-6 text-3xl m-2 font-semibold shadow-2xl`}
                        disabled={generating}
                    />

                    <input
                        type="text"
                        placeholder="Keyword 02"
                        value={text2}
                        onChange={(e) => handleTextChange(setText2, e.target.value)}
                        className={`rounded-full text-center p-6 text-3xl mx-26 m-2 font-semibold shadow-2xl`}
                        disabled={generating}
                    />

                    <input
                        type="text"
                        placeholder="Keyword 03"
                        value={text3}
                        onChange={(e) => handleTextChange(setText3, e.target.value)}
                        className={`rounded-full text-center p-6 text-3xl m-2 font-semibold shadow-2xl`}
                        disabled={generating}
                    />
                </div>
            </div>


            {/* Button */}
            <div className={`absolute inline-flex  group left-1/2 bottom-72 transform -translate-x-1/2`}>
                <div
                    className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                </div>
                <button
                    onClick={generateImage}
                    className="relative inline-flex items-center justify-center px-32 py-4 text-4xl font-bold text-white transition-all duration-200 bg-gray-950 font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                    disabled={generating}
                >
                    {generating ? 'Generating...' : 'ตกลง'}
                </button>
            </div>


        </div>

    );
};


