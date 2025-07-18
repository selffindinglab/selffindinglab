'use client';
import Spinner from '@/app/components/Spinner';
import { books } from '@/app/lib/book';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function BookDetailPage() {
    const params = useParams();
    const book = books.find((b) => b.slug === params.slug);

    if (!book) return <Spinner />;

    return (
        <main className="pt-20 bg-white text-gray-900">
            <section className="px-6 py-16 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-10">{book.title}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {book.pages.map((page, index) => (
                        <Image
                            key={index}
                            src={page}
                            alt={`${book.title} 페이지 ${index + 1}`}
                            width={800}
                            height={1000}
                            className="w-full rounded-xl shadow"
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
