'use client';

import { useState } from 'react';
import Image from 'next/image';
import BookModal from './BookModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

type Book = {
    title: string;
    thumbnail: string;
    pages: string[];
};

const books: Book[] = [
    {
        title: '자기 찾기의 여정',
        thumbnail: '/images/book1.jpg',
        pages: ['/books/book1/1.jpg', '/books/book1/2.jpg', '/books/book1/3.jpg'],
    },
    {
        title: '마음의 지도',
        thumbnail: '/images/book2.jpg',
        pages: ['/books/book2/1.jpg', '/books/book2/2.jpg', '/books/book2/3.jpg'],
    },
    {
        title: '내면 아이와의 대화',
        thumbnail: '/images/book3.jpg',
        pages: ['/books/book3/1.jpg', '/books/book3/2.jpg', '/books/book3/3.jpg'],
    },
    {
        title: '진짜 나를 만나는 시간',
        thumbnail: '/images/book4.jpg',
        pages: ['/books/book4/1.jpg', '/books/book4/2.jpg', '/books/book4/3.jpg'],
    },
    {
        title: '진짜 나를 만나는 시간',
        thumbnail: '/images/book4.jpg',
        pages: ['/books/book4/1.jpg', '/books/book4/2.jpg', '/books/book4/3.jpg'],
    },
];

export default function BookList() {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    return (
        <section
            id="books"
            className="py-20 px-4 max-w-6xl mx-auto"
        >
            <h2 className="text-3xl font-bold mb-10 text-center">출간 도서</h2>

            <Swiper
                spaceBetween={20}
                slidesPerView={'auto'}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Autoplay]}
            >
                {books.map((book, index) => (
                    <SwiperSlide
                        key={index}
                        style={{ width: '250px' }}
                    >
                        <button
                            onClick={() => setSelectedBook(book)}
                            className="text-center w-full"
                        >
                            <Image
                                src={book.thumbnail}
                                alt={book.title}
                                width={250}
                                height={350}
                                className="w-full rounded shadow"
                            />
                            <p className="mt-2 text-lg font-medium">{book.title}</p>
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>

            {selectedBook && (
                <BookModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </section>
    );
}
