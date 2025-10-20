import '../../styles/components/ui/Card.scss';

export const Card = ({ children, className }) => {
    return (
        <div className={`card ${className}`}>{children}</div>
    );
};

export const CardTitle = ({ children, className }) => {
    return (
        <div className={`card-title ${className}`}>{children}</div>
    );
};

export const CardDescription = ({ children, className }) => {
    return (
        <div className={`card-description ${className}`}>{children}</div>
    );
};

export const CardHeader = ({ children, className }) => {
    return (
        <div className={`card-header ${className}`}>{children}</div>
    );
};

export const CardBody = ({ children, className }) => {
    return (
        <div className={`card-body ${className}`}>{children}</div>
    );
};

export const CardFooter = ({ children, className }) => {
    return (
        <div className={`card-footer ${className}`}>{children}</div>
    );
};