'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Smallhead from './Smallhead';
import { Book } from '@/app/lib/type';

interface BookCardProps {
    image: string;
    title: string;
    onClick: () => void;
    isSelected: boolean;
    isMobile: boolean;
}

const BookCard = ({ image, title, onClick, isSelected, isMobile }: BookCardProps) => (
    <button
        onClick={isMobile ? undefined : onClick} // 모바일에선 클릭 무시
        className={`flex flex-col items-center text-center transition-transform px-2 ${
            isSelected && !isMobile ? 'scale-105 rounded-lg' : 'hover:scale-105'
        }`}
        type="button"
    >
        <div className="w-[200px] h-[300px] relative">
            <Image
                src={image}
                alt={title}
                fill
                className="rounded-lg shadow-[12px_16px_24px_rgba(0,0,0,0.2)] object-cover"
            />
        </div>
        <p className="mt-4 text-sm font-medium text-black">{title}</p>
    </button>
);

interface DetailSectionProps {
    selectedBook: Book | null;
}

const DetailSection = ({ selectedBook }: DetailSectionProps) => (
    <div className="p-6 bg-white rounded-lg shadow-lg w-[400px]">
        {selectedBook ? (
            <div className="flex flex-col gap-4">
                <div className="w-full h-[320px] relative rounded-lg overflow-hidden shadow-md">
                    <Image
                        src={selectedBook.image_url}
                        alt={selectedBook.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 400px) 100vw, 400px"
                    />
                </div>
                <div className="flex flex-col items-start">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedBook.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedBook.genre || '장르 정보 없음'}</p>
                    <p className="text-sm text-indigo-600 mt-2">#{selectedBook.genre || '태그 없음'}</p>
                </div>
            </div>
        ) : (
            <p className="text-gray-500 text-center py-32">책을 선택해 주세요</p>
        )}
    </div>
);

interface BookSectionProps {
    books: Book[];
}

const BookSection = ({ books }: BookSectionProps) => {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // 모바일 여부 체크 및 상태 업데이트
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // 모바일일 때 itemsPerPage는 1, 아니면 3
    const itemsPerPage = isMobile ? 1 : 3;

    // books 변경 시 selectedBook 초기화 (모바일일 땐 선택 무시)
    useEffect(() => {
        if (books.length > 0 && !isMobile) {
            setSelectedBook(books[0]);
        } else if (isMobile) {
            setSelectedBook(null); // 모바일에선 선택 상태 제거
        }
    }, [books, isMobile]);

    const totalPages = Math.ceil(books.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, books.length);
    const currentBooks = books.slice(startIndex, endIndex);

    const goToPrev = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const goToNext = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    return (
        <section id="books" className="bg-gray-100 py-20 px-4 text-center">
            <Smallhead title="출간 도서" color="black" />

            <div className="w-full max-w-6xl mx-auto flex flex-row gap-8 justify-center items-start">
                {/* 모바일에서는 상세 영역 숨김 */}
                {!isMobile && <DetailSection selectedBook={selectedBook} />}

                <div className="flex-1 flex flex-col justify-between items-center pt-4">
                    <div className="flex gap-4 mb-4 flex-wrap justify-center">
                        {currentBooks.map((book: Book) => (
                            <BookCard
                                key={book.id}
                                image={book.image_url}
                                title={book.title}
                                onClick={() => setSelectedBook(book)}
                                isSelected={selectedBook?.id === book.id}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>

                    {books.length > itemsPerPage && (
                        <div className="flex justify-center items-center mt-4 gap-4">
                            <button
                                onClick={goToPrev}
                                disabled={currentPage === 1}
                                className="text-black text-lg px-4 py-2 border rounded disabled:opacity-50"
                                type="button"
                            >
                                이전
                            </button>
                            <span className="text-black text-sm">
                                {startIndex + 1} - {endIndex} / {books.length}
                            </span>
                            <button
                                onClick={goToNext}
                                disabled={currentPage === totalPages}
                                className="text-black text-lg px-4 py-2 border rounded disabled:opacity-50"
                                type="button"
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BookSection;
