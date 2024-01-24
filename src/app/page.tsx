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

  const [isLeftHovered, setIsLeftHovered] = useState<boolean | false>(true);
  const [isRightHovered, setIsRightHovered] = useState<boolean | false>(true);

  // 2. สร้าง function เพื่อเปลี่ยนแปลง state เมื่อ div ถูก hover หรือไม่ถูก hover
  const handleLeftHover = async () => {
    setIsLeftHovered(true);
    setIsRightHovered(false);
  };

  const handleLeftLeave = async () => {
    setIsLeftHovered(false);
  };

  const handleRightHover = async () => {
    setIsRightHovered(true);
    setIsLeftHovered(false);
  };

  const handleRightLeave = async () => {
    setIsRightHovered(false);
  };

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
          className={`flex-1 relative opacity-85 transition duration-1000 ${isRightHovered ? 'bg-black' : ''} ${isLeftHovered ? 'bg-gradient-to-t from-white to-5%  ' : ''}`}
          onMouseEnter={handleLeftHover}
          onMouseLeave={handleLeftLeave}
          onClick={() => handleButtonClick('/valentine-prompt')}
        ></div>

        {/* Right side */}
        <div
          className={`flex-1 relative opacity-85 transition duration-1000 ${isLeftHovered ? 'bg-black' : ''} ${isRightHovered ? 'bg-gradient-to-t from-white to-5%  ' : ''}`}
          onMouseEnter={handleRightHover}
          onMouseLeave={handleRightLeave}
          onClick={() => handleButtonClick('/lunar-prompt')}
        ></div>
      </div>




      {/* dragon */}
      <div className={`absolute top-36 left-1/2 transform -translate-x-1/2`}>
        <Image
          alt="Head Text Image"
          src={yearofdragon}
          width={250}
          height={200}
          z-index={"1000"}
        />
      </div>

      {/* headtext */}
      <div className={`absolute top-60 mt-6 left-1/2 transform -translate-x-1/2`}>
        <Image
          alt="Head Text Image"
          src={headtext}
          width={420}
          height={420}
          z-index={"1000"}

        />
      </div>

      {/* centerbuttom */}
      <div className={`absolute left-1/2 bottom-1/3 transform -translate-x-1/2`}>
        <Image
          alt="Center Button Image"
          src={centerbuttom}
          width={80}
          height={80}
          z-index={"1"}
        />
      </div>

      {/* siamcenter */}
      <div className={`absolute right-0 bottom-0 -mr-24 transform -translate-x-1/2 `}>
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