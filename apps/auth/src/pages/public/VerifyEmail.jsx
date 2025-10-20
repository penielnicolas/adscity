import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import PinField from 'react-pin-field';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import { logos } from '../../config';
import Loading from '../../components/ui/Loading';
import { 
    sendEmailOTPCode, 
    verifyEmailOTPCode 
} from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/public/VerifyEmail.scss';

const HOME_URL = process.env.REACT_APP_HOME_URL;

export default function VerifyEmail() {
    const { currentUser } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const pinRef = useRef(null);

    // Récupérer l'email depuis l'état de navigation ou le localStorage
    const email = location.state?.email || localStorage.getItem('pending_email_to_verify') || null;

    // États principaux
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('pending'); // pending | checking | verified | error
    const [code, setCode] = useState('');
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    // États pour le renvoi
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    // États pour les tentatives
    const [attempts, setAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);

    // Constantes
    const maxAttempts = 5;
    const codeLength = 6;
    const blockDuration = 300; // 5 minutes en secondes

    // Redirection si pas d'email
    useEffect(() => {
        if (!email) {
            navigate('/create-user', { replace: true });
            return;
        }

        // Simulation de chargement initial
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, [email, navigate]);

    useEffect(() => {
        if (currentUser && currentUser.email === email && currentUser.emailVerified) {
            setStatus('verified');
            showToast('success', 'Email déjà vérifié ! Redirection en cours...');
            setTimeout(() => {
                navigate('/signin', {
                    state: {
                        email,
                        verified: true,
                        message: 'Votre compte a été vérifié. Vous pouvez maintenant vous connecter.'
                    }
                });
            }, 2000);
        }
    }, [currentUser, email, navigate]);

    // Gestion du countdown pour le renvoi
    useEffect(() => {
        if (countdown > 0 && !canResend) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, canResend]);

    // Auto-focus sur le premier champ PIN - CORRECTION ICI
    useEffect(() => {
        if (!isLoading && status === 'pending') {
            // Utiliser un délai pour s'assurer que le composant est monté
            const timer = setTimeout(() => {
                // Chercher le premier input du PinField
                const firstInput = document.querySelector('.pin-field input:first-child');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isLoading, status]);

    // Focus après erreur - CORRECTION ICI
    const focusFirstInput = () => {
        setTimeout(() => {
            const firstInput = document.querySelector('.pin-field input:first-child');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    };

    // Gestion du blocage temporaire
    useEffect(() => {
        if (attempts >= maxAttempts && !isBlocked) {
            setIsBlocked(true);
            setToast({
                show: true,
                type: 'error',
                message: `Trop de tentatives. Réessayez dans ${Math.floor(blockDuration / 60)} minutes.`
            });

            // Débloquer après la durée définie
            const unblockTimer = setTimeout(() => {
                setIsBlocked(false);
                setAttempts(0);
                setToast({
                    show: true,
                    type: 'info',
                    message: 'Vous pouvez maintenant réessayer.'
                });
            }, blockDuration * 1000);

            return () => clearTimeout(unblockTimer);
        }
    }, [attempts, isBlocked]);

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
    };

    const handleVerify = async () => {
        if (code.length !== codeLength || status === 'checking' || isBlocked) return;

        setStatus('checking');

        try {
            const res = await verifyEmailOTPCode(email, code);

            if (res.success) {
                setStatus('verified');
                localStorage.removeItem('pending_email_to_verify');
                showToast('success', 'Email vérifié avec succès !');

                setTimeout(() => {
                    if (res.nextStep === 'verify-phone') {
                        navigate('/verify-phone', {
                            state: {
                                email: email,
                                phone: res.user?.phone
                            }
                        });
                    } else {
                        navigate('/signin', {
                            state: {
                                email,
                                verified: true,
                                message: 'Votre compte a été vérifié. Vous pouvez maintenant vous connecter.'
                            }
                        });
                    }
                }, 2000);
            } else {
                handleVerificationError(res.message || 'Code invalide');
            }
        } catch (error) {
            console.error('Erreur vérification:', error);
            handleVerificationError('Erreur de connexion. Veuillez réessayer.');
        }
    };

    const handleVerificationError = (message) => {
        setStatus('error');
        setAttempts(prev => prev + 1);
        setCode('');
        showToast('error', message);

        setTimeout(() => {
            if (attempts + 1 < maxAttempts) {
                setStatus('pending');
                focusFirstInput(); // Utiliser la nouvelle fonction
            }
        }, 1500);
    };

    const handleResend = async () => {
        if (!canResend || resendLoading) return;

        setResendLoading(true);

        try {
            const response = await sendEmailOTPCode(email);

            if (response.success) {
                showToast('success', 'Nouveau code envoyé !');
                setCountdown(60);
                setCanResend(false);
                setCode('');
                setAttempts(0);
                setStatus('pending');
                focusFirstInput(); // Focus après renvoi
            } else {
                showToast('error', response.message || 'Échec de l\'envoi');
            }
        } catch (error) {
            console.error('Erreur renvoi:', error);
            showToast('error', 'Erreur de connexion. Réessayez plus tard.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleCodeChange = (value) => {
        setCode(value);
        if (status === 'error') {
            setStatus('pending');
        }
    };

    const remainingAttempts = maxAttempts - attempts;

    if (isLoading) return <Loading />

    return (
        <div className="verify-email">
            <div className="verify-email-container">
                <div className="verify-email-header">
                    <Logo
                        src={logos.letterWhiteBgBlue}
                        size='lg'
                        alt='AdsCity'
                        text='AdsCity'
                        showText={false}
                        onclick={() => window.location.href = HOME_URL}
                    />
                </div>

                {/* Section affichée quand l'utilisateur est bloqué */}
                {isBlocked ? (
                    <div className="blocked-section">
                        <div className="blocked-header">
                            <AlertCircle size={48} className="blocked-icon" />
                            <h2>Trop de tentatives</h2>
                            <p>Vous avez effectué trop de tentatives incorrectes.</p>
                        </div>

                        <div className="blocked-info">
                            <div className="blocked-timer">
                                <span className="timer-icon">⏳</span>
                                <span>Réessayez dans {Math.floor(blockDuration / 60)} minutes</span>
                            </div>

                            <div className="blocked-suggestions">
                                <h3>En attendant, vous pouvez :</h3>
                                <ul>
                                    <li>Vérifier votre dossier spam</li>
                                    <li>Vous assurer que l'email {email} est correct</li>
                                    <li>Contacter notre support si le problème persiste</li>
                                </ul>
                            </div>
                        </div>

                        <div className="blocked-actions">
                            <div className="change-email">
                                <button className="link-button" onClick={() => navigate(-1)}>Modifier l'adresse email</button>
                            </div>
                            <button
                                className="blocked-action-btn"
                                onClick={() => window.open('mailto:support@adscity.net', '_blank')}
                            >
                                <Mail size={16} />
                                Contacter le support
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="email-verification">
                        <div className={`verification-header ${status === 'verified' ? 'verified' : ''}`}>
                            {status === 'verified' ? (
                                <CheckCircle size={64} className="success-icon" />
                            ) : (
                                <Mail size={64} className="mail-icon" />
                            )}
                            <h1 className="title">
                                {status === 'verified' ? 'Email vérifié !' : 'Vérifiez votre email'}
                            </h1>
                            <p className="subtitle">
                                {status === 'verified'
                                    ? 'Redirection en cours...'
                                    : <>Un code a été envoyé à <strong>{email}</strong></>
                                }
                            </p>

                            {/* Indicateur de tentatives */}
                            {status === 'error' && remainingAttempts > 0 && (
                                <div className="attempts-indicator">
                                    <div className="attempts-bar">
                                        <div
                                            className="attempts-progress"
                                            style={{ width: `${(attempts / maxAttempts) * 100}%` }}
                                        />
                                    </div>
                                    <span className="attempts-text">
                                        {remainingAttempts} tentative{remainingAttempts > 1 ? 's' : ''} restante{remainingAttempts > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                        </div>

                        {status !== 'verified' && (
                            <div className="email-verification-form">
                                <div className="verification-steps">
                                    {['Ouvrez votre boîte mail', 'Copiez le code', 'Collez-le ici et vérifiez'].map((txt, i) => (
                                        <div className="step" key={i}>
                                            <span className="step-number">{i + 1}</span>
                                            <span className="step-text">{txt}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pin-code-field">
                                    <PinField
                                        ref={pinRef}
                                        length={codeLength}
                                        validate={/^[0-9]$/}
                                        value={code}
                                        onChange={handleCodeChange}
                                        className="pin-field"
                                        style={{
                                            border: `2px solid ${status === 'checking' ? '#f59e0b' : '#d1d5db'}`,
                                        }}
                                        autoFocus
                                        disabled={status === 'checking' || attempts >= maxAttempts}
                                    />
                                </div>

                                <div className="verification-buttons">
                                    <button
                                        className="verify-button primary"
                                        onClick={handleVerify}
                                        disabled={status === 'checking' || code.length !== codeLength}
                                    >
                                        {status === 'checking'
                                            ? <ActivityIndicator type="bounce" size={15} color="#fff" />
                                            : <> <CheckCircle size={18} /> Vérifier</>}
                                    </button>

                                    <button
                                        className="resend-button secondary"
                                        onClick={handleResend}
                                        disabled={!canResend}
                                    >
                                        {canResend
                                            ? <> <Mail size={18} /> Renvoyer l'email </>
                                            : <> <ActivityIndicator type="bounce" size={15} color="#fff" /> Renvoyer dans {countdown}s</>}
                                    </button>
                                </div>

                                <div className="verification-help open">
                                    <details className="help-details">
                                        <summary>Vous ne recevez pas le code ?</summary>
                                        <div className="help-content">
                                            <div className="help-grid">
                                                <div className="help-item">
                                                    <span className="help-icon">📁</span>
                                                    <div>
                                                        <strong>Vérifiez vos spams</strong>
                                                        <p>Le code peut être dans votre dossier indésirable</p>
                                                    </div>
                                                </div>
                                                <div className="help-item">
                                                    <span className="help-icon">✉️</span>
                                                    <div>
                                                        <strong>Email correct ?</strong>
                                                        <p>Assurez-vous que {email} est correct</p>
                                                    </div>
                                                </div>
                                                <div className="help-item">
                                                    <span className="help-icon">⏰</span>
                                                    <div>
                                                        <strong>Patientez un peu</strong>
                                                        <p>La livraison peut prendre jusqu'à 5 minutes</p>
                                                    </div>
                                                </div>
                                                <div className="help-item">
                                                    <span className="help-icon">🔄</span>
                                                    <div>
                                                        <strong>Problème persistant ?</strong>
                                                        <p>Contactez notre support technique</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>

                                {/* Actions supplémentaires */}
                                <div className="help-actions">
                                    <button
                                        className="help-action-btn"
                                        onClick={() => window.open('mailto:support@adscity.net', '_blank')}
                                    >
                                        <Mail size={16} />
                                        Contacter le support
                                    </button>
                                </div>

                                <div className="change-email">
                                    <button className="link-button" onClick={() => navigate(-1)}>Modifier l'adresse email</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ show: false, type: '', message: '' })}
            />
        </div>
    );
}
