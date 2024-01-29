/* eslint-disable react/no-unescaped-entities */
// Lunar.tsx
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../styles.module.css";
import Image from 'next/image'

// Assets 
import background from "../../../public/UI/lunarday/lunarday-theme.jpg";
import closeimg from "../../../public/UI/error.png";

interface PosteringData {
    namepic?: string;
    photo: string;
    reuse: string;
}

export default function Page() {
    // Route
    const router = useRouter();

    // Keywords Random
    const themes = [
        "(Lunar newyear theme:: wallpaper)",
        "(Lunar newyear theme:: Wallpaper :: graphic design :: Simple clean art :: minimal style :: decor shape art )",
        "(Lunar newyear theme:: wallpaper :: High Detail :: Unreal Engine Render :: 3D Art style)",
    ];

    // Function Generate Images from Stable Diffusion
    const [generating, setGenerating] = useState(false);

    // Function Error Checking
    const [error, setError] = useState<string | null>(null);

    // Error Messages
    const [isErrorVisible, setIsErrorVisible] = useState(false);

    // Input string
    const [text1, setText1] = useState<string>('');
    const [text2, setText2] = useState<string>('');
    const [text3, setText3] = useState<string>('');

    // Function texts limite
    const handleTextChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        if (value.length <= 50) {
            setter(value);
        }
    };

    // Function Close Error Message
    const closeError = () => {
        setIsErrorVisible(false);
    };

    const generateImage = async () => {
        try {
            setGenerating(true); // เริ่ม generate

            const negative = "no text, no typography, no split frame"

            // สุ่มคำธีมจากอาเรย์
            const randomTheme = themes[Math.floor(Math.random() * themes.length)];

            // สร้าง text_prompts
            const textPrompts = [
                { "text": text1 || "``", "weight": 1 },
                { "text": text2 || "``", "weight": 1 },
                { "text": text3 || "``", "weight": 1 },
                { "text": randomTheme, "weight": 1 },
                { "text": negative, "weight": -1 },
            ];

            // เก็บค่าไปใช้ซ้ำ
            const reuseTexts = [text1, text2, text3]
            const textS = reuseTexts.join(" - ");

            const response = await fetch('/api/stable-diffusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "text_prompts": textPrompts,
                    "reuse": textS
                }),
            });

            // ตรวจสอบสถานะของ response
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message); // กำหนดข้อความ error ใน state
                return;
            }

            console.log('Generating... : lunarday-wallpaper');

            const responseData = await response.json();

            router.push('/lunar-prompt/show-pic');

        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An unexpected error occurred.');
            setGenerating(false);
            setIsErrorVisible(true);// กำหนดข้อความ error ใน state
        }
    }

    const isInputValid = text1.trim() !== '' || text2.trim() !== '' || text3.trim() !== '';

    return (
        <div className={styles.bgWrap}>
            {/* background */}
            <div className={styles.bgWrap}>
                <Image
                    alt="Background Image"
                    src={background}
                    quality={100}
                    fill={true}
                    style={{ objectFit: "cover" }}
                />
            </div>

            {/* Contents Grid */}
            <div
                className={`absolute left-1/2 top-80 mt-2 transform -translate-x-1/2 bg-white rounded-3xl  shadow-md opacity-15 w-10/12 h-72`}>
            </div>

            {/* Text Input */}
            <div className={`absolute left-1/2 top-72 bottom-1/2 transform -translate-x-1/2 w-5/6 h-80 flex flex-col justify-center items-center`}>
                <div className={`mt-10 `}>
                    <h1 className="text-center text-white text-4xl font-Circular_md ">กรอก "Keyword" ของคุณ เพื่อสร้างภาพหน้าจอพื้นหลังมงคล</h1>

                    <h1 className="text-center text-2xl text-gray-200 font-Circular_md opacity-40 ">(กรุณากรอก Keyword เป็นภาษาอังกฤษเท่านั้น)</h1>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Keyword 01"
                        value={text1}
                        onChange={(e) => handleTextChange(setText1, e.target.value)}
                        className={`rounded-full mt-10 text-center p-5 text-3xl m-2 font-Circular_md shadow-4xl ${generating ? 'pointer-events-none' : ''}`}
                        disabled={generating}
                    />

                    <input
                        type="text"
                        placeholder="Keyword 02"
                        value={text2}
                        onChange={(e) => handleTextChange(setText2, e.target.value)}
                        className={`rounded-full text-center p-5 text-3xl mx-32  font-Circular_md shadow-2xl ${generating ? 'pointer-events-none' : ''}`}
                        disabled={generating}
                    />

                    <input
                        type="text"
                        placeholder="Keyword 03"
                        value={text3}
                        onChange={(e) => handleTextChange(setText3, e.target.value)}
                        className={`rounded-full text-center p-5 text-3xl m-2 font-Circular_md shadow-2xl ${generating ? 'pointer-events-none' : ''}`}
                        disabled={generating}
                    />
                </div>
            </div>


            {/* Button */}
            <div className={`absolute inline-flex  group left-1/2 bottom-96 -mb-6 transform -translate-x-1/2`}>
                <div
                    className={`absolute transitiona-all duration-400 opacity-100 -inset-px rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 ${isInputValid ? 'group-hover:bg-[#00F404]' : ''}`}
                >
                </div>
                <button
                    onClick={generateImage}
                    className={`relative inline-flex items-center justify-center px-32 py-4 text-4xl font-Circular_md font-semibold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full shadow-2xl
                    ${isInputValid ? '' : 'opacity-45 bg-black'}`}
                    disabled={!isInputValid || generating}
                >
                    {generating ? 'Generating' : 'ตกลง'}
                </button>
            </div>

            {/* Loading */}
            {generating && (
                <div className={`loading2 absolute h-screen w-screen`}>
                    <Image
                        alt="Background Image"
                        src={background}
                        quality={100}
                        className={`blur-lg`}
                        fill={true}
                        style={{ objectFit: "cover" }}
                    />
                    {/* Div-opacity */}
                    <div
                        className={`absolute h-screen w-screen bg-black opacity-60`}>
                    </div>
                    {/* Contents Grid */}
                    <div
                        className={`absolute left-1/2 top-80 mt-2 transform -translate-x-1/2 bg-white rounded-3xl  shadow-md opacity-20 w-5/12 h-72`}>
                    </div>

                    {/* Text Input */}
                    <div className={`absolute left-1/2 top-72 bottom-1/2 transform -translate-x-1/2 w-5/6 h-80 flex flex-col justify-center items-center `}>
                        {/* Dot-loading */}
                        <div className="containerl2 absolute left-1/2 bottom-1/2 transform -translate-x-1/2">
                            <div className="l2 green"></div>
                            <div className="l2 yelow"></div>
                            <div className="l2 orange"></div>
                            <div className="l2 red"></div>
                            <div className="l2 pink"></div>
                        </div>
                        {/* Text-loading */}
                        <div className={`rounded-full bg-white mt-36  p-4 w-4/12 text-center shadow-2xl`}>
                            <h2 className={`text-3xl text-black font-Circular_sm`}>กำลังประมวลผล . . .</h2>
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && isErrorVisible && (
                <div className={`loading2 absolute h-screen w-screen`}>
                    <Image
                        alt="Background Image"
                        src={background}
                        quality={100}
                        className={`blur-lg`}
                        fill={true}
                        style={{ objectFit: "cover" }}
                    />
                    {/* Div-opacity */}
                    <div
                        className={`absolute h-screen w-screen bg-black opacity-60`}>
                    </div>
                    {/* Contents Grid */}
                    <div
                        className={`absolute left-1/2 top-80 mt-2 transform -translate-x-1/2 bg-white rounded-3xl  shadow-md opacity-20 w-5/12 h-72`}>
                    </div>

                    {/* Text Input */}
                    <div className={`absolute left-1/2 top-72 bottom-1/2 transform -translate-x-1/2 w-5/6 h-80 flex flex-col justify-center items-center `}>
                        {/* close_img */}
                        <div className={`absolute left-1/2 transform -translate-x-1/2 mb-36`}>
                            <Image
                                alt="Center Button Image"
                                src={closeimg}
                                width={150}
                                height={80}
                                z-index={"1"}
                            />
                        </div>
                        {/* Text-loading */}
                        <div className={`rounded-full bg-white mt-36  p-4 w-4/12 text-center shadow-2xl`}>
                            <h2 className={`text-3xl text-black font-Circular_sm`}>กรุณากรอก "Keyword" ใหม่อีกครั้ง</h2>
                        </div>
                    </div>

                    {/* Accept Button */}
                    <div className={`absolute inline-flex  group left-1/2 bottom-96 -mb-6 transform -translate-x-1/2`}>
                        <div
                            className={`absolute transitiona-all duration-400 opacity-100 -inset-px rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 ${isInputValid ? 'group-hover:bg-[#00F404]' : ''}`}
                        >
                        </div>
                        <button
                            onClick={closeError}
                            className={`relative inline-flex items-center justify-center px-32 py-4 text-4xl font-Circular_md font-semibold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full shadow-2xl
                            ${isInputValid ? '' : 'opacity-45 bg-black'}`}
                            disabled={!isInputValid || generating}
                        >
                            {generating ? 'Generating' : 'ตกลง'}
                        </button>

                    </div>
                </div>
            )}

        </div >

    );
};


