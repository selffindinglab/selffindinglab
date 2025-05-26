'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { brandColors } from '@/lib/context';
import Image from 'next/image';

export default function Navbar() {
    const { session, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };
    const navItems = [
        { label: '소개', href: '/intro' },
        { label: '출판물', href: '/books' },
        { label: '소식', href: '/news' },
        { label: '프로젝트', href: '/projects' },
    ];

    return (
        <header className="fixed top-0 w-full z-50 shadow" style={{ backgroundColor: brandColors.secondary }}>
            <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center font-medium tracking-wide">
                <Link
                    href="/"
                    className="waguri-font text-lg sm:text-3xl font-semibold flex items-center gap-2"
                    style={{ color: brandColors.primary }}
                >
                    <Image
                        src="/logo.png"
                        alt="Selffinding Lab 로고" // alt 속성 꼭 넣기
                        width={100} // 원하는 크기로 지정 (예: 48px)
                        height={100} // width와 비율 맞게 설정
                        priority // 로고는 중요 이미지이므로 우선 로딩
                    />
                </Link>

                <ul className="flex gap-6 text-xl sm:text-2xl items-center" style={{ color: brandColors.textDark }}>
                    {navItems.map(({ label, href }) => (
                        <li key={href}>
                            <Link href={href} className="waguri-font hover:underline">
                                {label}
                            </Link>
                        </li>
                    ))}
                    {session ? (
                        <li>
                            <button onClick={handleLogout} className="hover:underline waguri-font">
                                로그아웃
                            </button>
                        </li>
                    ) : (
                        <li>
                            <Link href="/login" className="hover:underline waguri-font">
                                로그인
                            </Link>
                        </li>
                    )}
                    {session ? (
                        <li key={'/admin'}>
                            <Link href={'/admin'} className="waguri-font hover:underline">
                                관리자
                            </Link>
                        </li>
                    ) : null}
                </ul>
            </nav>
        </header>
    );
}
