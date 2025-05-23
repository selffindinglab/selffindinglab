'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Spinner from '../components/Spinner';

export default function ReframePoint() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { session, login, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace('/');
        }
    }, [session, router]);

    if (session === undefined) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch {
            setError('이메일 또는 비밀번호가 잘못되었습니다.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            {session ? (
                <>
                    <Spinner />
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md w-64 mt-4"
                        onClick={logout}
                    >
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">상담사 로그인</h1>
                    <input
                        className="border p-2 mb-2 w-64"
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border p-2 mb-2 w-64"
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-64"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </>
            )}
        </div>
    );
}
