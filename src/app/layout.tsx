// app/layout.tsx (또는 app/page.tsx 등 최상위 컴포넌트)
import { ReactNode } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AuthProvider } from './context/AuthContext';
import './globals.css';
import Navbar from './components/Navbar';
export default async function RootLayout({ children }: { children: ReactNode }) {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return (
        <html lang="ko">
            <body>
                {/* session을 AuthProvider에 초기값으로 넘겨줌 */}
                <AuthProvider initialSession={session}>
                    <Navbar />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
