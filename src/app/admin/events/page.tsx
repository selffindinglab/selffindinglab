'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

type Event = {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    link: string;
    image_url: string;
};

export default function EventPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        link: '',
        image: null as File | null,
    });

    const fetchEvents = async () => {
        const { data, error } = await supabase.from('event').select('*').order('date', { ascending: false });
        if (error) console.error(error);
        else setEvents(data as Event[]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, image: file });
        }
    };

    const uploadImage = async (file: File) => {
        const filePath = `${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('eventimage').upload(filePath, file);
        if (error) throw error;
        const { data } = supabase.storage.from('eventimage').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            date: '',
            time: '',
            link: '',
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

            const { error } = await supabase.from('event').insert({
                title: form.title,
                description: form.description,
                date: form.date,
                time: form.time,
                link: form.link,
                image_url,
            });

            if (error) throw error;
            resetForm();
            setShowForm(false);
            fetchEvents();
        } catch (err) {
            console.error('업로드 실패:', err);
        }
    };

    const handleDelete = async (id: number) => {
        const { error } = await supabase.from('event').delete().eq('id', id);
        if (!error) fetchEvents();
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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
        <div className="p-6 max-w-5xl mx-auto mt-8">
            <h2 className="text-3xl font-bold mb-6 text-center">🎉 이벤트 관리</h2>

            <div className="mb-8 text-center">
                <button
                    onClick={() => {
                        if (!showForm) {
                            resetForm();
                            setShowForm(true);
                        } else {
                            setShowForm(false);
                        }
                    }}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                    {showForm ? '작성 닫기' : '➕ 이벤트 작성'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-10 border p-6 rounded bg-gray-100 shadow-md">
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="제목"
                        className="w-full border p-3 rounded focus:outline-none focus:ring focus:ring-emerald-300"
                        required
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        placeholder="설명"
                        className="w-full border p-3 rounded focus:outline-none focus:ring focus:ring-emerald-300"
                        required
                    />
                    <input
                        name="link"
                        type="url"
                        value={form.link}
                        onChange={handleInputChange}
                        placeholder="관련 링크 (선택)"
                        className="w-full border p-3 rounded focus:outline-none focus:ring focus:ring-emerald-300"
                    />
                    <div className="flex gap-4">
                        <input
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded"
                            required
                        />
                        <input
                            name="time"
                            type="time"
                            value={form.time}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded"
                            required
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded bg-white"
                    />
                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        등록하기
                    </button>
                </form>
            )}

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                    const isPast = event.date < new Date().toISOString().split('T')[0];

                    return (
                        <div
                            key={event.id}
                            className="relative border p-4 rounded-lg shadow bg-white hover:shadow-lg transition"
                        >
                            {isPast && (
                                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                                    마감된 이벤트
                                </span>
                            )}
                            {event.image_url && (
                                <Image
                                    src={event.image_url}
                                    alt={event.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover rounded-md mb-3"
                                />
                            )}
                            <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                            <p className="text-gray-700 mb-2">{event.description}</p>
                            <p className="text-sm text-gray-500 mb-2">
                                📅 {formatDate(event.date)} ⏰ {event.time}
                            </p>
                            {event.link && (
                                <a
                                    href={event.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    🔗 관련 링크
                                </a>
                            )}
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                삭제
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
