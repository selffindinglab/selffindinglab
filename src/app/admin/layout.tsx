'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.replace('/login');
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const navItems = [
        { label: 'ebook 만들기(개발중)', href: '/admin/ebook' },
        { label: '도서 관리', href: '/admin/books' },
        { label: '이벤트 관리', href: '/admin/events' },
    ];

    if (loading) return <div className="p-10">로딩 중...</div>;

    return (
        <div className="flex min-h-screen">
            <nav className="w-56 bg-gray-100 border-r border-gray-300 p-6">
                <h1 className="text-xl font-bold mb-6">관리자 페이지</h1>
                <ul className="space-y-3">
                    {navItems.map(({ label, href }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`block px-3 py-2 rounded ${
                                    pathname === href ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="flex-1 p-8 bg-white">{children}</main>
        </div>
    );
}
