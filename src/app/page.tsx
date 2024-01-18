'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react';

// css
import styles from "./styles.module.css";

// Assets
import background from "../../public/UI/home/home-bg.png";
import centerbuttom from "../../public/UI/home/choose-button.png";
import headtext from "../../public/UI/home/header-texts.png";
import yearofdragon from "../../public/UI/home/year_of_the_dragon.png";
import siamcenter from "../../public/UI/home/siam-center.png";

export default function Page() {
  const router = useRouter();

  const [isLeftHovered, setIsLeftHovered] = useState<boolean | false>(false);
  const [isRightHovered, setIsRightHovered] = useState<boolean | false>(false);

  // 2. สร้าง function เพื่อเปลี่ยนแปลง state เมื่อ div ถูก hover หรือไม่ถูก hover
  const handleLeftHover = () => {
    setIsLeftHovered(true);
    setIsRightHovered(false);
  };

  const handleLeftLeave = () => {
    setIsLeftHovered(false);
  };

  const handleRightHover = () => {
    setIsRightHovered(true);
    setIsLeftHovered(false);
  };

  const handleRightLeave = () => {
    setIsRightHovered(false);
  };

  // 3. ใช้ state เพื่อกำหนด `opacity` ของ div ที่ไม่มี `bg-black`
  const leftOpacity = isRightHovered ? 75 : 0;
  const rightOpacity = isLeftHovered ? 75 : 0;



  // Function to handle the click and navigate to the specified route
  const handleButtonClick = (route: string) => {
    router.push(route);
  };

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

      {/* routes tab */}
      <div className="flex h-screen">
        {/* Left side */}
        <div
          className={`flex-1 bg-black relative opacity-${leftOpacity}`}
          onMouseEnter={handleLeftHover}
          onMouseLeave={handleLeftLeave}
          onClick={() => handleButtonClick('/valentine-prompt')}
        ></div>

        {/* Right side */}
        <div
          className={`flex-1 bg-black relative opacity-${rightOpacity}`}
          onMouseEnter={handleRightHover}
          onMouseLeave={handleRightLeave}
          onClick={() => handleButtonClick('/lunar-prompt')}
        ></div>
      </div>


      {/* dragon */}
      <div className={`absolute top-20 left-1/2 transform -translate-x-1/2`}>
        <Image
          alt="Head Text Image"
          src={yearofdragon}
          width={250}
          height={200}
          z-index={"1000"}
        />
      </div>

      {/* headtext */}
      <div className={`absolute top-60 left-1/2 transform -translate-x-1/2`}>
        <Image
          alt="Head Text Image"
          src={headtext}
          width={450}
          height={450}
          z-index={"1000"}

        />
      </div>

      {/* centerbuttom */}
      <div className={`absolute left-1/2 bottom-1/3 transform -translate-x-1/2`}>
        <Image
          alt="Center Button Image"
          src={centerbuttom}
          width={120}
          height={120}
          z-index={"1"}
        />
      </div>

      {/* siamcenter */}
      <div className={`absolute right-11 bottom-10 transform -translate-x-1/2 `}>
        <Image
          alt="Center Button Image"
          src={siamcenter}
          width={250}
          height={250}
          z-index={"1"}
        />
      </div>
    </div>
  );
}
