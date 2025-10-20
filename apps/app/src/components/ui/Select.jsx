import '../../styles/components/ui/Select.scss';
export default function Select({
    value,
    onChange,
    options = [],
    className = '',
    disabled = false,
    error = false,
    icon = null,
    onBlur,
    name = ''
}) {
    const selectClass = `select ${error ? 'select--error' : ''} ${className}`.trim();

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="select-container">
            {icon && (
                <div className="select-icon-left">
                    {icon}
                </div>
            )}
            
            <select
                value={value}
                onChange={handleChange}
                className={selectClass}
                disabled={disabled}
                onBlur={onBlur}
                name={name}
            >
                {options.map((option) => (
                    <option
                        className='select-label'
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
