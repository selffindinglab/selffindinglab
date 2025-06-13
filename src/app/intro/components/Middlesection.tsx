import { motion } from 'framer-motion';
import Smallhead from '@/app/components/Smallhead';
import Image from 'next/image';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function MissionSection() {
    return (
        <section className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white">
            {/* 이미지 영역 (상단 중앙) */}
            <motion.div
                className="flex justify-center mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
            >
                <div className="relative w-full max-w-lg h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <Image
                        src="/back2.jpg"
                        alt="Open book illustration"
                        layout="fill"
                        objectFit="cover"
                        className="transform hover:scale-110 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL="/open-book-placeholder.jpg"
                        aria-label="출판사 이미지"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-teal-500 to-orange-400" />
                </div>
            </motion.div>

            {/* 텍스트 영역 (수직 레이아웃) */}
            <div className="space-y-12 text-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <Smallhead title="왜 우리는 이 출판사를 만들었을까요?" size="md" color="black" />
                </motion.div>

                {/* 첫 번째 문단 */}
                <motion.div
                    className="bg-gray-50 p-8 rounded-2xl shadow-sm max-w-3xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <p className="text-base sm:text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                        {`요즘 청년들은 계속해서 ‘더 나은 나’를 요구받습니다.
스펙, 성과, 성장.
끊임없이 ‘무언가 되어야만 하는 삶’ 속에서
정작 자기 자신에게 묻는 시간은 점점 줄어듭니다.

저 역시 그 안에 있었고,
어느 날 문득, 내가 진짜 원하는 게 무엇이었는지를 잊고 있다는 걸 알게 됐습니다.

그래서 이 출판사를 만들었습니다.
무언가를 더 배우고, 더 가지기 위한 ‘자기계발’이 아니라,
스스로를 이해하고, 나답게 살아가기 위한 자기 탐색의 공간으로.`}
                    </p>
                </motion.div>

                {/* 두 번째 문단 */}
                <motion.div
                    className="bg-teal-50 p-8 rounded-2xl shadow-sm max-w-3xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <p className="text-base sm:text-lg leading-relaxed text-gray-800 whitespace-pre-line">
                        {`여기서 우리는
책을 만들고, 사람을 만나고, 마음에 말을 겁니다.
정답보다는 질문을 함께 던지는 글,
성과보다는 과정에 머무를 수 있는 이야기,
자극보다는 쉼표를 건네는 언어를 만들고 싶었습니다.`}
                    </p>
                </motion.div>

                {/* 세 번째 문단 */}
                <motion.div
                    className="bg-white p-8 rounded-2xl shadow-sm max-w-3xl mx-auto border border-gray-100"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <p className="text-base sm:text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                        {`저희는 출판을 통해 묻습니다.
“당신은, 잘 지내고 있나요?”
“지금, 정말로 원하는 건 무엇인가요?”

이 작은 질문들이
누군가에게는 자기계발의 시작이자
누군가에게는 자기돌봄의 첫 걸음이 되기를 바랍니다.

지금 이 시대의 청년들에게,
말 걸어주는 출판사로 남겠습니다.`}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
