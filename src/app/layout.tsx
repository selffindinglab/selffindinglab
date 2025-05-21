import './globals.css';
import { ReactNode } from 'react';
import Navbar from './components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
            <body className="font-sans bg-white text-black">
                <Navbar />
                {children}
            </body>
        </html>
    );
}
