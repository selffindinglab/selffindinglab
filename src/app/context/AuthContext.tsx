'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
    session: Session | null;
    login: (email: string, password: string, redirectTo?: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: React.ReactNode;
    initialSession: Session | null;
};

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
    const [session, setSession] = useState<Session | null>(initialSession);
    const router = useRouter();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string, redirectTo?: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('로그인 실패: ' + error.message);
        } else if (redirectTo) {
            router.replace(redirectTo);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
