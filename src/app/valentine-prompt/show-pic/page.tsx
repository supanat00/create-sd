// Show-pic.tsx
'use client'
import Image from 'next/image';
import styles from "../../styles.module.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

// Assets 
import background from "../../../../public/UI/show-img/show_image_bg.png";
import qr from "../../../../public/UI/show-img/scan-qr.png";
import strawberry from "../../../../public/UI/show-img/asset01.png";
import lolipop from "../../../../public/UI/show-img/asset02.png";

export default function Page() {
    const router = useRouter();

    // Keywords Random
    const themes = [
        "(Valentine theme:: wallpaper)",
        "(Valentine theme:: Wallpaper :: graphic design :: Simple clean art :: minimal style :: decor shape art )",
        "(Valentine theme:: Geometric :: Abstract Art :: distorted shapes )",
        "(Valentine theme:: wallpaper :: High Detail :: Unreal Engine Render :: 3D Art style)",
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

            // ตรวจสอบสถานะของ response
            if (!response.ok) {

                return;
            }

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

            {/* Assets */}
            <div className={`absolute left-96 ml-96 top-80 mt-96 z-40`}>
                <Image
                    src={strawberry}
                    alt="Generated Image"
                    className={`mt-40 top-10 ml-8 relative overflow-hidden`}
                    width={360}
                    height={100}
                />
            </div>

            <div className={`absolute top-96 -ml-72 z-40`}>
                <Image
                    src={lolipop}
                    alt="Generated Image"
                    className={`mt-12 top-96 ml-2 relative overflow-hidden`}
                    width={890}
                    height={100}
                />
            </div>

            {/* Show-Img */}
            {!generating && (
                <div className={`absolute top-20 mt-5 left-80 ml-28 z-10`}>
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
                            className="rounded-3xl -ml-4"
                            width={536}
                            height={100}
                        />
                    ) : null}
                </div>
            )}

            {/* QR-Scan */}
            <div className={`absolute top-28 right-40`}>

                {/* ปุ่มตกลง */}
                {showButtons && (
                    <div className={`absolute top-80 right-28`}>
                        <div
                            className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                        </div>
                        <button
                            onClick={() => setShowButtons(false)}
                            disabled={generating}
                            className="relative inline-flex items-center justify-center px-36 py-6 text-4xl font-bold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                        >
                            ตกลง
                        </button>
                    </div>
                )}
                {/* ปุ่มสร้างรูปภาพอีกครั้ง */}
                {showButtons && (
                    <div className={`absolute top-96 mt-20 right-28`}>
                        <div
                            className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                        </div>
                        <button
                            onClick={generateImage}
                            disabled={generating}
                            className="relative inline-flex items-center justify-center px-16 py-6 text-4xl font-bold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full whitespace-nowrap"
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
                                src="/generated_images/GGlink.png"
                                alt="Generated Image"
                                className="rounded-3xl shadow-md"
                                width={470}
                                height={300}
                            />
                        </div>
                        <div className={`absolute top-10 right-32`}>
                            <h1 className="text-center text-white text-5xl font-semi">สแกนเพื่อดาวน์โหลด<br></br>ภาพ Wallpaper</h1>
                        </div>
                        <div className={`absolute bottom-20 right-32`}>

                            <div
                                className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                            </div>
                            <button
                                onClick={() => handleButtonClick('/')}
                                className="relative inline-flex items-center justify-center px-32 py-4 text-4xl font-bold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                            >
                                เล่นอีกครั้ง
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Loading */}
            {generating && (
                <div className={`loading2 absolute h-screen w-screen z-80`}>
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
        </div>
    )

}

