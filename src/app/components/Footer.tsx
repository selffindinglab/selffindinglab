'use client';
import { title } from '@/lib/context';

export default function Footer() {
    return (
        <footer className="bg-black text-white py-10 text-center text-sm">
            <p>© 2025 {title}. All rights reserved.</p>
            <p className="mt-2">이메일: contact@sojaepress.com</p>
        </footer>
    );
}
