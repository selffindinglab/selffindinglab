import { intro, title, brandColors } from '@/lib/context';

export default function Hero() {
    return (
        <section
            id="subscribe"
            className="w-full py-32 text-center"
            style={{ background: `linear-gradient(to bottom, white, ${brandColors.secondary})` }}
        >
            <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
                style={{ color: brandColors.primary }}
            >
                {title}
            </h1>
            <p
                className="mt-4 text-base sm:text-lg"
                style={{ color: brandColors.textDark }}
            >
                출판과 실험을 사랑하는 1인 출판사
            </p>
            <p
                className="mt-6 max-w-3xl mx-auto px-4 text-sm sm:text-base leading-relaxed whitespace-pre-line"
                style={{ color: brandColors.textSoft }}
            >
                {intro}
            </p>
        </section>
    );
}
