// pages/download-image.tsx
'use client'
import { useEffect } from 'react';

const DownloadImagePage: React.FC = () => {
    useEffect(() => {
        // สร้างลิงก์สำหรับดาวน์โหลดภาพ
        const downloadLink = document.createElement('a');
        downloadLink.href = '/generated_images/txt2img.png'; // ตั้งค่าเป็นตำแหน่งที่เก็บภาพ
        downloadLink.download = 'downloaded_image.png';

        // คลิกลิงค์เพื่อดาวน์โหลด
        downloadLink.click();

    }, []);

    return (
        <div>
            {/* อาจเพิ่ม UI ตามต้องการ */}
            <h1>Downloading Image...</h1>
        </div>
    );
};

export default DownloadImagePage;
