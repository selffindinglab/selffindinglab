import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/auth-helpers-nextjs';
export async function signInAnonymously() {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
        console.error('Supabase 익명 로그인 실패:', error);
        throw error;
    }
    if (!data.user) {
        console.error('Supabase 익명 로그인 실패: 사용자 데이터가 없습니다.');
        throw new Error('User data is null');
    }
    console.log('Supabase 익명 로그인 성공:', data.user.id);
    return data.user;
}

export const getSession = async (): Promise<Session | null> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error('getSession error:', error.message);
        return null;
    }
    return data.session;
};
export const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
    return await supabase.auth.signOut();
};

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};
