import { intro, title, brandColors } from '@/app/lib/context';

export default function Hero() {
    return (
        <section
            id="subscribe"
            className="w-full py-32 px-6 text-center"
            style={{
                background: `linear-gradient(to bottom, #ffffff, ${brandColors.secondary}10)`,
            }}
        >
            <h1
                className="waguri-font text-5xl md:text-7xl font-light tracking-tight leading-tight"
                style={{ color: brandColors.primary }}
            >
                {title}
            </h1>

            <p className="mt-6 text-lg md:text-xl font-light text-gray-600" style={{ color: brandColors.textDark }}>
                출판과 실험을 사랑하는
                <br className="sm:hidden" />
                &nbsp;1인 출판사
            </p>

            <p
                className="mt-10 max-w-2xl mx-auto text-base md:text-lg leading-relaxed whitespace-pre-line"
                style={{ color: brandColors.textSoft }}
            >
                {intro}
            </p>
        </section>
    );
}
