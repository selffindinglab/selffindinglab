'use client';

import Image from 'next/image';
import Smallhead from '../components/Smallhead';
import Header from './components/Header';
import MissionSection from './components/Middlesection';
import TimelineSection from './components/TimeSection';

export default function IntroPage() {
    return (
        <main className="font-serif text-gray-900 bg-white min-h-screen">
            <Header />
            <MissionSection />

            <TimelineSection />
            <section className="max-w-4xl mx-auto py-20 px-6 md:px-8">
                <Smallhead size="lg" title="작은 책에서 시작된 실험들" color="crab" />
                <p className="text-center text-gray-600 mb-12 font-light tracking-wide max-w-2xl mx-auto">
                    글, 이미지, 레이아웃의 경계를 허무는 실험을 지속합니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                        { src: '/event1.jpeg', alt: '작은 책 전시' },
                        { src: '/event2.jpeg', alt: '북토크 현장' },
                    ].map(({ src, alt }, i) => (
                        <div
                            key={i}
                            className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group transition-all duration-300 hover:ring-2 hover:ring-teal-400/60"
                        >
                            <Image
                                src={src}
                                alt={alt}
                                width={400}
                                height={300}
                                className="object-cover w-full h-60 transition-transform duration-300 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-base font-medium">
                                {alt}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
