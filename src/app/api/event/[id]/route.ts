import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { data, error } = await supabase.from('event').select('*').eq('id', params.id).single();

    if (error || !data) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}
