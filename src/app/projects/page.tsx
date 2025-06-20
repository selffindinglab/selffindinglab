'use client';

import { brandColors } from '@/app/lib/context';
import Smallhead from '../components/Smallhead';

export default function ProjectPage() {
    return (
        <main className="pt-24 text-gray-900" style={{ backgroundColor: brandColors.secondary }}>
            {/* 헤더 */}
            <section className="py-28 px-6 text-center animate-fade-in duration-700">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Smallhead size="lg" title="숏터뷰 : 1000명의 &lsquo;나&rsquo;를 들여다보다" color="black" />
                    <p className="text-xl leading-loose font-light" style={{ color: brandColors.textSoft }}>
                        각자의 삶 속에서 건져 올린 작은 마음의 조각들. 우리는 그것을 &apos;나&apos;라는 고유한 풍경으로
                        마주합니다.
                    </p>
                </div>
            </section>

            {/* 철학적 소개 */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto space-y-16 text-gray-800">
                    <div className="space-y-5">
                        <Smallhead size="lg" title="우리는 왜 숏터뷰를 하나요?" color="black" />
                        <p className="text-lg leading-loose">
                            빠르게 소비되고 잊히는 콘텐츠 속에서, 우리는 한 사람의 진심 어린 한마디가 주는 울림에
                            집중합니다.
                            <br />
                            &apos;숏터뷰&apos;는 짧지만 진한 질문과 응답을 통해, 사람들의 마음을 기록하고 연결하는
                            실험입니다.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <Smallhead size="lg" title="1000명의 &lsquo;나&rsquo;를 모은다는 것" color="black" />
                        <p className="text-lg leading-loose">
                            삶의 이유, 오늘의 감정, 지나온 어제와 닿아 있는 내면의 소리.
                            <br />
                            우리는 그것을 모아 작은 책, 전시, 그리고 디지털 아카이브로 엮고자 합니다.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <Smallhead size="lg" title="짧지만 깊게 묻는 질문" color="black" />
                        <ul className="text-lg leading-loose list-disc list-inside space-y-1">
                            <li>지금 당신은 어떤 마음인가요?</li>
                            <li>당신을 당신답게 만드는 한 문장은 무엇인가요?</li>
                            <li>가장 오래 머문 감정은 무엇이었나요?</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-gray-50 text-center">
                <div className="max-w-3xl mx-auto space-y-10">
                    <Smallhead size="lg" title="기록을 넘어, 연결로" color="black" />
                    <p className="text-xl text-gray-700 leading-loose">
                        사람들의 &lsquo;마음&rsquo;을 담아낸 기록은 결국 사람과 사람을 잇는 다리가 됩니다.
                        <br />이 프로젝트는 그 다리를 함께 건너는 여정입니다.
                    </p>
                    <div className="aspect-video bg-gray-200 rounded-2xl shadow-md flex items-center justify-center text-gray-500 text-xl font-medium">
                        숏터뷰 영상 또는 아카이브 Coming Soon
                    </div>
                </div>
            </section>
        </main>
    );
}
