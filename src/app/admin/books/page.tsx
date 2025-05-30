'use client';

import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Book {
    id: number;
    title: string;
    description: string;
    genre?: string;
    published_at: string;
    image_url?: string;
}

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        genre: '',
        published_at: '',
        image: null as File | null,
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const { data, error } = await supabase.from('books').select('*').order('published_at', { ascending: false });

        if (error) {
            console.error('책 불러오기 실패:', error);
        } else {
            setBooks(data as Book[]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setForm({ ...form, image: file });
    };

    const uploadImage = async (file: File): Promise<string> => {
        const filePath = `${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('bookimage').upload(filePath, file);
        if (error) throw error;

        const { data } = supabase.storage.from('bookimage').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            genre: '',
            published_at: '',
            image: null,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let image_url = '';
            if (form.image) {
                image_url = await uploadImage(form.image);
            }

            const { error } = await supabase.from('books').insert({
                title: form.title,
                description: form.description,
                genre: form.genre,
                published_at: form.published_at,
                image_url,
            });

            if (error) throw error;

            resetForm();
            setShowForm(false);
            fetchBooks();
        } catch (err) {
            console.error('책 등록 실패:', err);
        }
    };

    const handleDelete = async (id: number) => {
        const { error } = await supabase.from('books').delete().eq('id', id);
        if (!error) fetchBooks();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? ''
            : `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center">📚 책 관리</h2>

            <div className="mb-8 text-center">
                <button
                    onClick={() => {
                        setShowForm((prev) => {
                            if (!prev) resetForm();
                            return !prev;
                        });
                    }}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                    {showForm ? '작성 닫기' : '➕ 책 등록'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-10 border p-6 rounded-xl bg-white shadow">
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="제목"
                        className="w-full border p-2 rounded"
                        required
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        placeholder="설명"
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        name="genre"
                        value={form.genre}
                        onChange={handleInputChange}
                        placeholder="장르"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="published_at"
                        type="date"
                        value={form.published_at}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        책 추가
                    </button>
                </form>
            )}

            {books.length === 0 ? (
                <p className="text-center text-gray-500">등록된 책이 없습니다. 새 책을 추가해보세요!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border"
                        >
                            {book.image_url && (
                                <div className="relative w-full h-48">
                                    <Image src={book.image_url} alt={book.title} layout="fill" objectFit="cover" />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{book.description}</p>
                                <p className="text-xs text-gray-500">
                                    📅 {formatDate(book.published_at)} | 🏷️ {book.genre || '없음'}
                                </p>
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="mt-3 inline-block text-sm px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
