export type Book = {
    id: number;
    title: string;
    genre: string;
    image_url: string;
    published_at: string;
};

export type Event = {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    link: string;
    image_url: string;
    location: string;
    subtitle: string;
    program_type: string;
};
export type PageType = 'cover' | 'company' | 'toc' | 'content';

export interface PageContent {
    coverImage?: string | null;
    description?: string;
    layout?: 'layout1' | 'layout2' | 'layout3' | 'layout4';
    text1?: string;
    text2?: string;
    image?: string | null;
}

export interface Page {
    type: PageType;
    content: PageContent;
}
