// components/RichTextEditor.tsx

'use client';

import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { supabase } from '@/lib/supabase';

export default function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
    const editor = useEditor({
        extensions: [StarterKit, Image],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const addImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                const filePath = `event-description-images/${Date.now()}_${file.name}`;
                const { error: uploadError } = await supabase.storage.from('eventimage').upload(filePath, file);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('eventimage').getPublicUrl(filePath);
                const url = data.publicUrl;

                editor?.chain().focus().setImage({ src: url }).run();
            } catch (error) {
                console.error('이미지 업로드 실패', error);
            }
        };
    };

    return (
        <div>
            <div className="mb-2 flex gap-2">
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded ${
                        editor?.isActive('bold') ? 'bg-emerald-600 text-white' : 'bg-gray-200'
                    }`}
                >
                    Bold
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 rounded ${
                        editor?.isActive('italic') ? 'bg-emerald-600 text-white' : 'bg-gray-200'
                    }`}
                >
                    Italic
                </button>
                <button type="button" onClick={addImage} className="px-3 py-1 rounded bg-blue-600 text-white">
                    이미지 삽입
                </button>
            </div>
            <EditorContent
                editor={editor}
                className="min-h-[200px] border rounded p-3 prose prose-sm prose-emerald max-w-none"
            />
        </div>
    );
}
