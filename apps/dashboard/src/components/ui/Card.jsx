import '../../styles/components/ui/Card.scss';

export const Card = ({ children, className = "" }) => {
    return (
        <div className={`card ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = "" }) => {
    return (
        <div className={`card-header ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = "" }) => {
    return (
        <h3 className={`card-title ${className}`}>
            {children}
        </h3>
    );
};

export const CardDescription = ({ children, className = "" }) => {
    return (
        <p className={`card-description ${className}`}>
            {children}
        </p>
    );
};

export const CardBody = ({ children, className = "" }) => {
    return (
        <div className={`card-body ${className}`}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = "" }) => {
    return (
        <div className={`card-footer ${className}`}>
            {children}
        </div>
    );
};

export const CardItem = ({ children, className = "" }) => {
    return (
        <div className={`card-item ${className}`}>
            {children}
        </div>
    );
};