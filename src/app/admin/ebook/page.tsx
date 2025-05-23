'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';

type PageType = 'cover' | 'company' | 'toc' | 'content';

type PageContent = {
    coverImage?: string | null;
    description?: string;
    layout?: 'layout1' | 'layout2' | 'layout3' | 'layout4';
    text1?: string;
    text2?: string;
    image?: string | null;
};

type Page = {
    type: PageType;
    content: PageContent;
};

export default function EbookMaker() {
    const { session } = useAuth();
    const [pages, setPages] = useState<Page[]>([
        { type: 'cover', content: { coverImage: null } },
        { type: 'company', content: { description: '' } },
        { type: 'toc', content: {} },
        { type: 'content', content: { layout: 'layout1', text1: '', text2: '', image: null } },
    ]);

    const layouts = ['layout1', 'layout2', 'layout3', 'layout4'] as const;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [draftContent, setDraftContent] = useState<PageContent>(pages[0].content);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerPageIndex, setViewerPageIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(false);
    const captureRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function initialize() {
            try {
                // ebooks 데이터 조회
                const { data: ebookData, error } = await supabase
                    .from('ebooks')
                    .select('pages')
                    .eq('user_id', session?.user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Supabase 데이터 조회 실패:', error);
                    return;
                }

                if (ebookData?.pages) {
                    setPages(ebookData.pages);
                    setDraftContent(ebookData.pages[0]?.content || {});
                    console.log('Supabase에서 페이지 데이터 로드:', ebookData.pages);
                } else {
                    console.log('Supabase에 데이터 없음, 기본 페이지 사용');
                }
            } catch (error) {
                console.error('Supabase 초기화 실패:', error);
            }
        }

        if (session?.user.id) {
            initialize();
        }
    }, [session]);

    useEffect(() => {
        const content = pages[selectedIndex]?.content || {};
        setDraftContent(content);
        console.log('미리보기 draftContent 업데이트:', {
            selectedIndex,
            content,
            hasImage: !!(content.image || content.coverImage),
        });
    }, [selectedIndex, pages]);

    useEffect(() => {
        if (isViewerOpen) {
            console.log('eBook 뷰어 모드 진입');
            setViewerPageIndex(0);
        } else {
            console.log('eBook 뷰어 모드 종료');
        }
    }, [isViewerOpen]);

    function updateDraftContent(newContent: Partial<PageContent>) {
        setDraftContent((prev) => {
            const updated = { ...prev, ...newContent };
            console.log('draftContent 업데이트:', {
                updated,
                hasImage: !!(updated.image || updated.coverImage),
            });
            return updated;
        });
    }

    async function savePageContent() {
        if (!session) {
            alert('사용자 인증이 필요합니다.');
            console.error('저장 실패: 사용자 인증 없음');
            return;
        }

        try {
            // draftContent를 현재 페이지에 반영
            const newPages = [...pages];
            newPages[selectedIndex] = { ...newPages[selectedIndex], content: draftContent };
            setPages(newPages);

            // Supabase에 저장
            const { data, error } = await supabase
                .from('ebooks')
                .upsert(
                    {
                        user_id: session.user.id,
                        pages: newPages,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'user_id' }
                )
                .select();

            if (error) {
                console.error('Supabase 저장 실패:', error);
                alert('저장에 실패했습니다.');
                return;
            }

            console.log('Supabase 저장 성공:', {
                userId: session.user.id,
                pageCount: newPages.length,
                data,
            });
            alert('저장되었습니다.');
        } catch (error) {
            console.error('저장 오류:', error);
            alert('저장에 실패했습니다.');
        }
    }

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            console.warn('이미지 업로드: 파일 선택되지 않음');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('이미지 크기는 2MB를 초과할 수 없습니다.');
            console.error('이미지 업로드 실패: 크기 초과', file.size);
            return;
        }

        setImageLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            const imageData = reader.result as string;
            const updateKey = pages[selectedIndex].type === 'cover' ? 'coverImage' : 'image';
            updateDraftContent({ [updateKey]: imageData });
            console.log('이미지 업로드 성공:', {
                fileName: file.name,
                size: file.size,
                dataUrl: imageData.slice(0, 50) + '...',
            });
            setImageLoading(false);
        };
        reader.onerror = () => {
            console.error('이미지 업로드 실패:', file.name);
            alert('이미지 업로드에 실패했습니다.');
            setImageLoading(false);
        };
        reader.readAsDataURL(file);
    }

    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < pages.length; i++) {
            const pageId = `page-${i}`;
            const node = document.getElementById(pageId);
            if (!node) {
                console.warn(`페이지 ${pageId} (${pages[i].type})를 찾을 수 없습니다.`);
                continue;
            }

            try {
                console.log(`페이지 ${i + 1} (${pages[i].type}) PDF 캡처 시작`);
                await new Promise((resolve) => setTimeout(resolve, 200));
                const dataUrl = await toPng(node, {
                    pixelRatio: 1.5,
                    quality: 0.8,
                    width: 595,
                    height: 842,
                    cacheBust: true,
                });
                console.log(
                    `페이지 ${i + 1} (${pages[i].type}) 캡처 성공:`,
                    dataUrl.slice(0, 50) + '...',
                    `콘텐츠: 텍스트=${
                        (pages[i].content.text1?.length || 0) + (pages[i].content.text2?.length || 0)
                    }자, 이미지=${pages[i].content.image || pages[i].content.coverImage ? '있음' : '없음'}`
                );
                if (i > 0) pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            } catch (error) {
                console.error(`PDF 생성 오류 (페이지 ${i + 1}, ${pages[i].type}):`, error);
            }
        }

        pdf.save('ebook.pdf');
        console.log('PDF 저장 완료: ebook.pdf');
    };

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
                    className={`cursor-pointer px-4 py-2 rounded ${
                        idx === selectedIndex ? 'bg-blue-600 text-white' : 'bg-gray-100'
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
                <div className="border p-2 cursor-pointer flex flex-col items-center gap-2 w-32">
                    <div className="w-full h-12 bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                        텍스트1
                    </div>
                    <div className="w-full h-24 bg-gray-400 flex items-center justify-center text-white text-sm">
                        이미지
                    </div>
                    <div className="w-full h-12 bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                        텍스트2
                    </div>
                </div>
            ),
            layout2: (
                <div className="border p-2 cursor-pointer flex flex-col items-center gap-2 w-32">
                    <div className="w-full h-24 bg-gray-400 flex items-center justify-center text-white text-sm">
                        이미지
                    </div>
                    <div className="w-full h-12 bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                        텍스트1
                    </div>
                </div>
            ),
            layout3: (
                <div className="border p-2 cursor-pointer flex flex-row items-center gap-2 w-48">
                    <div className="w-24 h-24 bg-gray-400 flex items-center justify-center text-white text-sm">
                        이미지
                    </div>
                    <div className="flex flex-col gap-1 w-24">
                        <div className="w-full h-6 bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                            텍스트1
                        </div>
                        <div className="w-full h-6 bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                            텍스트2
                        </div>
                    </div>
                </div>
            ),
            layout4: (
                <div className="border p-2 cursor-pointer w-32">
                    <div className="w-full h-48 bg-gray-400 text-center flex items-center justify-center text-white font-bold text-sm">
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
                        className={`rounded cursor-pointer select-none ${
                            draftContent.layout === layout ? 'ring-4 ring-blue-500' : 'ring-1 ring-gray-300'
                        }`}
                    >
                        {layoutPreviews[layout]}
                    </div>
                ))}
            </div>
        );
    };

    const renderCoverEditor = () => (
        <>
            <h2 className="text-4xl font-bold mb-4">책 커버 이미지 업로드</h2>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
            />
            {imageLoading && <p className="text-gray-500 mt-2">이미지 로딩 중...</p>}
            {draftContent.coverImage && (
                <Image
                    src={draftContent.coverImage}
                    alt="커버 이미지"
                    width={800}
                    height={400}
                    className="mt-6 max-w-full max-h-[400px] object-contain border"
                    onError={() => console.error('커버 이미지 로딩 실패 (편집기)')}
                    onLoad={() => console.log('커버 이미지 로딩 성공 (편집기)')}
                />
            )}
        </>
    );

    const renderEditor = () => {
        const page = pages[selectedIndex];
        if (!page) return <p>잘못된 페이지입니다.</p>;

        switch (page.type) {
            case 'cover':
                return renderCoverEditor();
            case 'company':
                return (
                    <>
                        <h2 className="text-3xl font-bold mb-4">회사 소개</h2>
                        <textarea
                            placeholder="회사 소개를 입력하세요"
                            value={draftContent.description || ''}
                            onChange={(e) => updateDraftContent({ description: e.target.value })}
                            className="w-full border p-2 h-32"
                        />
                        <div className="mt-4 p-4 border bg-gray-50 whitespace-pre-wrap">{draftContent.description}</div>
                    </>
                );
            case 'toc':
                return (
                    <>
                        <h2 className="text-3xl font-bold mb-4">목차</h2>
                        <ol className="list-decimal list-inside">
                            {pages.slice(3).map((p, i) => (
                                <li key={i}>{`페이지 ${i + 4} - ${p.content.text1?.slice(0, 20) || '내용'}`}</li>
                            ))}
                        </ol>
                    </>
                );
            case 'content':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4">내용 페이지 {selectedIndex + 1}</h2>
                        {renderLayoutSelector()}
                        <textarea
                            placeholder="첫 번째 글"
                            value={draftContent.text1 || ''}
                            onChange={(e) => updateDraftContent({ text1: e.target.value })}
                            className="w-full border p-2 my-2"
                        />
                        <textarea
                            placeholder="두 번째 글 (선택)"
                            value={draftContent.text2 || ''}
                            onChange={(e) => updateDraftContent({ text2: e.target.value })}
                            className="w-full border p-2 my-2"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        {imageLoading && <p className="text-gray-500 mt-2">이미지 로딩 중...</p>}
                        {draftContent.image && (
                            <Image
                                src={draftContent.image}
                                alt="업로드된 이미지"
                                width={400}
                                height={256}
                                className="my-4 max-h-64 object-contain border"
                                onError={() => console.error('콘텐츠 이미지 로딩 실패 (편집기)')}
                                onLoad={() => console.log('콘텐츠 이미지 로딩 성공 (편집기)')}
                            />
                        )}
                    </>
                );
            default:
                return <p>알 수 없는 페이지 유형입니다.</p>;
        }
    };

    const renderPagePreview = (page: Page, index: number, isForPDF: boolean = false, isViewer: boolean = false) => {
        const scale = isForPDF ? 1 : isViewer ? 0.7 : 0.3;
        const a4Width = 210;
        const a4Height = 297;
        const scaledWidth = a4Width * scale;
        const scaledHeight = a4Height * scale;

        const content = isForPDF ? page.content : draftContent;

        console.log('renderPagePreview 호출:', {
            pageType: page.type,
            index,
            isForPDF,
            isViewer,
            content: {
                text1Length: content.text1?.length || 0,
                text2Length: content.text2?.length || 0,
                hasImage: !!(content.image || content.coverImage),
                imageUrl: (content.image || content.coverImage)?.slice(0, 50) + '...',
            },
        });

        return (
            <div
                id={`page-${index}`}
                key={index}
                className={`border shadow-sm ${isForPDF ? 'absolute' : ''} transition-transform duration-300`}
                style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    transform: isForPDF ? 'none' : `scale(${scale})`,
                    transformOrigin: 'top left',
                    visibility: isForPDF ? 'hidden' : 'visible',
                }}
            >
                <div
                    className="w-[210mm] h-[297mm] bg-white p-8 flex flex-col"
                    style={{ boxSizing: 'border-box' }}
                >
                    {page.type === 'cover' && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            {imageLoading ? (
                                <span className="text-gray-500">이미지 로딩 중...</span>
                            ) : content.coverImage ? (
                                <Image
                                    src={content.coverImage}
                                    alt="커버 이미지"
                                    width={595}
                                    height={842}
                                    className="max-w-full max-h-full object-contain"
                                    onError={() => {
                                        console.error('커버 이미지 로딩 실패 (미리보기/뷰어/PDF)');
                                        alert('커버 이미지를 로드할 수 없습니다.');
                                    }}
                                    onLoad={() => console.log('커버 이미지 로딩 성공 (미리보기/뷰어/PDF)')}
                                />
                            ) : (
                                <span className="text-gray-400">커버 이미지 없음</span>
                            )}
                        </div>
                    )}

                    {page.type === 'company' && (
                        <div className="w-full h-full">
                            <h1 className="text-4xl font-bold mb-4">회사 소개</h1>
                            <p className="whitespace-pre-wrap text-sm">{content.description || '내용 없음'}</p>
                        </div>
                    )}

                    {page.type === 'toc' && (
                        <div className="w-full h-full">
                            <h1 className="text-4xl font-bold mb-6">목차</h1>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
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
                                    <div className="mb-4 text-lg flex-1">{content.text1 || '텍스트 없음'}</div>
                                    {imageLoading ? (
                                        <span className="text-gray-500">이미지 로딩 중...</span>
                                    ) : content.image ? (
                                        <Image
                                            src={content.image}
                                            alt="내용 이미지"
                                            width={595}
                                            height={421}
                                            className="mb-4 max-w-full max-h-[50%] object-contain"
                                            onError={() => {
                                                console.error('콘텐츠 이미지 로딩 실패 (미리보기/뷰어/PDF)');
                                                alert('콘텐츠 이미지를 로드할 수 없습니다.');
                                            }}
                                            onLoad={() => console.log('콘텐츠 이미지 로딩 성공 (미리보기/뷰어/PDF)')}
                                        />
                                    ) : (
                                        <span className="text-gray-400">이미지 없음</span>
                                    )}
                                    <div className="mt-auto text-md">{content.text2 || ''}</div>
                                </>
                            )}
                            {content.layout === 'layout2' && (
                                <>
                                    {imageLoading ? (
                                        <span className="text-gray-500">이미지 로딩 중...</span>
                                    ) : content.image ? (
                                        <Image
                                            src={content.image}
                                            alt="내용 이미지"
                                            width={595}
                                            height={421}
                                            className="mb-4 max-w-full max-h-[50%] object-contain"
                                            onError={() => {
                                                console.error('콘텐츠 이미지 로딩 실패 (미리보기/뷰어/PDF)');
                                                alert('콘텐츠 이미지를 로드할 수 없습니다.');
                                            }}
                                            onLoad={() => console.log('콘텐츠 이미지 로딩 성공 (미리보기/뷰어/PDF)')}
                                        />
                                    ) : (
                                        <span className="text-gray-400">이미지 없음</span>
                                    )}
                                    <div className="text-lg flex-1">{content.text1 || '텍스트 없음'}</div>
                                </>
                            )}
                            {content.layout === 'layout3' && (
                                <div className="flex gap-8 h-full">
                                    {imageLoading ? (
                                        <span className="text-gray-500">이미지 로딩 중...</span>
                                    ) : content.image ? (
                                        <Image
                                            src={content.image}
                                            alt="내용 이미지"
                                            width={297.5}
                                            height={842}
                                            className="max-w-[50%] max-h-full object-contain"
                                            onError={() => {
                                                console.error('콘텐츠 이미지 로딩 실패 (미리보기/뷰어/PDF)');
                                                alert('콘텐츠 이미지를 로드할 수 없습니다.');
                                            }}
                                            onLoad={() => console.log('콘텐츠 이미지 로딩 성공 (미리보기/뷰어/PDF)')}
                                        />
                                    ) : (
                                        <span className="text-gray-400">이미지 없음</span>
                                    )}
                                    <div className="flex flex-col justify-between flex-1">
                                        <div className="text-lg">{content.text1 || '텍스트 없음'}</div>
                                        <div className="text-md">{content.text2 || ''}</div>
                                    </div>
                                </div>
                            )}
                            {content.layout === 'layout4' && (
                                <div className="flex flex-col h-full">
                                    <div className="mb-4 text-lg flex-1">{content.text1 || '텍스트 없음'}</div>
                                    {imageLoading ? (
                                        <span className="text-gray-500">이미지 로딩 중...</span>
                                    ) : content.image ? (
                                        <Image
                                            src={content.image}
                                            alt="내용 이미지"
                                            width={595}
                                            height={421}
                                            className="mb-4 max-w-full max-h-[50%] object-contain"
                                            onError={() => {
                                                console.error('콘텐츠 이미지 로딩 실패 (미리보기/뷰어/PDF)');
                                                alert('콘텐츠 이미지를 로드할 수 없습니다.');
                                            }}
                                            onLoad={() => console.log('콘텐츠 이미지 로딩 성공 (미리보기/뷰어/PDF)')}
                                        />
                                    ) : (
                                        <span className="text-gray-400">이미지 없음</span>
                                    )}
                                    <div className="text-md">{content.text2 || ''}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const memoizedViewerPage = useMemo(
        () => renderPagePreview(pages[viewerPageIndex], viewerPageIndex, false, true),
        [viewerPageIndex, pages]
    );

    const renderEbookViewer = () => {
        const handlePrevPage = () => {
            if (viewerPageIndex > 0) {
                setViewerPageIndex((prev) => {
                    console.log(`뷰어: 페이지 ${prev + 1} -> ${prev}`);
                    return prev - 1;
                });
            }
        };

        const handleNextPage = () => {
            if (viewerPageIndex < pages.length - 1) {
                setViewerPageIndex((prev) => {
                    console.log(`뷰어: 페이지 ${prev + 1} -> ${prev + 2}`);
                    return prev + 1;
                });
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-4 max-w-[80vw] max-h-[90vh] overflow-auto relative">
                    <button
                        onClick={() => setIsViewerOpen(false)}
                        className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                        닫기
                    </button>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={viewerPageIndex === 0}
                            className={`px-4 py-2 rounded ${
                                viewerPageIndex === 0 ? 'bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            이전
                        </button>
                        <span className="text-lg font-bold">
                            페이지 {viewerPageIndex + 1} / {pages.length}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={viewerPageIndex === pages.length - 1}
                            className={`px-4 py-2 rounded ${
                                viewerPageIndex === pages.length - 1
                                    ? 'bg-gray-300'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            다음
                        </button>
                    </div>
                    <div className="flex justify-center">{memoizedViewerPage}</div>
                </div>
            </div>
        );
    };

    const memoizedPreview = useMemo(() => {
        if (!pages[selectedIndex]) {
            console.warn('미리보기: 유효하지 않은 페이지 인덱스:', selectedIndex);
            return <p className="text-gray-500">선택된 페이지가 없습니다.</p>;
        }
        console.log('미리보기 렌더링:', {
            selectedIndex,
            pageType: pages[selectedIndex].type,
            hasImage: !!(draftContent.image || draftContent.coverImage),
        });
        return renderPagePreview(pages[selectedIndex], selectedIndex);
    }, [selectedIndex, pages, draftContent, renderPagePreview]);

    return (
        <div className="flex flex-col h-screen gap-4 p-4">
            <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">E-Book Maker</h1>
                <div className="flex gap-4">
                    <button
                        onClick={savePageContent}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        저장
                    </button>
                    {pages[selectedIndex]?.type === 'content' && (
                        <button
                            onClick={addContentPage}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            새 내용 페이지 추가
                        </button>
                    )}
                    <button
                        onClick={generatePDF}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                        PDF로 내보내기
                    </button>
                    <button
                        onClick={() => setIsViewerOpen(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition font-bold"
                    >
                        eBook 보기
                    </button>
                </div>
            </header>

            <div className="flex flex-1 gap-4 mt-16">
                <aside className="w-48 border rounded p-4 overflow-auto">{renderPageList()}</aside>

                <main className="flex-1 border rounded p-6 overflow-auto">{renderEditor()}</main>

                <section className="fixed bottom-10 right-10 w-80 border rounded bg-white p-4 shadow-lg z-40 overflow-auto">
                    <h3 className="font-bold mb-2 text-center">미리보기 (페이지 {selectedIndex + 1})</h3>
                    {memoizedPreview}
                </section>
            </div>

            {isViewerOpen && renderEbookViewer()}

            <div
                ref={captureRef}
                className="absolute"
                style={{ top: '-9999px', left: '-9999px' }}
            >
                {pages.map((page, idx) => renderPagePreview(page, idx, true))}
            </div>
        </div>
    );
}
