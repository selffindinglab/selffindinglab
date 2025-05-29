'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { brandColors } from '@/lib/context';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useHydration } from '../hook/useHydration';

export default function Navbar() {
    const { session, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const hydrated = useHydration();

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    if (!hydrated) return null;

    const navItems = [
        { label: '소개', href: '/intro' },
        { label: '출판물', href: '/books' },
        { label: '소식', href: '/news' },
        { label: '프로젝트', href: '/projects' },
    ];

    const renderNavItems = (isMobile = false) =>
        navItems.map(({ label, href }) => (
            <li key={href}>
                <Link
                    href={href}
                    className="waguri-font hover:underline"
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                    {label}
                </Link>
            </li>
        ));

    const renderAuthItems = (isMobile = false) =>
        session ? (
            <>
                <li>
                    <button
                        onClick={async () => {
                            await logout();
                            if (isMobile) setMobileMenuOpen(false);
                        }}
                        className="hover:underline waguri-font"
                    >
                        로그아웃
                    </button>
                </li>
                <li>
                    <Link
                        href="/admin"
                        className="waguri-font hover:underline"
                        onClick={() => isMobile && setMobileMenuOpen(false)}
                    >
                        관리자
                    </Link>
                </li>
            </>
        ) : (
            <li>
                <Link
                    href="/login"
                    className="hover:underline waguri-font"
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                    로그인
                </Link>
            </li>
        );

    return (
        <header className="fixed top-0 w-full z-50 shadow" style={{ backgroundColor: brandColors.secondary }}>
            <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center font-medium tracking-wide">
                <Link
                    href="/"
                    className="waguri-font text-lg sm:text-3xl font-semibold flex items-center gap-2"
                    style={{ color: brandColors.primary }}
                >
                    <Image src="/logo.png" alt="Selffinding Lab 로고" width={100} height={100} priority />
                </Link>

                {/* 데스크탑 메뉴 */}
                <ul
                    className="hidden md:flex gap-6 text-xl sm:text-2xl items-center"
                    style={{ color: brandColors.textDark }}
                >
                    {renderNavItems()}
                    {renderAuthItems()}
                </ul>

                {/* 햄버거 버튼 */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (
                            <XMarkIcon className="h-8 w-8" style={{ color: brandColors.textDark }} />
                        ) : (
                            <Bars3Icon className="h-8 w-8" style={{ color: brandColors.textDark }} />
                        )}
                    </button>
                </div>
            </nav>

            {/* 모바일 메뉴 */}
            {mobileMenuOpen && (
                <div className="md:hidden shadow-lg w-full" style={{ backgroundColor: brandColors.secondary }}>
                    <ul
                        className="flex flex-col items-start gap-4 px-6 py-4 text-xl"
                        style={{ color: brandColors.textDark }}
                    >
                        {renderNavItems(true)}
                        {renderAuthItems(true)}
                    </ul>
                </div>
            )}
        </header>
    );
}
