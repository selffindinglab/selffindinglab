export type Book = {
    title: string;
    thumbnail: string;
    pages: string[];
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
