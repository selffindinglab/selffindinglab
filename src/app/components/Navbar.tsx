'use client';

import Link from 'next/link';
import { brandColors } from '@/lib/context';

const Navbar = () => {
    return (
        <header
            className="fixed top-0 w-full z-50 shadow"
            style={{ backgroundColor: brandColors.secondary }}
        >
            <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center font-semibold tracking-wide">
                {/* 로고 영역 */}
                <Link
                    href="/"
                    className="text-lg sm:text-3xl font-bold flex items-center gap-2"
                    style={{ color: brandColors.primary }}
                >
                    <span>자기찾기연구소</span>
                </Link>

                {/* 메뉴 영역 */}
                <ul
                    className="flex gap-6 text-3xl sm:text-text-3xl items-center"
                    style={{ color: brandColors.textDark }}
                >
                    <li>
                        <Link
                            href="/intro"
                            className="hover:underline"
                        >
                            소개
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/books"
                            className="hover:underline"
                        >
                            출판물
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/news"
                            className="hover:underline"
                        >
                            소식
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/projects"
                            className="hover:underline"
                        >
                            프로젝트
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
