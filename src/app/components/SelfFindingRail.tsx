'use client';

export default function SelfFindingRail() {
    return (
        <div className="relative overflow-hidden w-full h-8 bg-transparent">
            <div className="whitespace-nowrap flex animate-scrollRail absolute top-0 left-0">
                {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} className="text-white font-bold text-sm mx-4">
                        Self Finding Lab
                    </span>
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                    <span key={`copy-${i}`} className="text-white font-bold text-sm mx-4">
                        Self Finding Lab
                    </span>
                ))}
            </div>
        </div>
    );
}
