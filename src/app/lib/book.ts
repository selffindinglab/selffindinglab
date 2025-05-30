export type Book = {
    slug: string; // 🔥 추가
    title: string;
    thumbnail: string;
    pages: string[];
};

export const books: Book[] = [
    {
        slug: 'gongdu-and-danyeom',
        title: '공두와 다념이',
        thumbnail: '/gongdu.jpeg',
        pages: ['/books/book1/1.jpg', '/books/book1/2.jpg', '/books/book1/3.jpg'],
    },
    {
        slug: 'map-of-the-self-1',
        title: 'MAP of THE SELF 월간지',
        thumbnail: '/mapoftheself1.jpeg',
        pages: ['/books/book2/1.jpg', '/books/book2/2.jpg', '/books/book2/3.jpg'],
    },
    {
        slug: 'map-of-the-self-2',
        title: 'MAP of THE SELF 월간지',
        thumbnail: '/mapoftheself2.jpeg',
        pages: ['/books/book3/1.jpg', '/books/book3/2.jpg', '/books/book3/3.jpg'],
    },
    {
        slug: 'map-of-the-self-3',
        title: 'MAP of THE SELF 월간지',
        thumbnail: '/mapoftheself3.jpeg',
        pages: ['/books/book4/1.jpg', '/books/book4/2.jpg', '/books/book4/3.jpg'],
    },
];
