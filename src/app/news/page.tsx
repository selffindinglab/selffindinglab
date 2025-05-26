'use client';

import Image from 'next/image';
import Smallhead from '../components/Smallhead';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Event = {
    id: number;
    title: string;
    description: string;
    image_url: string;
    link: string;
    date: string; // YYYY-MM-DD 형식 가정
};

export default function NewsPage() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('event')
                .select('id, title, description, image_url, link, date')
                .order('date', { ascending: false });

            if (error) {
                console.error('이벤트 불러오기 실패:', error.message);
            } else {
                setEvents(data || []);
            }
        };

        fetchEvents();
    }, []);

    // 오늘 날짜 구하기 (시간 제외, YYYY-MM-DD)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return (
        <main className="pt-20 bg-white text-gray-900">
            <section className="px-6 py-24 max-w-6xl mx-auto text-center">
                <Smallhead title="이벤트 스케치" color="black" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                    {events.map((event) => {
                        const isPast = event.date < todayStr; // 마감 여부 판단

                        return (
                            <div
                                key={event.id}
                                className="overflow-hidden rounded-2xl shadow-lg bg-gray-50 hover:shadow-xl transition duration-300 flex flex-col relative"
                            >
                                {/* 마감된 이벤트 배지 */}
                                {isPast && (
                                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                                        마감된 이벤트
                                    </span>
                                )}

                                {event.image_url && (
                                    <Image
                                        src={event.image_url}
                                        alt={event.title}
                                        width={600}
                                        height={400}
                                        className="object-cover w-full h-72"
                                    />
                                )}
                                <div className="p-5 text-left flex flex-col flex-grow">
                                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                                    <p className="text-gray-700 text-sm mb-4 flex-grow">{event.description}</p>
                                    {event.link && !isPast && (
                                        <a
                                            href={event.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            신청 바로가기
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
