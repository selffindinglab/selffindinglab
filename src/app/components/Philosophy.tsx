import { title, intro, brandColors } from '@/app/lib/context';

export default function Philosophy() {
    return (
        <section id="intro" className="py-24 px-6 text-center" style={{ backgroundColor: brandColors.secondary }}>
            <div className="max-w-3xl mx-auto animate-fade-in">
                <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: brandColors.textSoft }}>
                    <span className="font-medium" style={{ color: brandColors.primary }}>
                        {title}
                    </span>
                    {`는\n`}
                    {intro}
                </p>
            </div>
        </section>
    );
}
