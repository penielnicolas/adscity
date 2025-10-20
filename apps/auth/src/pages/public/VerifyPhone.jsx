import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActivityIndicator from "../../components/ui/ActivityIndicator";
import { AlertCircle, CheckCircle, Mail, Phone } from "lucide-react";
import Toast from "../../components/ui/Toast";
import PinField from "react-pin-field";
import {
    resendPhoneOTPCode,
    sendPhoneOTPCode,
    verifyPhoneOTPCode
} from "../../services/auth";
import { logos } from "../../config";
import Logo from "../../components/ui/Logo";
import Loading from "../../components/ui/Loading";
import { useAuth } from "../../contexts/AuthContext";
import '../../styles/public/VerifyPhone.scss';

const HOME_URL = process.env.REACT_APP_HOME_URL;

export default function VerifyPhone() {
    const { currentUser } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const phone = location.state?.phone;

    const pinRef = useRef(null);
    const hasSentRef = useRef(false);

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

    useEffect(() => {
        const sendCode = async () => {
            if (hasSentRef.current) return;
            hasSentRef.current = true;

            try {
                await sendPhoneOTPCode(email, phone);
                showToast('success', 'Code envoyé au numéro de téléphone');
            } catch (err) {
                showToast('error', 'Erreur lors de l’envoi du code');
            } finally {
                setIsLoading(false);
            }
        };

        sendCode();
    }, [email, phone]);


    useEffect(() => {
        if (currentUser && currentUser.phone === phone && currentUser.phoneVerified) {
            setStatus('verified');
            showToast('success', 'Numéro de téléphone déjà vérifié ! Redirection en cours...');
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
    }, [currentUser, email, phone, navigate]);

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
        if (code.length !== codeLength) return;
        setStatus('checking');

        try {
            const res = await verifyPhoneOTPCode(email, code);
            if (res.success) {
                setStatus('verified');
                setToast({ show: true, type: 'success', message: 'Numéro vérifié avec succès !' });

                setTimeout(() => {
                    navigate('/signin', {
                        state: {
                            verified: true,
                            email: email,
                            message: 'Votre compte est maintenant entièrement vérifié. Vous pouvez vous connecter.'
                        }
                    });
                }, 2000);
            } else {
                handleVerificationError(res.message || 'Code invalide');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setToast({ show: true, type: 'error', message: 'Erreur de connexion au serveur.' });
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
            const response = await resendPhoneOTPCode(email, phone);

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
        <div className="verify-phone">
            <div className="verify-phone-container">
                <div className="verify-phone-header">
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
                                    <li>Vous assurer que le numéro de téléphones {phone} est correct</li>
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
                                <Phone size={64} className="mail-icon" />
                            )}
                            <h1 className="title">
                                {status === 'verified' ? 'Numéro de téléphone vérifié !' : 'Vérifiez votre numéro de téléphone'}
                            </h1>
                            <p className="subtitle">
                                {status === 'verified'
                                    ? 'Redirection en cours...'
                                    : <>Un code a été envoyé à <strong>{phone}</strong></>
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
                                    {['Ouvrez votre messagerie', 'Copiez le code venant de AdsCity', 'Collez-le ici et vérifiez'].map((txt, i) => (
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
                                            ? <> <Mail size={18} /> Renvoyer le code </>
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
                                                        <strong>Numéro correct ?</strong>
                                                        <p>Assurez-vous que {phone} est correct</p>
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
                                    <button className="link-button" onClick={() => navigate(-1)}>Modifier le numéro</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false })} />
        </div>
    );
};
