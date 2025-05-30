// app/layout.tsx
import { ReactNode } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AuthProvider } from './context/AuthContext';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
export { metadata } from './metadata';

export default async function RootLayout({ children }: { children: ReactNode }) {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return (
        <html lang="ko">
            <body>
                <AuthProvider initialSession={session}>
                    <Navbar />
                    {children}
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
