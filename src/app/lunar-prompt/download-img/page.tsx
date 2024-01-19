// Loading.tsx
"use client"
import { useEffect, useState } from 'react';
import styles from "../../styles.module.css";
import Image from 'next/image';

// Assets 
import background from "../../../../public/UI/home/home-bg.png";

const Loading: React.FC = () => {
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

    const handleShare = async () => {
        try {
            if (navigator.share === undefined) {
                throw new Error('Unsupported share feature');
            }

            if (cloudinaryUrl) {
                // Fetch the image data from Cloudinary
                const response = await fetch(cloudinaryUrl);

                if (response.ok) {
                    // Convert the response to a Blob
                    const blob = await response.blob();

                    // Create a File from Blob
                    const file = new File([blob], 'wallpaper_theme_lunarday.png', { type: blob.type });

                    // Share the image
                    await navigator.share({ files: [file] });
                } else {
                    console.error('Error fetching image:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error sharing image:', error);
        }
    };


    const handleDownload = async () => {
        try {
            if (cloudinaryUrl) {
                // Fetch the image data from Cloudinary
                const response = await fetch(cloudinaryUrl);

                if (response.ok) {
                    // Convert the response to a Blob
                    const blob = await response.blob();

                    // Create a URL for the Blob
                    const blobUrl = URL.createObjectURL(blob);

                    // Create a download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = 'wallpaper_theme_lunarday.png';

                    // Click the link to trigger the download
                    downloadLink.click();
                } else {
                    console.error('Error fetching image:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error downloading image:', error);
        } finally {
            setLoading(false);
        }
    };

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
                {/* Share Button */}
                <div className={`absolute inline-flex  group left-1/2 bottom-32 transform -translate-x-1/2`}>
                    <div
                        className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                    </div>
                    <button
                        onClick={handleShare}
                        className="relative inline-flex items-center justify-center px-20 py-2 text-xl font-bold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"
                    >
                        Share
                    </button>
                </div>

                {/* Download Button */}
                <div className={`absolute inline-flex  group left-1/2 bottom-16 transform -translate-x-1/2`}>
                    <div
                        className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                    </div>
                    <button
                        onClick={handleDownload}
                        className="relative inline-flex items-center justify-center px-14 py-2 text-xl font-bold text-white transition-all duration-200 bg-black font-pj  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-full"

                    >
                        Download
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Loading;
