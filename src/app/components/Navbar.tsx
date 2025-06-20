'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useHydration } from '../lib/hook/useHydration';

export default function Navbar() {
    const { session, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const hydrated = useHydration();

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const isScrolled = scrollY > 10;
    const bgColorClass = isScrolled ? '' : 'bg-deep-ocean';
    const backgroundStyle = isScrolled
        ? { backgroundColor: `rgba(255, 255, 255, ${Math.min(scrollY / 200, 0.95)})` }
        : {};
    const textColor = isScrolled ? 'text-black' : 'text-white';
    const buttonIconColor = isScrolled ? 'text-black' : 'text-white';
    const logoSrc = isScrolled ? '/logob.png' : '/logo.png';

    return (
        <header
            className={`fixed top-0 w-full z-50 duration-300 transition-colors ${bgColorClass}`}
            style={backgroundStyle}
        >
            <nav className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center font-medium tracking-wide">
                <Link
                    href="/"
                    className={`waguri-font text-lg sm:text-3xl font-semibold flex items-center gap-2 ${textColor}`}
                >
                    <Image
                        src={logoSrc}
                        alt="Selffinding Lab 로고"
                        width={100}
                        height={100}
                        priority
                        className="w-10 h-10 sm:w-16 sm:h-16" // 모바일: 40px, sm 이상: 96px
                    />
                </Link>

                <ul className={`hidden md:flex gap-6 text-xl sm:text-2xl items-center ${textColor}`}>
                    {renderNavItems()}
                    {renderAuthItems()}
                </ul>

                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (
                            <XMarkIcon className={`h-8 w-8 ${buttonIconColor}`} />
                        ) : (
                            <Bars3Icon className={`h-8 w-8 ${buttonIconColor}`} />
                        )}
                    </button>
                </div>
            </nav>

            {/* 모바일 메뉴 */}
            {mobileMenuOpen && (
                <div className="md:hidden shadow-lg w-full bg-deep-ocean text-white">
                    <ul className="flex flex-col items-start gap-4 px-6 py-4 text-xl">
                        {renderNavItems(true)}
                        {renderAuthItems(true)}
                    </ul>
                </div>
            )}
        </header>
    );
}
