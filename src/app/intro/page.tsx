'use client';

import { brandColors, title } from '@/lib/context';
import Philosophy from '../components/Philosophy';
import Image from 'next/image';
import { motion } from 'framer-motion';

const history = [
    { year: '2021', text: '출판사 설립 및 첫 도서 출간' },
    { year: '2022', text: '전시와 북토크, 워크숍 기획 시작' },
    { year: '2023', text: '3권의 책 출간' },
    { year: '2024', text: '문학과 예술의 교차점을 실험하는 프로젝트 진행 중' },
];

export default function IntroPage() {
    return (
        <main
            className="pt-20"
            style={{ backgroundColor: brandColors.secondary, color: brandColors.textDark }}
        >
            {/* 헤더 섹션 */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto animate-fade-in">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">{title}</h1>
                    <p
                        className="text-lg leading-relaxed text-center"
                        style={{ color: brandColors.textSoft }}
                    >
                        작은 목소리를 담아내고, 실험적인 출판을 지향하는 출판사입니다.
                    </p>
                </div>
            </section>

            {/* 철학/방향 소개 */}
            <section
                className="py-20 px-6"
                style={{ backgroundColor: 'white', color: brandColors.textDark }}
            >
                <div className="max-w-4xl mx-auto space-y-12">
                    <div>
                        <h2 className="text-3xl font-semibold mb-4">우리가 믿는 가치</h2>
                        <p className="text-base leading-relaxed text-gray-800">
                            우리는 소수의 목소리, 실험적인 콘텐츠, 느린 속도를 중요하게 생각합니다. 독자가 잠시 멈춰
                            생각하게 만드는 문장, 가볍지만 깊이 있는 표현이 담긴 책을 만들고 싶습니다.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-4">어떤 책을 만들까요?</h2>
                        <p className="text-base leading-relaxed text-gray-800">
                            문학, 에세이, 시각예술, 인문학 등 다양한 영역을 넘나들며, 출판 그 자체를 실험하는 작업을
                            이어갑니다. 한 권의 책이 작은 전시처럼 느껴지기를 바랍니다.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-4">출판 외 활동</h2>
                        <p className="text-base leading-relaxed text-gray-800">
                            전시, 북토크, 글쓰기 워크숍 등 책을 매개로 다양한 프로젝트를 진행합니다. 이야기를 나누고
                            싶은 사람들과 공간을 연결합니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* 연혁 섹션 */}
            <section
                className="py-24 px-6"
                style={{ backgroundColor: '#f9f9f9' }}
            >
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">연혁</h2>
                    <div className="space-y-8">
                        {history.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="bg-white shadow-md rounded-2xl px-6 py-5 border-l-4 border-gray-800"
                            >
                                <h3 className="text-xl font-bold text-gray-800">{item.year}</h3>
                                <p className="mt-1 text-gray-600">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 이미지 강조 섹션 */}
            <section
                className="py-20 px-6 text-center"
                style={{ backgroundColor: brandColors.primary, color: 'white' }}
            >
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">작은 책에서 시작된 실험들</h2>
                    <p
                        className="text-lg mb-8"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                        글, 이미지, 레이아웃의 경계를 허무는 실험을 지속합니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Image
                            src="/event1.jpeg"
                            alt="이벤트1"
                            width={600}
                            height={400}
                            className="rounded-2xl object-cover w-full h-80"
                        />
                        <Image
                            src="/event2.jpeg"
                            alt="북토크 이미지"
                            width={600}
                            height={400}
                            className="rounded-2xl object-cover w-full h-80"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
