// Loading.tsx
"use client"
import { useEffect, useState } from 'react';
import styles from "../../styles.module.css";
import Image from 'next/image';

// Assets 
import background from "../../../../public/UI/home/home-bg.png";
export default function Page() {
    const [loading, setLoading] = useState(true);
    const [cloudinaryUrl, setCloudinaryUrl] = useState<string>('');

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
    }, []);

    return (
        <main className="max-w-screen-xl  justify-center items-center">

            <div >
                {/* background */}
                <div className={styles.bgWrap}>
                    <Image
                        alt="Background Image"
                        src={background}
                        quality={100}
                        fill={true}
                        className={`blur-2xl`}
                        style={{ objectFit: "cover" }}
                    />
                </div>
                {loading ? (
                    // แสดง Loader หรือข้อความ "Loading..."
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                        <div className="loader">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                ) : cloudinaryUrl ? (
                    // แสดงรูปภาพเมื่อโหลดเสร็จสิ้น                    
                    <Image
                        src={cloudinaryUrl}
                        alt="Generated Image"
                        className="absolute mt-8 rounded-lg shadow-md left-1/2 -translate-x-1/2"
                        width={450}
                        height={100}
                    />
                ) : null}
            </div>
        </main>
    );
};


