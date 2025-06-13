import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function EditorialHeader() {
    return (
        <header className="bg-white text-black px-6 py-20 md:py-28 relative">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                <motion.div className="space-y-4 mb-8 md:mb-0" initial="hidden" animate="visible" variants={fadeIn}>
                    <div className="text-xs text-gray-500">SELF FINDING LAB</div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        나에게 말을 거는 <br /> 또 하나의 방법
                    </h1>

                    <p className="text-sm text-gray-500 border-l-2 border-black pl-2">
                        Another way <br /> to talk to me
                    </p>
                </motion.div>

                <motion.div
                    className="relative w-full max-w-xl h-96 md:h-[400px] mt-8 md:mt-0 flex justify-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <div className="relative w-full h-full">
                        <Image src="/book.png" alt="책 이미지" fill className="object-contain" />
                        <div className="absolute top-1/2 z-[-1] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[2px] bg-black"></div>
                    </div>
                </motion.div>

                <motion.div
                    className="hidden md:flex flex-col items-end mt-8 md:mt-0"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <div className="text-right">
                        <p className="text-2xl font-bold leading-tight writing-vertical">
                            자<br /> 기 <br /> 찾 <br /> 기 <br /> 연<br /> 구<br /> 소
                        </p>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
