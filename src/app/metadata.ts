import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '자기찾기연구소',
    description: '나를 찾는 실험실, 자기찾기연구소입니다.',
    keywords: ['자기찾기연구소', '자기계발', '마음성장', '라이프코칭'],
    icons: {
        icon: 'https://www.selffindinglab.co.kr/favicon.ico',
    },
    openGraph: {
        title: '자기찾기연구소',
        description: '나를 찾는 실험실, 자기찾기연구소입니다.',
        type: 'website',
        url: 'https://www.selffindinglab.co.kr',
        siteName: '자기찾기연구소',
        images: [
            {
                url: 'https://www.selffindinglab.co.kr/logo.png',
                width: 1200,
                height: 630,
                alt: '자기찾기연구소 대표 이미지',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '자기찾기연구소',
        description: '나를 찾는 실험실, 자기찾기연구소입니다.',
        images: ['https://www.selffindinglab.co.kr/logo.png'],
    },
    robots: 'index, follow',
    manifest: '/site.webmanifest',
    appleWebApp: {
        title: '자기찾기연구소',
        statusBarStyle: 'default',
    },
};
