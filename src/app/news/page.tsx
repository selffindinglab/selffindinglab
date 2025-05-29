'use client';

import Image from 'next/image';
import Smallhead from '../components/Smallhead';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Event = {
    id: number;
    title: string;
    image_url: string;
    link: string;
    date: string;
    time: string;
    program_type: string;
};

export default function NewsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [filter, setFilter] = useState<'전체' | '강연' | '이벤트' | '원데이클래스'>('전체');

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('event')
                .select('id, title, image_url, link, date, time, program_type')
                .order('date', { ascending: false });

            if (error) {
                console.error('이벤트 불러오기 실패:', error.message);
            } else {
                setEvents(data || []);
            }
        };

        fetchEvents();
    }, []);

    const todayStr = new Date().toISOString().split('T')[0];

    const tagColors: Record<string, string> = {
        강연: '#2563eb', // blue-600
        이벤트: '#16a34a', // green-600
        원데이클래스: '#ca8a04', // yellow-700
    };

    // 필터 적용해서 이벤트 추림 (전체면 그대로)
    const filteredEvents = filter === '전체' ? events : events.filter((event) => event.program_type === filter);

    return (
        <main className="pt-20 bg-white text-gray-900">
            <section className="px-4 sm:px-6 py-24 max-w-6xl mx-auto text-center">
                <Smallhead title="이벤트 스케치" color="black" />

                {/* 필터 버튼들 */}
                <div className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4">
                    {['전체', '강연', '이벤트', '원데이클래스'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type as typeof filter)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition
                                ${
                                    filter === type
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6 md:mt-10">
                    {filteredEvents.map((event) => {
                        const isPast = event.date < todayStr;

                        // 날짜 지났으면 마감된 이벤트 태그, 아니면 프로그램 타입 태그
                        const tagText = isPast ? '마감된 이벤트' : event.program_type;
                        const tagColor = isPast ? '#dc2626' /* red-600 */ : tagColors[event.program_type] || '#6b7280';

                        return (
                            <Link key={event.id} href={`/news/${event.id}`}>
                                <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-50 hover:shadow-xl transition duration-300 flex flex-col relative cursor-pointer">
                                    {/* 오른쪽 상단 사각형 태그 */}
                                    <span
                                        className="absolute top-0 right-0 z-10 text-xs sm:text-sm font-semibold text-white px-3 sm:px-4 py-1"
                                        style={{ backgroundColor: tagColor }}
                                    >
                                        {tagText}
                                    </span>

                                    {event.image_url && (
                                        <Image
                                            src={event.image_url}
                                            alt={event.title}
                                            width={600}
                                            height={400}
                                            className="object-cover w-full h-56 sm:h-72"
                                        />
                                    )}
                                    <div className="p-4 sm:p-5 text-left">
                                        <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{event.title}</h2>
                                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                            📅 {event.date} ⏰ {event.time}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
