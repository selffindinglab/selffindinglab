// app/layout.tsx (또는 app/page.tsx 등 최상위 컴포넌트)
import { ReactNode } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AuthProvider } from './context/AuthContext';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
