type SmallheadProps = {
    title: string;
    color: 'black' | 'white';
};

export default function Smallhead({ title, color }: SmallheadProps) {
    const textColorClass = color === 'black' ? 'text-black' : 'text-white';

    return <h2 className={`waguri-font ${textColorClass} text-4xl md:text-6xl mb-4 tracking-tight`}>{title}</h2>;
}
