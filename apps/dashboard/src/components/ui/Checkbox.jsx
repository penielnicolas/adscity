import '../../styles/components/ui/Checkbox.scss';

export default function Checkbox({
    label = '',
    checked = false,
    onChange,
    disabled = false,
    className = '',
    name = '',
    value = '',
    indeterminate = false,
    required = false
}) {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    const checkboxClass = `checkbox ${disabled ? 'checkbox--disabled' : ''} ${className}`.trim();

    return (
        <label className={checkboxClass}>
            <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                name={name}
                value={value}
                ref={(el) => {
                    if (el) {
                        el.indeterminate = indeterminate;
                    }
                }}
                required={required}
                className="checkbox__input"
            />

            <span className="checkbox__checkmark"></span>

            {label && (
                <span className="checkbox__label">
                    {label}
                </span>
            )}
        </label>
    );
};
