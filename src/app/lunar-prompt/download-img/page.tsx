'use client'
// pages/download-image.tsx
import { useEffect, useState } from 'react';

const DownloadImagePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [imageData, setImageData] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the latest image data from the API
                const response = await fetch('/api/get-img');
                const data = await response.json();

                if (response.ok) {
                    setImageData(data.cloudinaryUrl);
                } else {
                    console.error('Error fetching image data:', data);
                }
            } catch (error) {
                console.error('Error fetching image data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const downloadImage = async () => {
            try {
                if (imageData) {
                    // Fetch the image data from Cloudinary
                    const response = await fetch(imageData);

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

        downloadImage();
    }, [imageData]);

    return (
        <div>
            {loading ? (
                <h1>Loading Image Data...</h1>
            ) : (
                <h1>Downloading Image...</h1>
            )}
        </div>
    );
};

export default DownloadImagePage;
