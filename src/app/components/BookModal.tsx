'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Book {
    title: string;
    pages: string[];
}

export default function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
    const [pageIndex, setPageIndex] = useState(0);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-white p-4 max-w-3xl w-full rounded shadow-lg text-center relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-4 text-xl text-gray-500 hover:text-black"
                >
                    ✕
                </button>
                <h3 className="text-xl font-bold mb-4">{book.title}</h3>

                <div className="relative">
                    <Image
                        src={book.pages[pageIndex]}
                        alt={`Page ${pageIndex + 1}`}
                        width={800}
                        height={600}
                        className="mx-auto max-h-[70vh] object-contain rounded"
                        style={{ height: 'auto' }}
                    />
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={pageIndex === 0}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        이전
                    </button>
                    <span>
                        {pageIndex + 1} / {book.pages.length}
                    </span>
                    <button
                        onClick={() => setPageIndex((prev) => Math.min(prev + 1, book.pages.length - 1))}
                        disabled={pageIndex === book.pages.length - 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}
