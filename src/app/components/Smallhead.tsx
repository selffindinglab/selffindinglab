type SmallheadProps = {
    title: string;
    color: 'black' | 'white' | 'crab';
    size?: 'sm' | 'md' | 'lg'; // optional
};

export default function Smallhead({ title, color, size = 'md' }: SmallheadProps) {
    const colorClass: Record<SmallheadProps['color'], string> = {
        black: 'text-black',
        white: 'text-white',
        crab: 'text-crab',
    };

    const sizeClass: Record<'sm' | 'md' | 'lg', string> = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
    };

    return <h3 className={`font-semibold mb-4 ${colorClass[color]} ${sizeClass[size]}`}>{title}</h3>;
}
