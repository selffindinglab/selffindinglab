import { history } from '@/app/lib/context';

export default function TimelineSection() {
    return (
        <section className="bg-gray-50 py-24 px-6 md:px-12 max-w-6xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 tracking-tight">연혁</h2>
                <div className="w-16 h-1 bg-indigo-400 mt-4 mx-auto rounded" />
            </div>

            <div className="relative">
                {/* 중앙 선 */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-indigo-200 to-indigo-100" />

                {history.map((item, index) => {
                    const isRight = item.side === 'right';
                    return (
                        <div
                            key={index}
                            className={`mb-16 flex flex-col md:flex-row items-center relative w-full max-w-5xl mx-auto ${
                                isRight ? 'md:justify-end' : 'md:justify-start'
                            }`}
                        >
                            {/* 타임라인 점 */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                                <div className="w-5 h-5 bg-white border-4 border-indigo-400 rounded-full shadow-md" />
                            </div>

                            {/* 카드 */}
                            <article
                                className={`bg-white border border-indigo-100 rounded-2xl shadow-md px-8 py-6 max-w-md w-full transition-all duration-300 hover:shadow-xl
                                    ${isRight ? 'md:ml-12 md:text-left' : 'md:mr-12 md:text-right'}
                                `}
                            >
                                <h3 className="text-xl font-semibold text-indigo-700 mb-3">{item.year}</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-800 text-sm leading-relaxed font-normal">
                                    {item.items.map((text, i) => (
                                        <li key={i}>{text}</li>
                                    ))}
                                </ul>
                            </article>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
