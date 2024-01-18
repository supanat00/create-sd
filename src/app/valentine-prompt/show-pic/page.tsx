// Show-pic.tsx
'use client'
import Image from 'next/image';
import styles from "../../styles.module.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

// Assets 
import background from "../../../../public/UI/show-img/show_image_bg.png";
import qr from "../../../../public/UI/show-img/scan-qr.png";

export default function Page() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [cloudinaryUrl, setCloudinaryUrl] = useState<string>('');
    const [showButtons, setShowButtons] = useState(true);

    // Function to handle the click and navigate to the specified route
    const handleButtonClick = (route: string) => {
        router.push(route);
    };

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const response = await fetch(
                    '/api/get-img',
                    {
                        next: { revalidate: 0 }
                    }
                );

                const imageData = await response.json();

                if (response.ok) {
                    setCloudinaryUrl(imageData.cloudinaryUrl);
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

            {/* Show-Img */}
            <div className={`absolute top-20 mt-5 left-80 ml-28`}>
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

            {/* QR-Scan */}
            <div className={`absolute top-28 right-40`}>

                {/* ปุ่มตกลง */}
                {showButtons && (
                    <div className={`absolute top-60 right-28`}>
                        <div
                            className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                        </div>
                        <button
                            onClick={() => setShowButtons(false)}
                            className="relative inline-flex items-center justify-center px-32 py-4 text-4xl font-bold text-white transition-all duration-200 bg-gray-950 font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                        >
                            ตกลง
                        </button>
                    </div>
                )}
                {/* ปุ่มสร้างรูปภาพอีกครั้ง */}
                {showButtons && (
                    <div className={`absolute top-96 right-10`}>
                        <div
                            className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                        </div>
                        <button
                            className="relative inline-flex items-center justify-center px-32 py-4 text-4xl font-bold text-white transition-all duration-200 bg-gray-950 font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full whitespace-nowrap"
                        >
                            สร้างภาพอีกครั้ง
                        </button>
                    </div>
                )}

                {/* qr-bg และ qr-img */}
                {!showButtons && (
                    <>
                        <Image
                            alt="Center Button Image"
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
                        <div className={`absolute top-96 mt-80 right-32`}>
                            <div
                                className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                            </div>
                            <button
                                onClick={() => handleButtonClick('/')}
                                className="relative inline-flex items-center justify-center px-32 py-4 text-4xl font-bold text-white transition-all duration-200 bg-gray-950 font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                            >
                                เล่นอีกครั้ง
                            </button>
                        </div>
                    </>
                )}

            </div>




        </div>
    )

}
