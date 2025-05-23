// components/templates.tsx
export const templates = [
    {
        id: 'layout1',
        name: '글 - 그림 - 글',
        layout: (
            <div className="p-6 border rounded">
                <p className="text-xl mb-2">여기에 글</p>
                <div className="bg-gray-300 h-40 mb-2" />
                <p className="text-xl">다시 글</p>
            </div>
        ),
    },
    {
        id: 'layout2',
        name: '그림 - 글',
        layout: (
            <div className="p-6 border rounded">
                <div className="bg-gray-300 h-48 mb-2" />
                <p className="text-xl">설명 글</p>
            </div>
        ),
    },
    {
        id: 'layout3',
        name: '글 - 그림',
        layout: (
            <div className="p-6 border rounded">
                <p className="text-xl mb-2">상단 설명</p>
                <div className="bg-gray-300 h-48" />
            </div>
        ),
    },
    {
        id: 'layout4',
        name: '그림 전체',
        layout: (
            <div className="p-6 border rounded">
                <div className="bg-gray-300 h-64 w-full" />
            </div>
        ),
    },
    {
        id: 'layout5',
        name: '글 전체',
        layout: (
            <div className="p-6 border rounded">
                <p className="text-xl">여기에 긴 글이 들어갑니다. 여러 문단으로 나뉠 수도 있습니다.</p>
            </div>
        ),
    },
];
