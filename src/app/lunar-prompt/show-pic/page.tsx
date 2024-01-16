// Show-pic.tsx
'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Showpic: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // จำลองการโหลดข้อมูล (ตัวอย่าง: setTimeout)
        const fetchData = async () => {
            try {
                // ทำตัวจำลองโหลดข้อมูล
                await new Promise(resolve => setTimeout(resolve, 2000));
                // ข้อมูลโหลดเสร็จสิ้น
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // ใส่ [] เพื่อให้ useEffect ทำงานเฉพาะครั้งแรก

    return (
        <main className="mt-8 text-center max-w-screen-xl mx-auto flex justify-center items-center">
            <div className="absolute top-0 left-0 flex items-center justify-center p-4">
                <Link href="/">
                    <button className="text-white bg-blue-500 rounded-lg px-4 py-2 hover:bg-blue-700">
                        Back
                    </button>
                </Link>
            </div>

            <div className="flex-1">
                {loading ? (
                    // แสดง Loader หรือข้อความ "Loading..."
                    <div className="rounded-lg shadow-md mb-8" style={{ width: 450, height: 100, backgroundColor: 'lightgray' }}>
                        Loading...
                    </div>
                ) : (
                    // แสดงรูปภาพเมื่อโหลดเสร็จสิ้น
                    <Image
                        src="/generated_images/txt2img.png"
                        alt="Generated Image"
                        className="rounded-lg shadow-md mb-8"
                        width={450}
                        height={100}
                    />
                )}
            </div>

            <div className="flex flex-col items-center">
                <div className="mb-8">
                    <Image src="/generated_images/load-test.png" alt="Generated Image" className="rounded-lg shadow-md" width={300} height={300} />
                </div>

                <Link href="/">
                    <button className="mb-2 bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-700">
                        OK
                    </button>
                </Link>

                <button className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-700">
                    Re-generate
                </button>
            </div>


        </main>
    )

}


export default Showpic;
