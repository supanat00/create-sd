/* eslint-disable react/no-unescaped-entities */
// Lunar.tsx
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "../styles.module.css";
import Image from 'next/image'

// Assets 
import background from "../../../public/UI/lunarday/lunarday-theme.png";

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
        "(Lunar newyear theme:: Geometric :: Abstract Art :: distorted shapes )",
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
        if (value.length <= 35) {
            setter(value);
        }
    };

    // Function Close Error Message
    const closeError = () => {
        // Remove 'fire-off' class and adjust opacity
        const errorDiv = document.querySelector('.fire-off');
        if (errorDiv) {
            errorDiv.classList.remove('fire-off');
        }

        // After approximately 2 seconds, hide the error div
        setTimeout(() => {
            setIsErrorVisible(false);
        }, 2000);
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
            const reuseTexts = [{ text1 }, { text2 }, { text3 }]

            const response = await fetch('/api/stable-diffusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "text_prompts": textPrompts,
                    "reuse": reuseTexts
                }),
            });

            // ตรวจสอบสถานะของ response
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message); // กำหนดข้อความ error ใน state
                return;
            }

            // console.log('text_prompts:', textPrompts);

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
                className={`absolute left-1/2 top-72 transform -translate-x-1/2 bg-white rounded-3xl  shadow-md opacity-50 blur-lg w-5/6 h-96`}>
            </div>

            {/* Text Input */}
            <div className={`absolute left-1/2 top-72 bottom-1/2 transform -translate-x-1/2 w-5/6 h-80 flex flex-col justify-center items-center`}>

                <h1 className="text-center mt-10 text-white text-5xl font-bold mb-4">ใส่ "Keyword" ของคุณ เพื่อสร้างภาพหน้าจอพื้นหลังมงคล</h1>

                <h1 className="text-center text-2xl text-gray-200 font-semibold">(กรุณากรอก Keyword เป็นภาษาอังกฤษเท่านั้น)</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Keyword 01"
                        value={text1}
                        onChange={(e) => handleTextChange(setText1, e.target.value)}
                        className={`rounded-full mt-10 text-center p-6 text-3xl m-2 font-semibold shadow-2xl ${generating ? 'pointer-events-none' : ''}`}
                        disabled={generating}
                    />

                    <input
                        type="text"
                        placeholder="Keyword 02"
                        value={text2}
                        onChange={(e) => handleTextChange(setText2, e.target.value)}
                        className={`rounded-full text-center p-6 text-3xl mx-26 m-2 font-semibold shadow-2xl ${generating ? 'pointer-events-none' : ''}`}
                        disabled={generating}
                    />

                    <input
                        type="text"
                        placeholder="Keyword 03"
                        value={text3}
                        onChange={(e) => handleTextChange(setText3, e.target.value)}
                        className={`rounded-full text-center p-6 text-3xl m-2 font-semibold shadow-2xl ${generating ? 'pointer-events-none' : ''}`}
                        disabled={generating}
                    />
                </div>
            </div>

            {/* OK Button */}
            <div className={`absolute inline-flex  group left-1/2 bottom-72 transform -translate-x-1/2`}>
                <div
                    className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                </div>
                <button
                    onClick={generateImage}
                    className="relative inline-flex items-center justify-center px-32 py-4 text-4xl font-bold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
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
                    <div className="containerl2 absolute left-1/2 bottom-1/2 transform -translate-x-1/2">
                        <div className="l2 yellow"></div>
                        <div className="l2 red"></div>
                        <div className="l2 blue"></div>
                        <div className="l2 violet"></div>
                    </div>
                    <h2 className="animate relative text-4xl top-28 text-white ">Loading . . .</h2>
                </div>
            )}

            {/* Error */}
            {error && isErrorVisible && (
                <div className={`absolute h-screen w-screen`}>
                    {/* bg */}
                    <Image
                        alt="Background Image"
                        src={background}
                        quality={100}
                        className={`blur-lg`}
                        fill={true}
                        style={{ objectFit: "cover" }}
                    />

                    {/* moon */}
                    <div className={`fire-on`}>
                        <div className={`fire-off absolute h-screen w-screen bg-black opacity-85`}>
                            <div className="section-center">
                                <div className="moon">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className="shooting-star"></div>
                                <div className="shooting-star-2"></div>
                                <div className="star"></div>
                                <div className="star snd"></div>
                                <div className="star trd"></div>
                                <div className="star fth"></div>
                                <div className="star fith"></div>
                                <div className="circle"></div>
                                <div className="wood-circle"></div>
                                <div className="wood"></div>
                                <div className="tree-1"></div>
                                <div className="tree-2"></div>
                                <div className="fire">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div className="smoke">
                                    <span className="s-0"></span>
                                    <span className="s-1"></span>
                                    <span className="s-2"></span>
                                    <span className="s-3"></span>
                                    <span className="s-4"></span>
                                    <span className="s-5"></span>
                                    <span className="s-6"></span>
                                    <span className="s-7"></span>
                                    <span className="s-8"></span>
                                    <span className="s-9"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-80`}>
                        <h1 className="text-center mt-10 text-white text-5xl font-bold mb-4 ">กรุณากรอก "Keyword" ใหม่อีกครั้ง</h1>
                    </div>

                    {/* Accept Button */}
                    <div className={`absolute inline-flex  group left-1/2 bottom-40 transform -translate-x-1/2`}>
                        <div
                            className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                        </div>
                        <button
                            onClick={closeError}
                            className="relative inline-flex items-center justify-center px-32 py-4 text-4xl font-bold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                        >
                            ตกลง
                        </button>
                    </div>

                </div>
            )}

        </div >

    );
};


