import '../../styles/components/ui/Avatar.scss';

export default function Avatar({
    size = 'md',
    alt = 'Utilisateur Inconnu',
    source,
    className = '',
    username = '',
    showUsername = false,
    status = 'OFFLINE', // OFFLINE, ONLINE, BUSY, AWAY
    showStatus = false,
    onClick,
    isClickable = false,
    border = false,
    shadow = false
}) {
    const getInitials = (name) => {
        if (!name) return '?';

        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleError = (e) => {
        e.target.style.display = 'none';
    };

    const avatarContent = source ? (
        <img
            src={source}
            alt={alt}
            className="avatar__image"
            onError={handleError}
        />
    ) : (
        <div className="avatar__initials">
            {getInitials(username || alt)}
        </div>
    );

    const avatarClass = `
    avatar 
    avatar--${size} 
    ${isClickable ? 'avatar--clickable' : ''} 
    ${border ? 'avatar--border' : ''} 
    ${shadow ? 'avatar--shadow' : ''} 
    ${className}
  `.trim();

    return (
        <div
            className={avatarClass}
            onClick={onClick}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
        >
            <div className="avatar__content">
                {avatarContent}
            </div>

            {showStatus && (
                <div className={`avatar__status avatar__status--${status}`} />
            )}

            {showUsername && (
                <>
                    {username && (
                        <span className="avatar__username">{username}</span>
                    )}
                </>
            )}

        </div>
    );
};