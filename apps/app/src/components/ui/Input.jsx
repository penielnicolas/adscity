import '../../styles/components/ui/Input.scss';
export default function Input({
    value,
    onChange,
    type = 'text',
    placeholder = '',
    className = '',
    disabled = false,
    required = false,
    autoFocus = false,
    icon = null,
    rightElement = null,
    name = '',
    onBlur,
    onFocus,
    error = false,
    success = false
}) {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    const handleBlur = (e) => {
        if (onBlur) onBlur(e);
    };

    const handleFocus = (e) => {
        if (onFocus) onFocus(e);
    };

    const inputClass = `input 
        ${icon ? 'input--with-icon' : ''} 
        ${rightElement ? 'input--with-right-element' : ''} 
        ${error ? 'input--error' : ''} 
        ${success ? 'input--success' : ''} 
        ${className}`.trim();

    return (
        <div className="input-container">
            {icon && (
                <div className="input-icon-left">
                    {icon}
                </div>
            )}

            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                className={inputClass}
                disabled={disabled}
                required={required}
                autoFocus={autoFocus}
            />

            {rightElement && (
                <div className="input-right-element">
                    {rightElement}
                </div>
            )}
        </div>
    );
};
