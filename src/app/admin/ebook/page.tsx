'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';

type PageType = 'cover' | 'company' | 'toc' | 'content';

type PageContent = {
    coverImage?: string | null;
    description?: string;
    layout?: 'layout1' | 'layout2' | 'layout3' | 'layout4';
    text1?: string;
    text2?: string;
    image?: string | null;
    imageWidth?: number;
    imageHeight?: number;
};

type Page = {
    type: PageType;
    content: PageContent;
};

export default function EbookMaker() {
    const { session } = useAuth();
    const [bookTitle, setBookTitle] = useState<string>('');
    const [savedTitle, setSavedTitle] = useState<string>('');
    const [ebookId, setEbookId] = useState<string | null>(null);
    const [pages, setPages] = useState<Page[]>([
        { type: 'cover', content: { coverImage: null } },
        { type: 'company', content: { description: '' } },
        { type: 'toc', content: {} },
        { type: 'content', content: { layout: 'layout1', text1: '', text2: '', image: null } },
    ]);
    const [pendingImages, setPendingImages] = useState<{ [key: number]: File | null }>({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [draftContent, setDraftContent] = useState<PageContent>(pages[0].content);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerPageIndex, setViewerPageIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(false);
    const [viewerScale, setViewerScale] = useState(1.0);
    const [showThumbnails, setShowThumbnails] = useState(false);
    const [showTOC, setShowTOC] = useState(false);
    const [bookmarks, setBookmarks] = useState<number[]>([]);
    const captureRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const layouts = ['layout1', 'layout2', 'layout3', 'layout4'] as const;

    useEffect(() => {
        setDraftContent(pages[selectedIndex]?.content || {});
    }, [selectedIndex, pages]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isViewerOpen) return;
            if (e.key === 'ArrowLeft') {
                setViewerPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'ArrowRight') {
                setViewerPageIndex((prev) => (prev < pages.length - 1 ? prev + 1 : prev));
            } else if (e.key === '+') {
                setViewerScale((prev) => Math.min(prev + 0.1, 2.0));
            } else if (e.key === '-') {
                setViewerScale((prev) => Math.max(prev - 0.1, 0.5));
            } else if (e.key === 'Escape') {
                setIsViewerOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isViewerOpen, pages.length]);

    function updateDraftContent(newContent: Partial<PageContent>) {
        setDraftContent((prev) => ({ ...prev, ...newContent }));
    }

    async function uploadImageToStorage(file: File): Promise<string | null> {
        try {
            const filePath = `public/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage.from('ebook-images').upload(filePath, file, {
                upsert: true,
            });

            if (uploadError) {
                console.error('Image upload error:', uploadError);
                alert('이미지 업로드에 실패했습니다.');
                return null;
            }

            const { data } = supabase.storage.from('ebook-images').getPublicUrl(filePath);
            if (!data?.publicUrl) {
                console.error('Failed to get public URL for image:', filePath);
                alert('이미지 URL을 가져오지 못했습니다.');
                return null;
            }

            return data.publicUrl;
        } catch (error) {
            console.error('Unexpected error during image upload:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
            return null;
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('이미지 크기는 2MB를 초과할 수 없습니다.');
            return;
        }

        setImageLoading(true);
        const tempUrl = URL.createObjectURL(file);
        const updateKey = pages[selectedIndex].type === 'cover' ? 'coverImage' : 'image';

        const img = new window.Image();
        img.src = tempUrl;
        img.onload = () => {
            updateDraftContent({
                [updateKey]: tempUrl,
                imageWidth: img.naturalWidth,
                imageHeight: img.naturalHeight,
            });
            const newPages = [...pages];
            newPages[selectedIndex].content = {
                ...newPages[selectedIndex].content,
                [updateKey]: tempUrl,
                imageWidth: img.naturalWidth,
                imageHeight: img.naturalHeight,
            };
            setPages(newPages);
            setImageLoading(false);
        };

        setPendingImages((prev) => ({ ...prev, [selectedIndex]: file }));
    }

    async function savePageContent() {
        if (!session) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            setImageLoading(true);
            const newPages = [...pages];
            newPages[selectedIndex] = { ...newPages[selectedIndex], content: draftContent };

            const pendingImage = pendingImages[selectedIndex];
            if (pendingImage) {
                const imageUrl = await uploadImageToStorage(pendingImage);
                if (imageUrl) {
                    const updateKey = newPages[selectedIndex].type === 'cover' ? 'coverImage' : 'image';
                    newPages[selectedIndex].content[updateKey] = imageUrl;
                    setDraftContent((prev) => ({ ...prev, [updateKey]: imageUrl }));
                    setPendingImages((prev) => ({ ...prev, [selectedIndex]: null }));
                }
            }

            setPages(newPages);

            const currentTitle = bookTitle || 'Untitled Ebook';
            const isNewEbook = ebookId === null || currentTitle !== savedTitle;

            if (isNewEbook) {
                const { data, error } = await supabase
                    .from('ebooks')
                    .insert({
                        user_id: session.user.id,
                        title: currentTitle,
                        pages: newPages,
                        updated_at: new Date().toISOString(),
                    })
                    .select('id')
                    .single();

                if (error) {
                    console.error('Supabase insert error:', error);
                    alert('저장에 실패했습니다.');
                    return;
                }

                setEbookId(data.id);
                setSavedTitle(currentTitle);
            } else {
                const { error } = await supabase
                    .from('ebooks')
                    .update({
                        title: currentTitle,
                        pages: newPages,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', ebookId);

                if (error) {
                    console.error('Supabase update error:', error);
                    alert('업데이트에 실패했습니다.');
                    return;
                }

                setSavedTitle(currentTitle);
            }

            alert('저장되었습니다.');
        } catch (error) {
            console.error('Unexpected save error:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setImageLoading(false);
        }
    }

    async function generatePDF() {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < pages.length; i++) {
            const pageId = `page-${i}`;
            const node = document.getElementById(pageId);
            if (!node) continue;

            let attempts = 0;
            const maxAttempts = 3;
            let dataUrl: string | null = null;

            while (attempts < maxAttempts && !dataUrl) {
                try {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    dataUrl = await toPng(node, {
                        pixelRatio: 2,
                        quality: 0.95,
                        width: 595,
                        height: 842,
                        backgroundColor: '#ffffff',
                        cacheBust: true,
                    });
                } catch (error) {
                    console.error(`PDF generation error for page ${i + 1} (attempt ${attempts + 1}):`, error);
                    attempts++;
                }
            }

            if (dataUrl) {
                if (i > 0) pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            } else {
                console.warn(`Failed to capture page ${i + 1} after ${maxAttempts} attempts`);
            }
        }

        pdf.save(`${bookTitle || 'ebook'}.pdf`);
    }

    function addContentPage() {
        setPages((prev) => [
            ...prev,
            { type: 'content', content: { layout: 'layout1', text1: '', text2: '', image: null } },
        ]);
        setSelectedIndex(pages.length);
    }

    const renderPageList = () => (
        <ul className="space-y-2">
            {pages.map((page, idx) => (
                <li
                    key={idx}
                    className={`cursor-pointer px-4 py-2 rounded transition-colors ${
                        idx === selectedIndex ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedIndex(idx)}
                >
                    {idx + 1}.{' '}
                    {page.type === 'cover'
                        ? '커버'
                        : page.type === 'company'
                        ? '회사 소개'
                        : page.type === 'toc'
                        ? '목차'
                        : `내용 페이지${pages.length > 3 ? ` ${idx - 2}` : ' 1'}`}
                </li>
            ))}
        </ul>
    );

    const renderLayoutSelector = () => {
        const layoutPreviews = {
            layout1: (
                <div className="border p-2 cursor-pointer flex flex-col items-center gap-2 w-32 bg-white">
                    <div className="w-full h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                        텍스트1
                    </div>
                    <div className="w-full h-24 bg-gray-300 flex items-center justify-center text-white text-sm">
                        이미지
                    </div>
                    <div className="w-full h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                        텍스트2
                    </div>
                </div>
            ),
            layout2: (
                <div className="border p-2 cursor-pointer flex flex-col items-center gap-2 w-32 bg-white">
                    <div className="w-full h-24 bg-gray-300 flex items-center justify-center text-white text-sm">
                        이미지
                    </div>
                    <div className="w-full h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                        텍스트1
                    </div>
                </div>
            ),
            layout3: (
                <div className="border p-2 cursor-pointer flex flex-row items-center gap-2 w-48 bg-white">
                    <div className="w-24 h-24 bg-gray-300 flex items-center justify-center text-white text-sm">
                        이미지
                    </div>
                    <div className="flex flex-col gap-1 w-24">
                        <div className="w-full h-6 bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                            텍스트1
                        </div>
                        <div className="w-full h-6 bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                            텍스트2
                        </div>
                    </div>
                </div>
            ),
            layout4: (
                <div className="border p-2 cursor-pointer w-32 bg-white">
                    <div className="w-full h-48 bg-gray-300 text-center flex items-center justify-center text-white font-bold text-sm">
                        자유 레이아웃
                    </div>
                </div>
            ),
        };

        return (
            <div className="flex gap-4 mb-4">
                {layouts.map((layout) => (
                    <div
                        key={layout}
                        onClick={() => updateDraftContent({ layout })}
                        className={`rounded cursor-pointer select-none shadow-sm ${
                            draftContent.layout === layout ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300'
                        } hover:ring-2 hover:ring-blue-300 transition`}
                    >
                        {layoutPreviews[layout]}
                    </div>
                ))}
            </div>
        );
    };

    const renderCoverEditor = () => (
        <>
            <h2 className="text-2xl font-semibold mb-4">책 커버 이미지 업로드</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded" />
            {imageLoading && <p className="text-gray-500 mt-2">이미지 로딩 중...</p>}
            {draftContent.coverImage && (
                <Image
                    src={draftContent.coverImage}
                    alt="커버 이미지"
                    width={draftContent.imageWidth || 800}
                    height={draftContent.imageHeight || 400}
                    className="mt-4 max-w-full max-h-[400px] object-contain border rounded shadow-sm"
                />
            )}
        </>
    );

    const renderEditor = () => {
        const page = pages[selectedIndex];
        if (!page) return <p className="text-red-500">잘못된 페이지입니다.</p>;

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">책 제목</h2>
                <input
                    type="text"
                    placeholder="책 제목을 입력하세요"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {page.type === 'cover' && renderCoverEditor()}
                {page.type === 'company' && (
                    <>
                        <h2 className="text-2xl font-semibold">회사 소개</h2>
                        <textarea
                            placeholder="회사 소개를 입력하세요"
                            value={draftContent.description || ''}
                            onChange={(e) => updateDraftContent({ description: e.target.value })}
                            className="w-full border p-3 rounded h-32 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="mt-4 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
                            {draftContent.description}
                        </div>
                    </>
                )}
                {page.type === 'toc' && (
                    <>
                        <h2 className="text-2xl font-semibold">목차</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            {pages.slice(3).map((p, i) => (
                                <li key={i}>{`페이지 ${i + 4} - ${p.content.text1?.slice(0, 20) || '내용'}`}</li>
                            ))}
                        </ol>
                    </>
                )}
                {page.type === 'content' && (
                    <>
                        <h2 className="text-2xl font-semibold">내용 페이지 {selectedIndex + 1}</h2>
                        {renderLayoutSelector()}
                        <textarea
                            placeholder="첫 번째 글"
                            value={draftContent.text1 || ''}
                            onChange={(e) => updateDraftContent({ text1: e.target.value })}
                            className="w-full border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            placeholder="두 번째 글 (선택)"
                            value={draftContent.text2 || ''}
                            onChange={(e) => updateDraftContent({ text2: e.target.value })}
                            className="w-full border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full p-2 border rounded"
                        />
                        {imageLoading && <p className="text-gray-500 mt-2">이미지 로딩 중...</p>}
                        {draftContent.image && (
                            <Image
                                src={draftContent.image}
                                alt="업로드된 이미지"
                                width={draftContent.imageWidth || 400}
                                height={draftContent.imageHeight || 256}
                                className="my-4 max-h-64 object-contain border rounded shadow-sm"
                            />
                        )}
                    </>
                )}
            </div>
        );
    };

    const renderPagePreview = useCallback(
        (page: Page, index: number, isForPDF: boolean = false, isViewer: boolean = false) => {
            const a4Width = 210; // mm
            const a4Height = 297; // mm
            let maxWidth: number;
            let maxHeight: number;
            let scale = 1.0;

            if (isForPDF) {
                maxWidth = 595; // A4 width in pixels at 72 DPI
                maxHeight = 842; // A4 height in pixels at 72 DPI
            } else if (isViewer) {
                maxWidth = window.innerWidth * 0.95;
                maxHeight = window.innerHeight * 0.95;
            } else {
                const previewContainer = previewRef.current;
                maxWidth = previewContainer ? previewContainer.clientWidth - 32 : window.innerWidth * 0.4;
                maxHeight = previewContainer ? previewContainer.clientHeight - 48 : window.innerHeight * 0.5;
            }

            const widthScale = maxWidth / a4Width;
            const heightScale = maxHeight / a4Height;
            scale = Math.min(widthScale, heightScale);

            const scaledWidth = a4Width * scale;
            const scaledHeight = a4Height * scale;

            const content = isForPDF || isViewer ? page.content : draftContent;

            // Image container dimensions for content pages
            const contentImageContainerWidth =
                content.layout === 'layout3'
                    ? isForPDF
                        ? 297.5
                        : a4Width * 0.5 * 2.83465 * scale
                    : isForPDF
                    ? 595
                    : a4Width * 2.83465 * scale;
            const contentImageContainerHeight = isForPDF ? 421 : a4Height * 0.5 * 2.83465 * scale;

            return (
                <div
                    id={`page-${index}`}
                    key={index}
                    className={`border bg-white shadow-lg ${
                        isForPDF ? 'absolute' : ''
                    } transition-transform duration-300 overflow-hidden`}
                    style={{
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                        transform: isForPDF ? 'none' : `scale(${isViewer ? viewerScale : 1})`,
                        transformOrigin: 'top left',
                        visibility: isForPDF ? 'hidden' : 'visible',
                        maxWidth: isForPDF ? 'none' : `${maxWidth}px`,
                        maxHeight: isForPDF ? 'none' : `${maxHeight}px`,
                    }}
                >
                    <div
                        className="w-[210mm] h-[297mm] bg-white p-6 flex flex-col"
                        style={{
                            boxSizing: 'border-box',
                            transform: `scale(${isForPDF ? 1 : scale})`,
                            transformOrigin: 'top left',
                            width: '210mm',
                            height: '297mm',
                        }}
                    >
                        {page.type === 'cover' && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                                {imageLoading ? (
                                    <span className="text-gray-500">이미지 로딩 중...</span>
                                ) : content.coverImage ? (
                                    <Image
                                        src={content.coverImage}
                                        alt="커버 이미지"
                                        width={isForPDF ? 595 : scaledWidth * 2.83465}
                                        height={isForPDF ? 842 : scaledHeight * 2.83465}
                                        className="w-full h-full object-contain rounded"
                                        priority={isForPDF || isViewer}
                                    />
                                ) : (
                                    <span className="text-gray-400">커버 이미지 없음</span>
                                )}
                            </div>
                        )}
                        {page.type === 'company' && (
                            <div className="w-full h-full">
                                <h1 className="text-3xl font-bold mb-4">회사 소개</h1>
                                <p className="whitespace-pre-wrap text-base">{content.description || '내용 없음'}</p>
                            </div>
                        )}
                        {page.type === 'toc' && (
                            <div className="w-full h-full">
                                <h1 className="text-3xl font-bold mb-6">목차</h1>
                                <ol className="list-decimal list-inside space-y-2 text-base">
                                    {pages.slice(3).map((p, i) => (
                                        <li key={i}>{p.content.text1?.slice(0, 30) || `내용 페이지 ${i + 1}`}</li>
                                    ))}
                                </ol>
                            </div>
                        )}
                        {page.type === 'content' && (
                            <div className="w-full h-full flex flex-col">
                                {content.layout === 'layout1' && (
                                    <>
                                        <div className="mb-4 text-base flex-1">{content.text1 || '텍스트 없음'}</div>
                                        {imageLoading ? (
                                            <span className="text-gray-500">이미지 로딩 중...</span>
                                        ) : content.image ? (
                                            <div
                                                className="mb-4 rounded overflow-hidden"
                                                style={{
                                                    width: `${contentImageContainerWidth}px`,
                                                    height: `${contentImageContainerHeight}px`,
                                                }}
                                            >
                                                <Image
                                                    src={content.image}
                                                    alt="내용 이미지"
                                                    width={contentImageContainerWidth}
                                                    height={contentImageContainerHeight}
                                                    className="w-full h-full object-contain"
                                                    priority={isForPDF || isViewer}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">이미지 없음</span>
                                        )}
                                        <div className="mt-auto text-base">{content.text2 || ''}</div>
                                    </>
                                )}
                                {content.layout === 'layout2' && (
                                    <>
                                        {imageLoading ? (
                                            <span className="text-gray-500">이미지 로딩 중...</span>
                                        ) : content.image ? (
                                            <div
                                                className="mb-4 rounded overflow-hidden"
                                                style={{
                                                    width: `${contentImageContainerWidth}px`,
                                                    height: `${contentImageContainerHeight}px`,
                                                }}
                                            >
                                                <Image
                                                    src={content.image}
                                                    alt="내용 이미지"
                                                    width={contentImageContainerWidth}
                                                    height={contentImageContainerHeight}
                                                    className="w-full h-full object-contain"
                                                    priority={isForPDF || isViewer}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">이미지 없음</span>
                                        )}
                                        <div className="text-base flex-1">{content.text1 || '텍스트 없음'}</div>
                                    </>
                                )}
                                {content.layout === 'layout3' && (
                                    <div className="flex gap-6 h-full">
                                        {imageLoading ? (
                                            <span className="text-gray-500">이미지 로딩 중...</span>
                                        ) : content.image ? (
                                            <div
                                                className="rounded overflow-hidden"
                                                style={{
                                                    width: `${contentImageContainerWidth}px`,
                                                    height: `${contentImageContainerHeight}px`,
                                                }}
                                            >
                                                <Image
                                                    src={content.image}
                                                    alt="내용 이미지"
                                                    width={contentImageContainerWidth}
                                                    height={contentImageContainerHeight}
                                                    className="w-full h-full object-contain"
                                                    priority={isForPDF || isViewer}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">이미지 없음</span>
                                        )}
                                        <div className="flex flex-col justify-between flex-1">
                                            <div className="text-base">{content.text1 || '텍스트 없음'}</div>
                                            <div className="text-base">{content.text2 || ''}</div>
                                        </div>
                                    </div>
                                )}
                                {content.layout === 'layout4' && (
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4 text-base flex-1">{content.text1 || '텍스트 없음'}</div>
                                        {imageLoading ? (
                                            <span className="text-gray-500">이미지 로딩 중...</span>
                                        ) : content.image ? (
                                            <div
                                                className="mb-4 rounded overflow-hidden"
                                                style={{
                                                    width: `${contentImageContainerWidth}px`,
                                                    height: `${contentImageContainerHeight}px`,
                                                }}
                                            >
                                                <Image
                                                    src={content.image}
                                                    alt="내용 이미지"
                                                    width={contentImageContainerWidth}
                                                    height={contentImageContainerHeight}
                                                    className="w-full h-full object-contain"
                                                    priority={isForPDF || isViewer}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">이미지 없음</span>
                                        )}
                                        <div className="text-base">{content.text2 || ''}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        },
        [draftContent, viewerScale, previewRef, pages, imageLoading]
    );

    const renderEbookViewer = () => {
        const handlePrevPage = () => {
            if (viewerPageIndex > 0) {
                setViewerPageIndex((prev) => prev - 1);
                setShowThumbnails(false);
                setShowTOC(false);
            }
        };

        const handleNextPage = () => {
            if (viewerPageIndex < pages.length - 1) {
                setViewerPageIndex((prev) => prev + 1);
                setShowThumbnails(false);
                setShowTOC(false);
            }
        };

        const handleZoomIn = () => setViewerScale((prev) => Math.min(prev + 0.1, 2.0));
        const handleZoomOut = () => setViewerScale((prev) => Math.max(prev - 0.1, 0.5));

        const toggleBookmark = () => {
            setBookmarks((prev) =>
                prev.includes(viewerPageIndex)
                    ? prev.filter((idx) => idx !== viewerPageIndex)
                    : [...prev, viewerPageIndex]
            );
        };

        const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setViewerPageIndex(Number(e.target.value));
            setShowThumbnails(false);
            setShowTOC(false);
        };

        const renderThumbnails = () => (
            <div className="absolute left-0 top-16 bottom-16 w-48 bg-white shadow-lg p-4 overflow-y-auto rounded-r-lg z-10">
                <h3 className="text-lg font-semibold mb-4">페이지 미리보기</h3>
                <div className="grid grid-cols-2 gap-2">
                    {pages.map((page, idx) => (
                        <div
                            key={idx}
                            className={`cursor-pointer p-2 rounded ${
                                idx === viewerPageIndex ? 'ring-2 ring-blue-500' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => {
                                setViewerPageIndex(idx);
                                setShowThumbnails(false);
                            }}
                        >
                            <div className="border bg-white">{renderPagePreview(page, idx, false, false)}</div>
                            <p className="text-xs text-center mt-1">페이지 {idx + 1}</p>
                        </div>
                    ))}
                </div>
            </div>
        );

        const renderTOC = () => (
            <div className="absolute right-0 top-16 bottom-16 w-48 bg-white shadow-lg p-4 overflow-y-auto rounded-l-lg z-10">
                <h3 className="text-lg font-semibold mb-4">목차</h3>
                <ul className="space-y-2">
                    {pages.map((page, idx) => (
                        <li
                            key={idx}
                            className={`cursor-pointer p-2 rounded ${
                                idx === selectedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => {
                                setViewerPageIndex(idx);
                                setShowTOC(false);
                            }}
                        >
                            {page.type === 'cover'
                                ? '커버'
                                : page.type === 'company'
                                ? '회사 소개'
                                : page.type === 'toc'
                                ? '목차'
                                : `내용 페이지${pages.length > 3 ? ` ${idx - 2}` : ' 1'}`}
                        </li>
                    ))}
                </ul>
            </div>
        );

        return (
            <div
                className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col z-50"
                role="dialog"
                aria-label="eBook 뷰어"
                ref={viewerRef}
            >
                <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowThumbnails((prev) => !prev)}
                            className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                            aria-label="페이지 썸네일 보기"
                        >
                            썸네일
                        </button>
                        <button
                            onClick={() => setShowTOC((prev) => !prev)}
                            className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                            aria-label="목차 보기"
                        >
                            목차
                        </button>
                        <button
                            onClick={toggleBookmark}
                            className={`px-3 py-2 rounded transition ${
                                bookmarks.includes(viewerPageIndex)
                                    ? 'bg-yellow-600 hover:bg-yellow-700'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            aria-label={bookmarks.includes(viewerPageIndex) ? '북마크 제거' : '북마크 추가'}
                        >
                            {bookmarks.includes(viewerPageIndex) ? '북마크 제거' : '북마크 추가'}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleZoomOut}
                            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                            aria-label="축소"
                        >
                            -
                        </button>
                        <span>{Math.round(viewerScale * 100)}%</span>
                        <button
                            onClick={handleZoomIn}
                            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                            aria-label="확대"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={() => setIsViewerOpen(false)}
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                        aria-label="뷰어 닫기"
                    >
                        닫기
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 overflow-auto">
                    <div className="relative flex items-center justify-center">
                        {showThumbnails && renderThumbnails()}
                        {showTOC && renderTOC()}
                        <div className="bg-white rounded-lg shadow-xl p-4">
                            {renderPagePreview(pages[viewerPageIndex], viewerPageIndex, false, true)}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                    <button
                        onClick={handlePrevPage}
                        disabled={viewerPageIndex === 0}
                        className={`px-4 py-2 rounded font-semibold transition ${
                            viewerPageIndex === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        aria-label="이전 페이지"
                    >
                        이전
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">
                            페이지 {viewerPageIndex + 1} / {pages.length}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={pages.length - 1}
                            value={viewerPageIndex}
                            onChange={handleSliderChange}
                            className="w-64"
                            aria-label="페이지 탐색 슬라이더"
                        />
                    </div>
                    <button
                        onClick={handleNextPage}
                        disabled={viewerPageIndex === pages.length - 1}
                        className={`px-4 py-2 rounded font-semibold transition ${
                            viewerPageIndex === pages.length - 1
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        aria-label="다음 페이지"
                    >
                        다음
                    </button>
                </div>
            </div>
        );
    };

    const memoizedPreview = useMemo(() => {
        if (!pages[selectedIndex]) return <p className="text-gray-500">선택된 페이지가 없습니다.</p>;
        return renderPagePreview(pages[selectedIndex], selectedIndex);
    }, [selectedIndex, pages, renderPagePreview]);

    return (
        <div className="flex flex-col h-screen gap-4 p-6 bg-gray-100">
            <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">E-Book Maker</h1>
                <div className="flex gap-4">
                    <button
                        onClick={savePageContent}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
                    >
                        저장
                    </button>
                    {pages[selectedIndex]?.type === 'content' && (
                        <button
                            onClick={addContentPage}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold"
                        >
                            새 내용 페이지 추가
                        </button>
                    )}
                    <button
                        onClick={generatePDF}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition font-semibold"
                    >
                        PDF로 내보내기
                    </button>
                    <button
                        onClick={() => setIsViewerOpen(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition font-semibold"
                    >
                        eBook 보기
                    </button>
                </div>
            </header>

            <div className="flex flex-1 gap-6 mt-20">
                <aside className="w-64 bg-white border rounded-lg p-4 shadow-sm overflow-auto">
                    {renderPageList()}
                </aside>

                <main className="flex-1 bg-white border rounded-lg p-6 shadow-sm overflow-auto">{renderEditor()}</main>

                <section
                    ref={previewRef}
                    className="fixed bottom-6 right-6 max-w-[40vw] max-h-[50vh] bg-white border rounded-lg p-4 shadow-lg z-40 overflow-hidden"
                >
                    <h3 className="font-semibold mb-2 text-center text-gray-800">
                        미리보기 (페이지 {selectedIndex + 1})
                    </h3>
                    <div className="flex justify-center items-center h-[calc(100%-2rem)] overflow-hidden">
                        {memoizedPreview}
                    </div>
                </section>
            </div>

            {isViewerOpen && renderEbookViewer()}

            <div ref={captureRef} className="absolute" style={{ top: '-9999px', left: '-9999px' }}>
                {pages.map((page, idx) => renderPagePreview(page, idx, true))}
            </div>
        </div>
    );
}
