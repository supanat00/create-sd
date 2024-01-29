// Show-pic.tsx
'use client'
import Image from 'next/image';
import styles from "../../styles.module.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

// Assets 
import background from "../../../../public/UI/show-img/show_image_bg.jpg";
import qr from "../../../../public/UI/show-img/scan-qr.png";



export default function Page() {
    const router = useRouter();

    // Keywords Random
    const themes = [
        "(Lunar newyear theme:: wallpaper)",
        "(Lunar newyear theme:: Wallpaper :: graphic design :: Simple clean art :: minimal style :: decor shape art )",
        "(Lunar newyear theme:: Wallpaper :: Abstract Art :: distorted shapes )",
        "(Lunar newyear theme:: wallpaper :: High Detail :: Unreal Engine Render :: 3D Art style)",
    ];

    // Function Generate Images from Stable Diffusion
    const [generating, setGenerating] = useState(false);

    const [loading, setLoading] = useState(true);
    const [cloudinaryUrl, setCloudinaryUrl] = useState<string>('');
    const [showButtons, setShowButtons] = useState(true);
    const [reNew, setRenew] = useState<string>(''); // State ใหม่เพื่อเก็บค่า reuse

    // Function to handle the click and navigate to the specified route
    const handleButtonClick = (route: string) => {
        router.push(route);
    };

    const generateImage = async () => {
        try {
            setGenerating(true); // เริ่ม generate

            const negative = "no text, no typography, no split frame"

            // สุ่มคำธีมจากอาเรย์
            const randomTheme = themes[Math.floor(Math.random() * themes.length)];

            // สร้าง text_prompts
            const textPrompts = [
                { "text": reNew, "weight": 1 },
                { "text": randomTheme, "weight": 1 },
                { "text": negative, "weight": -1 },
            ];

            const response = await fetch('/api/stable-diffusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "text_prompts": textPrompts,
                    "reuse": reNew
                }),
            });

            // console.log('text_prompts:', textPrompts);

            console.log('Generating... : lunarday-wallpaper');

            const responseData = await response.json();

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error fetching data:', error);
            setGenerating(false);
        }
    }

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const response = await fetch(
                    '/api/stable-diffusion',
                    {
                        next: { revalidate: 2 }
                    }
                );

                const imageData = await response.json();

                if (response.ok) {
                    setCloudinaryUrl(imageData.cloudinaryUrl);
                    setRenew(imageData.reNew);
                    setGenerating(false);
                } else {
                    console.error('Error fetching image data:', imageData);
                }
            } catch (error) {
                console.error('Error fetching image data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImageData();
    }, []); // The empty dependency array ensures that this effect runs only once when the component mounts


    return (
        <div className={styles.bgWrap}>
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

            {/* Show-Img */}
            {!generating && (
                <div className={`absolute top-20 mt-8 left-80 ml-24 z-10`}>
                    {loading ? (
                        // {/* // แสดง Loader หรือข้อความ "Loading..." */}
                        <div className={`absolute top-80 mt-5 left-40 `}>
                            <div className="loader">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    ) : cloudinaryUrl ? (
                        // {/* // แสดงรูปภาพเมื่อโหลดเสร็จสิ้น */}
                        <Image
                            src={cloudinaryUrl}
                            alt="Generated Image"
                            className={`rounded-3xl ml-2 mt-0`}
                            width={504}
                            height={100}
                        />
                    ) : null}
                </div>
            )}

            {/* QR-Scan */}
            <div className={`absolute top-28 right-40`}>

                {/* ปุ่มตกลง */}
                {showButtons && (
                    <div className={`absolute top-80 right-28 group`}>
                        <div
                            className="absolute transitiona-all duration-400 opacity-100 -inset-px group-hover:bg-[#00F404] rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 ">
                        </div>
                        <button
                            onClick={() => setShowButtons(false)}
                            disabled={generating}
                            className="relative inline-flex items-center justify-center px-36 py-4 text-4xl font-Circular_sm text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                        >
                            ตกลง
                        </button>
                    </div>
                )}
                {/* ปุ่มสร้างรูปภาพอีกครั้ง */}
                {showButtons && (
                    <div className={`absolute top-96 mt-12 right-28 group`}>
                        <div
                            className="absolute transitiona-all duration-400 opacity-100 -inset-px group-hover:bg-[#00F404] rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 ">
                        </div>
                        <button
                            onClick={generateImage}
                            disabled={generating}
                            className="relative inline-flex items-center justify-center px-16 py-4 text-4xl font-Circular_sm text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full whitespace-nowrap"
                        >
                            สร้างภาพอีกครั้ง
                        </button>
                    </div>
                )}

                {/* qr-bg และ qr-img */}
                {!showButtons && (
                    <>
                        <Image
                            alt="frame"
                            src={qr}
                            width={690}
                            height={250}
                            z-index={"1"}
                        />

                        <div className={`absolute top-48 mt-2 right-28`}>
                            <Image
                                src="/generated_images/load-test.png"
                                alt="Generated Image"
                                className="rounded-3xl shadow-md"
                                width={470}
                                height={300}
                            />
                        </div>

                        <div className={`absolute top-10 right-32`}>
                            <h1 className="text-center text-white text-5xl font-Circular_md">สแกนเพื่อดาวน์โหลด<br></br>ภาพ Wallpaper</h1>
                        </div>
                        <div className={`absolute bottom-20 right-32 group`}>
                            <div
                                className="absolute transitiona-all duration-400 opacity-100 -inset-px group-hover:bg-[#00F404] rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 ">
                            </div>
                            <button
                                onClick={() => handleButtonClick('/')}
                                className="relative inline-flex items-center justify-center px-32 py-4 text-4xl font-Circular_sm text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                            >
                                เล่นอีกครั้ง
                            </button>
                        </div>
                    </>
                )}
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
        </div>
    )

}

