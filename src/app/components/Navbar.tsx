'use client';

import { title } from '@/lib/context';
import Link from 'next/link';

const Navbar = () => {
    return (
        <header className="fixed top-0 w-full z-50 bg-white shadow">
            <nav
                className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center"
                aria-label="메인 네비게이션"
            >
                <Link
                    href="/"
                    className="text-xl font-semibold"
                >
                    {title}
                </Link>
                <ul className="flex gap-6 text-sm font-medium">
                    <li>
                        <Link
                            href="/intro"
                            className="text-xl font-semibold"
                        >
                            소개
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/books"
                            className="text-xl font-semibold"
                        >
                            출판물
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/news"
                            className="text-xl font-semibold"
                        >
                            소식
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/subscribe"
                            className="text-xl font-semibold"
                        >
                            구독하기
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
