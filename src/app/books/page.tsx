'use client';

import { books } from '@/lib/book';
import Link from 'next/link';
import Image from 'next/image';

export default function BookListPage() {
    return (
        <main className="pt-20 bg-white text-gray-900">
            <section className="px-6 py-24 max-w-6xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-12">출간 도서</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {books.map((book) => (
                        <Link
                            key={book.slug}
                            href={`/books/${book.slug}`}
                        >
                            <div className="group bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                                <Image
                                    src={book.thumbnail}
                                    alt={book.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-80 object-cover"
                                />
                                <div className="p-4 text-left">
                                    <h2 className="text-xl font-semibold group-hover:underline">{book.title}</h2>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
