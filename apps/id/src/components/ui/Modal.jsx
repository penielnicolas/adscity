import { useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from './Card';
import '../../styles/components/ui/Modal.scss';

export default function Modal({
    isOpen,
    onClose,
    title,
    size = 'medium',
    children,
    showCloseButton = true,
    closeOnOverlayClick = true,
    animation = 'fade',
}) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.keyCode === 27 && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };

    return (
        <div
            className={`modal-overlay ${animation} ${isOpen ? 'open' : ''}`}
            onClick={handleOverlayClick}
        >
            <div className={`modal-container ${size}`}>
                <Card>
                    <CardHeader className='modal-header'>
                        <CardTitle>{title}</CardTitle>
                        {showCloseButton && (
                            <button
                                className="modal-close-btn"
                                onClick={onClose}
                                aria-label="Fermer la modal"
                            >
                                &times;
                            </button>
                        )}
                    </CardHeader>
                    <CardBody>
                        {children}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
