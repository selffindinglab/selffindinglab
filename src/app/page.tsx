'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Smallhead from './components/Smallhead';
import { supabase } from '@/app/lib/supabase';
import { Book, Event } from '@/app/lib/type';
import SelfFindingRail from './components/SelfFindingRail';
import { intro } from './lib/context';
import BookSection from './components/BookSection';

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const { data, error } = await supabase
                .from('books')
                .select('id, title, genre, image_url, published_at')
                .order('published_at', { ascending: false })
                .limit(4);

            if (error) {
                console.error('책 데이터 오류:', error);
            } else {
                setBooks(data || []);
            }
        };

        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('event')
                .select('id, title, description, image_url, date, time, link, location, subtitle, program_type')
                .order('date', { ascending: false })
                .limit(3);

            if (error) {
                console.error('행사 데이터 오류:', error);
            } else {
                setEvents(data || []);
            }
        };

        fetchBooks();
        fetchEvents();
    }, []);

    return (
        <main className="pt-20 bg-deep-ocean text-white">
            <section
                id="subscribe"
                className="h-[calc(100vh-64px)] w-full px-4 sm:px-6 text-center bg-deep-ocean relative overflow-hidden flex flex-col justify-between"
            >
                {/* 텍스트 및 이미지 */}
                <div className="flex flex-col justify-center items-center flex-grow space-y-6 sm:space-y-8 mt-8">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight waguri-font leading-tight text-white">
                        자기 찾기 연구소
                    </h1>

                    <div className="flex justify-center items-center gap-4 overflow-x-auto px-2 sm:px-4">
                        <Image
                            src="/1.png"
                            alt="1"
                            width={200}
                            height={200}
                            className="rounded-[30px] sm:rounded-[50px] w-[200px] sm:w-[300px] md:w-[350px] h-auto"
                        />
                        <Image
                            src="/2.png"
                            alt="2"
                            width={200}
                            height={200}
                            className="rounded-[30px] sm:rounded-[50px] w-[200px] sm:w-[300px] md:w-[350px] h-auto"
                        />
                        <Image
                            src="/3.png"
                            alt="3"
                            width={200}
                            height={200}
                            className="rounded-[30px] sm:rounded-[50px] w-[200px] sm:w-[300px] md:w-[350px] h-auto"
                        />
                    </div>
                </div>

                {/* 중앙 텍스트 오버레이 */}
                <div
                    className="absolute top-1/2 left-1/2 sm:left-1/3 w-[90%] sm:max-w-[400px] px-4 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-white text-left"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                >
                    <p className="text-[10px] sm:text-xs uppercase tracking-wide">Mind & Soul</p>
                    <div className="mt-2 space-y-1 sm:space-y-2 relative">
                        <span className="block text-3xl sm:text-4xl md:text-5xl font-bold leading-tight underline decoration-white decoration-[2px] sm:decoration-[3px] underline-offset-[8px] sm:underline-offset-[12px]">
                            MAP
                        </span>
                        <span className="block text-3xl sm:text-4xl md:text-5xl font-bold leading-tight underline decoration-white decoration-[2px] sm:decoration-[3px] underline-offset-[8px] sm:underline-offset-[12px]">
                            OF THE
                        </span>
                        <span className="block text-3xl sm:text-4xl md:text-5xl font-bold leading-tight relative">
                            <span className="relative z-10">SELF</span>
                            {/* 밑줄 */}
                            <span
                                className="absolute left-0 bottom-[-10px] sm:bottom-[-14px] w-full sm:w-[220%] h-[3px] sm:h-[5px] bg-white z-0"
                                style={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                            />
                        </span>
                        {/* 이미지 (모바일에서 작게, 아래 위치) */}
                        <img
                            src="/main.png"
                            alt="main graphic"
                            className="absolute hidden sm:block"
                            style={{
                                bottom: '-60px',
                                right: -300,
                                width: '500px',
                                height: 'auto',
                                zIndex: 20,
                            }}
                        />
                    </div>
                    <p className="text-xs sm:text-sm mt-3 sm:mt-4">What’s on your mind?</p>
                </div>
            </section>

            <SelfFindingRail />
            <BookSection books={books} />
            <section
                id="intro"
                className="py-24 px-6 text-center bg-sand-dollar"
            >
                <div className="max-w-3xl mx-auto animate-fade-in">
                    <p className="text-lg leading-relaxed whitespace-pre-line text-vista-blue">{intro}</p>
                </div>
            </section>
            <section
                id="news"
                className="py-20 px-6 text-center bg-deep-ocean"
            >
                <Smallhead
                    title="콜라보 행사"
                    color="white"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="rounded-2xl overflow-hidden bg-sand-dollar text-crab shadow-lg"
                        >
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                width={400}
                                height={300}
                                className="w-full h-60 object-cover"
                            />
                            <div className="p-4 text-left">
                                <h3 className="text-xl font-semibold">{event.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
