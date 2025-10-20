import '../../styles/components/ui/Radio.scss';

export default function Radio({
    label = '',
    checked = false,
    onChange,
    disabled = false,
    className = '',
    name = '',
    value = '',
    indeterminate = false,
    required = false,
}) {

    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    const radioClass = `radio ${disabled ? 'radio--disabled' : ''} ${className}`.trim();
    return (
        <label className={radioClass}>
            <input
                type='radio'
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
                className='radio__input'
            />

            <span className='radio__checkmark'></span>
            {label && (
                <span className='radio__label'>{label}</span>
            )}
        </label>
    )
}
