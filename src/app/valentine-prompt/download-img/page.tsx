// Loading.tsx
"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
    }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

    // useEffect(() => {
    //     const handleDownload = async () => {
    //         try {
    //             if (cloudinaryUrl) {
    //                 // Fetch the image data from Cloudinary
    //                 const response = await fetch(cloudinaryUrl);

    //                 if (response.ok) {
    //                     // Convert the response to a Blob
    //                     const blob = await response.blob();

    //                     // Create a URL for the Blob
    //                     const blobUrl = URL.createObjectURL(blob);

    //                     // Create a download link
    //                     const downloadLink = document.createElement('a');
    //                     downloadLink.href = blobUrl;
    //                     downloadLink.download = 'wallpaper_theme_lunarday.png';

    //                     // Click the link to trigger the download
    //                     downloadLink.click();
    //                 } else {
    //                     console.error('Error fetching image:', response.statusText);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error downloading image:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     // Trigger download when the image is loaded
    //     if (!loading && cloudinaryUrl) {
    //         handleDownload();
    //     }
    // }, [loading, cloudinaryUrl]);

    return (
        <main className="max-w-screen-xl mx-auto flex justify-center items-center">
            <div className="flex-1">
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
                        className="rounded-lg shadow-md"
                        width={450}
                        height={100}
                    />
                ) : null}
            </div>
        </main>
    );
};

export default Loading;
