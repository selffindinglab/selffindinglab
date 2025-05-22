'use client';
import Image from 'next/image';
import { useState } from 'react';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Footer from './components/Footer';
import BookModal from './components/BookModal';
import { intro, title, brandColors } from '@/lib/context';
import { books } from '@/lib/book';
import { Book } from '@/lib/type';
import { events } from '@/lib/event';

export default function Home() {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    return (
        <main
            className="pt-20"
            style={{ backgroundColor: brandColors.primary, color: 'white' }}
        >
            {/* Hero Section */}
            <section
                id="subscribe"
                className="w-full py-32 px-6 text-center"
            >
                <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">{title}</h1>
                <p
                    className="mt-6 text-lg md:text-xl font-light"
                    style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                >
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
            <section
                id="books"
                className="py-20 px-4 max-w-6xl mx-auto text-center"
            >
                <h2 className="text-3xl font-bold mb-12">출간 도서</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-items-center">
                    {books.map((book, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedBook(book)}
                            className="w-full flex flex-col items-center transition-transform hover:scale-105"
                        >
                            <Image
                                src={book.thumbnail}
                                alt={book.title}
                                width={200}
                                height={300}
                                className="rounded w-full shadow-xl"
                            />
                            <p className="mt-3 text-base font-medium">{book.title}</p>
                        </button>
                    ))}
                </div>

                {selectedBook && (
                    <BookModal
                        book={selectedBook}
                        onClose={() => setSelectedBook(null)}
                    />
                )}
            </section>

            {/* Intro Section */}
            <section
                id="intro"
                className="py-24 px-6 text-center"
                style={{ backgroundColor: brandColors.secondary, color: brandColors.textDark }}
            >
                <div className="max-w-3xl mx-auto animate-fade-in">
                    <h2 className="text-4xl font-semibold mb-4 tracking-tight">소개</h2>
                    <p
                        className="text-lg leading-relaxed whitespace-pre-line"
                        style={{ color: brandColors.textSoft }}
                    >
                        <span
                            className="font-medium"
                            style={{ color: brandColors.textDark }}
                        >
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
                <h2 className="text-3xl font-bold mb-8">콜라보 행사</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="rounded-2xl overflow-hidden bg-white text-black shadow-lg"
                        >
                            <Image
                                src={event.imageUrl}
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
