import '../../styles/components/ui/Badge.scss';

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className,
}) {
    const variantClass = `badge--${variant}`;
    const sizeClass = `badge--${size}`;

    return (
        <span className={`badge ${variantClass} ${sizeClass} ${className}`}>
            {children}
        </span>
    )
}
