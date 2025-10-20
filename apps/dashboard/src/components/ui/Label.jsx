import { useState } from 'react';
import '../../styles/components/ui/Label.scss';

export default function Label({
    size = 'p',
    text,
    className = '',
    color = '',
    weight = 'normal',
    align = 'left',
    truncate = false,
    lines = 1,
    htmlFor = '',
    title = '',
    onClick,
    children,
    maxLength = 0, // Nouvelle prop: nombre max de caractères avant troncature
    expandable = false, // Nouvelle prop: permet l'expansion
    showToggle = true // Nouvelle prop: afficher le bouton toggle
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const Tag = size.startsWith('h') ? size : 'p';
    const content = children || text || '';

    // Calculer si le texte dépasse la longueur max
    const shouldTruncate = maxLength > 0 && content.length > maxLength && !isExpanded;
    const displayText = shouldTruncate ? `${content.substring(0, maxLength)}...` : content;

    const labelClass = `label 
        label--${size} 
        label--${weight} 
        label--align-${align} 
        ${truncate ? 'label--truncate' : ''} 
        ${className}`.trim();

    const style = color ? { color } : {};

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="label-container">
            <Tag
                className={labelClass}
                style={style}
                htmlFor={htmlFor}
                title={title || (typeof content === 'string' ? content : '')}
                onClick={onClick}
            >
                {displayText}
            </Tag>

            {/* Bouton Voir Plus/Moins */}
            {expandable && maxLength > 0 && content.length > maxLength && showToggle && (
                <button
                    className="label-toggle"
                    onClick={handleToggle}
                    type="button"
                >
                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                </button>
            )}
        </div>
    );
};
