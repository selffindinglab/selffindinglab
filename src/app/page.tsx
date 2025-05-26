'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import Smallhead from './components/Smallhead';
import { intro, title, brandColors } from '@/lib/context';
import { Book, Event } from '@/lib/type';
import { supabase } from '@/lib/supabase';

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const { data, error } = await supabase
                .from('books')
                .select('id, title, genre, image_url,published_at')
                .order('published_at', { ascending: false })
                .limit(4);

            if (error) {
                console.error('책 데이터 오류:', error);
            } else {
                setBooks(data);
            }
        };

        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('event')
                .select('id, title, description, image_url,date,time')
                .order('date', { ascending: false })
                .limit(3); // 최근 3개만 가져오기
            if (error) {
                console.error('행사 데이터 오류:', error);
            } else {
                setEvents(data);
            }
        };

        fetchBooks();
        fetchEvents();
    }, []);

    return (
        <main className="pt-20" style={{ backgroundColor: brandColors.primary, color: 'white' }}>
            {/* Hero Section */}
            <section id="subscribe" className="w-full py-32 px-6 text-center">
                <h1 className="text-5xl md:text-7xl font-light tracking-tight waguri-font leading-tight">{title}</h1>
                <p className="mt-6 text-lg md:text-xl font-light" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    출판과 실험을 사랑하는
                    <br className="sm:hidden" />
                    &nbsp;1인 출판사
                </p>
                <p
                    className="mt-10 max-w-2xl mx-auto text-base md:text-lg leading-relaxed whitespace-pre-line"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    {intro}
                </p>
            </section>

            {/* Book Grid Section */}
            <section id="books" className="py-20 px-4 max-w-6xl mx-auto text-center">
                <Smallhead title="출간 도서" color="white" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-items-center">
                    {books.map((book) => (
                        <button
                            key={book.id}
                            className="w-full flex flex-col items-center transition-transform hover:scale-105"
                        >
                            <Image
                                src={book.image_url}
                                alt={book.title}
                                width={200}
                                height={300}
                                className="rounded w-full shadow-xl"
                            />
                            <p className="mt-3 text-base font-medium">{book.title}</p>
                        </button>
                    ))}
                </div>

                {/* {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />} */}
            </section>

            {/* Intro Section */}
            <section
                id="intro"
                className="py-24 px-6 text-center"
                style={{ backgroundColor: brandColors.secondary, color: brandColors.textDark }}
            >
                <div className="max-w-3xl mx-auto animate-fade-in">
                    <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: brandColors.textSoft }}>
                        <span className="font-medium" style={{ color: brandColors.textDark }}>
                            {title}
                        </span>
                        {`는\n`}
                        {intro}
                    </p>
                </div>
            </section>

            {/* News Section */}
            <section
                id="news"
                className="py-20 px-6 text-center"
                style={{ backgroundColor: brandColors.primary, color: 'white' }}
            >
                <Smallhead title="콜라보 행사" color="white" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {events.map((event) => (
                        <div key={event.id} className="rounded-2xl overflow-hidden bg-white text-black shadow-lg">
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                width={400}
                                height={300}
                                className="w-full h-60 object-cover"
                            />
                            <div className="p-4 text-left">
                                <h3 className="text-xl font-semibold">{event.title}</h3>
                                <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}
