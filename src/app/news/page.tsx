'use client';

import { events } from '@/lib/event';
import Image from 'next/image';

export default function NewsPage() {
    return (
        <main className="pt-20 bg-white text-gray-900">
            <section className="px-6 py-24 max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-12 text-center">이벤트 스케치</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
                        >
                            <Image
                                src={event.imageUrl}
                                alt={event.title}
                                width={600}
                                height={400}
                                className="object-cover w-full h-72 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-5 bg-gray-50">
                                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                                <p className="text-gray-700 text-sm">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
