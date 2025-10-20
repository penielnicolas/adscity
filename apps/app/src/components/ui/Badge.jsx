import PropTypes from "prop-types";
import clsx from "clsx";
import "../../styles/components/ui/Badge.scss";

export default function Badge({
    children,
    variant = "default",
    size = "md",
    className,
    icon: Icon,
    onClick,
    rounded = "md",
    count,
    maxCount = 99,
    showZero = false,
}) {
    const classes = clsx(
        "badge",
        `badge--${variant}`,
        `badge--${size}`,
        `badge--rounded-${rounded}`,
        { "badge--clickable": !!onClick },
        className
    );

    const content = (
        <>
            {Icon && <Icon className="badge__icon" />}
            <span className="badge__label">{children}</span>
            {(showZero || (count && count > 0)) && (
                <span className="badge__count">
                    {count > maxCount ? `${maxCount}+` : count}
                </span>
            )}
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                className={classes}
                onClick={onClick}
                // role="button"
                tabIndex={0}
            >
                {content}
            </button>
        );
    }

    return <span className={classes}>{content}</span>;
}

Badge.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(["default", "primary", "secondary", "success", "warning", "danger"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    className: PropTypes.string,
    icon: PropTypes.elementType,
    onClick: PropTypes.func,
    rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "full"]),
    count: PropTypes.number,         // 🔥 Nouveau
    maxCount: PropTypes.number,      // Limite affichée (par défaut 99 → affiche "99+")
    showZero: PropTypes.bool,        // Affiche 0 si true
};
