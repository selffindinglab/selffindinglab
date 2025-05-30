'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import Smallhead from '../components/Smallhead';

interface Book {
    id: number;
    title: string;
    genre: string;
    image_url: string;
}

export default function BookListPage() {
    const [books, setBooks] = useState<Book[]>([]);

    const fetchBooks = async () => {
        const { data, error } = await supabase
            .from('books')
            .select('id, title, genre, image_url')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('책 데이터를 불러오는 중 오류 발생:', error);
        } else {
            setBooks(data);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <main className="pt-20 bg-white text-gray-900">
            <section className="px-6 py-24 max-w-6xl mx-auto text-center">
                <Smallhead title="출간 도서" color="black" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {books.map((book) => (
                        <Link key={book.id} href={`/books/${book.title}`}>
                            <div className="group bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                                {book.image_url && (
                                    <Image
                                        src={book.image_url}
                                        alt={book.title}
                                        width={600}
                                        height={400}
                                        className="w-full h-80 object-cover"
                                    />
                                )}
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
