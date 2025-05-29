'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';

export default function ProgramDetailPage() {
    const params = useParams();
    const [program, setProgram] = useState<any>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const res = await fetch(`/api/event/${params.id}`);
                if (!res.ok) throw new Error('Program not found');
                const data = await res.json();
                setProgram(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [params.id]);

    if (error) return notFound();

    return (
        <main className="min-h-screen bg-white font-sans text-gray-900">
            {loading ? (
                <div className="animate-pulse space-y-6 max-w-4xl mx-auto p-6">
                    <div className="h-64 bg-gray-300 rounded-lg" />
                    <div className="h-10 w-1/2 bg-gray-300 rounded" />
                    <div className="h-6 w-1/3 bg-gray-300 rounded" />
                    <div className="h-32 bg-gray-300 rounded-lg" />
                </div>
            ) : (
                program && (
                    <>
                        {/* Hero Section */}
                        <section className="relative w-full h-[450px] md:h-[600px]">
                            <Image
                                src={program.image_url}
                                alt={program.title}
                                fill
                                className="object-cover brightness-75"
                                priority
                            />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                                <h1 className="text-4xl md:text-5xl font-bold drop-shadow-xl">{program.title}</h1>
                                <p className="mt-4 text-lg md:text-xl max-w-xl drop-shadow-md">
                                    {program.subtitle || '이 프로그램이 당신의 삶을 어떻게 변화시킬 수 있을까요?'}
                                </p>

                                {/* 신청 버튼 */}
                                {program.link && (
                                    <div className="mt-6">
                                        {new Date(program.date) < new Date() ? (
                                            <button
                                                className="bg-gray-400 text-white font-semibold px-6 py-3 rounded-full shadow cursor-not-allowed"
                                                disabled
                                            >
                                                신청 기간이 마감되었습니다
                                            </button>
                                        ) : (
                                            <a
                                                href={program.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg"
                                            >
                                                👉 프로그램 신청하기
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 소개 섹션 */}
                        <section className="max-w-4xl mx-auto py-16 px-4 space-y-10">
                            <div
                                className="prose prose-lg prose-slate mx-auto"
                                dangerouslySetInnerHTML={{ __html: program.description }}
                            />

                            {/* 정보 블록 */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-semibold mb-2">🕒 언제 진행되나요?</h3>
                                    <p>
                                        {program.date} / {program.time}
                                    </p>
                                </div>

                                <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-semibold mb-2">📍 장소</h3>
                                    <p>{program.location || '온라인 or 오프라인 장소 미정'}</p>
                                </div>
                            </div>
                        </section>
                    </>
                )
            )}
        </main>
    );
}
