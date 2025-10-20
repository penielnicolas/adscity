import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/public/SignupVerifyEmail.scss';

export default function EmailVerified() {
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        // Start countdown for redirection
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/signin');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="email-verification-container">
            <div className="verification-card success-card">
                <div className="verification-icon">
                    <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                </div>

                <h2>Email vérifié avec succès!</h2>

                <p>Votre adresse email a été vérifiée. Vous serez redirigé vers la page de connexion dans {countdown} secondes...</p>

                <div className="verification-actions">
                    <button
                        className="continue-btn"
                        onClick={() => navigate('/signin')}
                    >
                        Se connecter maintenant
                    </button>
                </div>
            </div>
        </div>
    );
};
