'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Event } from '@/lib/type';

const RichTextEditor = dynamic(() => import('@/app/components/RichTextEditor'), { ssr: false });

export default function EventPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        date: '',
        time: '',
        location: '',
        link: '',
        program_type: '이벤트', // 기본값
        image: null as File | null,
    });

    const fetchEvents = async () => {
        const { data, error } = await supabase.from('event').select('*').order('date', { ascending: false });
        if (error) console.error(error);
        else setEvents(data as Event[]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
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
            subtitle: '',
            description: '',
            date: '',
            time: '',
            location: '',
            link: '',
            program_type: '이벤트',
            image: null,
        });
        setImagePreview(null);
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
                subtitle: form.subtitle,
                description: form.description,
                date: form.date,
                time: form.time,
                location: form.location,
                link: form.link,
                program_type: form.program_type,
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

                    <input
                        name="subtitle"
                        value={form.subtitle}
                        onChange={handleInputChange}
                        placeholder="부제목 (subtitle)"
                        className="w-full border p-3 rounded focus:outline-none focus:ring focus:ring-emerald-300"
                    />

                    <input
                        name="location"
                        value={form.location}
                        onChange={handleInputChange}
                        placeholder="장소"
                        className="w-full border p-3 rounded focus:outline-none focus:ring focus:ring-emerald-300"
                    />

                    <div>
                        <label className="block mb-2 font-semibold">썸네일 이미지 업로드</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border p-2 rounded bg-white"
                        />
                        {imagePreview && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-1">미리보기:</p>
                                <Image
                                    src={imagePreview}
                                    alt="미리보기 이미지"
                                    width={600}
                                    height={400}
                                    className="rounded border object-cover max-h-64"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">상세 설명</label>
                        <RichTextEditor
                            content={form.description}
                            onChange={(html) => setForm({ ...form, description: html })}
                        />
                    </div>

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

                    <div>
                        <label htmlFor="program_type" className="block mb-2 font-semibold">
                            프로그램 유형
                        </label>
                        <select
                            id="program_type"
                            name="program_type"
                            value={form.program_type}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded"
                        >
                            <option value="강연">강연</option>
                            <option value="이벤트">이벤트</option>
                            <option value="원데이클래스">원데이클래스</option>
                        </select>
                    </div>

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
                            {event.subtitle && <p className="text-gray-600 mb-2 italic">{event.subtitle}</p>}

                            <p className="text-sm text-gray-500 mb-2">
                                📅 {formatDate(event.date)} ⏰ {event.time}
                            </p>
                            {event.location && <p className="text-sm text-gray-500 mb-2">📍 {event.location}</p>}
                            <p className="text-sm text-gray-500 mb-2 font-semibold">{event.program_type}</p>
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
