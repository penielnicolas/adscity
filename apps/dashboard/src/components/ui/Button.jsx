import '../../styles/components/ui/Button.scss';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    className = '',
    fullWidth = false,
    onClick,
    loading = false,
    icon = null,
    iconPosition = 'left',
    ...props
}) {
    const buttonClass = `btn 
        btn--${variant} 
        btn--${size} 
        ${disabled ? 'btn--disabled' : ''} 
        ${fullWidth ? 'btn--full-width' : ''} 
        ${loading ? 'btn--loading' : ''} 
        ${className}`.trim();

    const handleClick = (e) => {
        if (!disabled && !loading && onClick) {
            onClick(e);
        }
    };

    return (
        <button
            type={type}
            className={buttonClass}
            disabled={disabled || loading}
            onClick={handleClick}
            {...props}
        >
            {loading && (
                <span className="btn__spinner">
                    <div className="btn__spinner-dot"></div>
                    <div className="btn__spinner-dot"></div>
                    <div className="btn__spinner-dot"></div>
                </span>
            )}

            {icon && iconPosition === 'left' && !loading && (
                <span className="btn__icon btn__icon--left">
                    {icon}
                </span>
            )}

            <span className="btn__content">
                {children}
            </span>

            {icon && iconPosition === 'right' && !loading && (
                <span className="btn__icon btn__icon--right">
                    {icon}
                </span>
            )}
        </button>
    );
};
