import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/ui/Logo';
import { logos } from '../../config';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import Toast from '../../components/ui/Toast';
import Checkbox from '../../components/ui/Checkbox';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import Label from '../../components/ui/Label';
import ReCAPTCHA from 'react-google-recaptcha';
import { signInWithEmailOrPhoneAndPassword } from '../../services/auth';
import '../../styles/public/Signin.scss';

const HOME_URL = process.env.REACT_APP_HOME_URL;
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

export default function Signin() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    // Récupérer la destination de redirection
    const from = location.state?.from?.pathname;
    const redirectParam = new URLSearchParams(location.search).get('next');
    const redirectTo = redirectParam || from;

    // États du formulaire
    const [agree, setAgree] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
    });
    const [captchaValue, setCaptchaValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const recaptchaRef = useRef(null);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateField = (fieldName) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'emailOrPhone':
                if (!formData.emailOrPhone.trim()) {
                    newErrors.emailOrPhone = 'L\'email ou le numéro de téléphone est requis';
                } else {
                    // Email ou numéro de téléphone valide ?
                    const emailRegex = /\S+@\S+\.\S+/;
                    const phoneRegex = /^\+?[0-9]{7,15}$/;

                    if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone)) {
                        newErrors.emailOrPhone = 'Veuillez entrer un email ou numéro de téléphone valide';
                    } else {
                        delete newErrors.emailOrPhone;
                    }
                }
                break;

            case 'password':
                if (!formData.password.trim()) {
                    newErrors.password = 'Le mot de passe est requis';
                } else if (formData.password.length < 6) {
                    newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
                } else {
                    delete newErrors.password;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm = () => {
        const newErrors = {};

        validateField('emailOrPhone');
        validateField('password');

        if (!agree) {
            newErrors.agree = 'Vous devez accepter les conditions d\'utilisation';
        }

        if (!captchaValue) {
            newErrors.captcha = 'Veuillez compléter le captcha';
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    // Rediriger si déjà connecté
    useEffect(() => {
        if (currentUser) {
            navigate(redirectTo, { replace: true });
        }
    }, [currentUser, navigate, redirectTo]);

    // Gestion du captcha
    const handleCaptchaChange = useCallback((value) => {
        setCaptchaValue(value);
        if (value && errors.captcha) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.captcha;
                return newErrors;
            });
        }
    }, [errors.captcha]);

    // Soumission du formulaire
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const res = await signInWithEmailOrPhoneAndPassword(
                formData.emailOrPhone,
                formData.password,
                rememberMe,
                captchaValue
            );
            
            if (res.success) {
                setToast({ show: true, type: 'success', message: 'Connexion réussie 🎉' });
                window.location.href = redirectTo || HOME_URL;
            } else {
                let message = res.message || 'Erreur de connexion';
                setErrors(prev => ({ ...prev, submit: message }));
                setToast({ show: true, type: 'error', message });
            }

        } catch (error) {
            console.error(error);
            const message = error.message || 'Serveur indisponible, réessayez plus tard.';
            setErrors(prev => ({ ...prev, submit: message }));
            setToast({ show: true, type: 'error', message });
        } finally {
            setLoading(false);
            // Réinitialiser reCAPTCHA
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setCaptchaValue(null);
            }
        }
    };

    return (
        <div className="signin">
            <div className='container'>
                <div className='header'>
                    <Logo
                        src={logos.letterWhiteBgBlue}
                        size='lg'
                        alt='AdsCity'
                        text='AdsCity'
                        showText={false}
                        onclick={() => window.location.href = HOME_URL}
                    />
                    <h1 className="title">Bon retour !</h1>
                    <p className="subtitle">Connectez-vous à votre compte</p>
                </div>

                <div className="form">
                    {errors.submit && <div className="error-message">{errors.submit}</div>}

                    <div className="form-group">
                        <Input
                            className="input-wrapper"
                            type="text"
                            name="emailOrPhone"
                            placeholder="Adresse email ou numéro de téléphone"
                            value={email || formData.emailOrPhone}
                            onChange={(value) => handleInputChange('emailOrPhone', value)}
                            icon={<User size={18} />}
                            disabled={loading}
                            required
                            error={!!errors.emailOrPhone}
                            onBlur={() => validateField('emailOrPhone')}
                        />
                        {errors.emailOrPhone && (
                            <div className="input-error-message">{errors.emailOrPhone}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={(value) => handleInputChange('password', value)}
                            icon={<Lock size={18} />}
                            disabled={loading}
                            required
                            rightElement={
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                            error={!!errors.password}
                            onBlur={() => validateField('password')}
                        />
                        {errors.password && (
                            <div className="input-error-message">{errors.password}</div>
                        )}
                    </div>

                    <div className="form-options">
                        <Checkbox
                            label="Se souvenir de moi"
                            checked={rememberMe}
                            onChange={setRememberMe}
                            disabled={loading}
                        />
                        <Link to="/forgot-password" className="forgot-link">
                            Mot de passe oublié ?
                        </Link>
                    </div>

                    <div className="form-group">
                        <Checkbox
                            label={
                                <span>
                                    J'accepte les {' '}
                                    <Link to="/legal/terms" className="terms-link">conditions d'utilisation</Link>
                                    {' '} et la {' '}
                                    <Link to="/legal/privacy" className="terms-link">politique de confidentialité</Link>
                                </span>
                            }
                            checked={agree}
                            onChange={setAgree}
                            disabled={loading}
                            error={!!errors.agree}
                        />
                        {errors.agree && (
                            <div className="input-error-message">{errors.agree}</div>
                        )}
                    </div>

                    <div className="captcha-wrapper">
                        <ReCAPTCHA
                            lang='fr'
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaChange}
                            theme="light"
                        />
                        {errors?.captcha && <span className="error-message">{errors?.captcha}</span>}
                    </div>

                    <Button
                        type='submit'
                        onClick={handleSubmit}
                        variant='primary'
                        disabled={loading}
                        className="signin-button"
                        fullWidth
                    >
                        {loading ? (
                            <ActivityIndicator type="digital" size={20} color="#ffffff" />
                        ) : (
                            <Label text={'Se connecter'} color='white' />
                        )}
                    </Button>

                    <div className="signup-link">
                        <p>
                            Pas encore de compte ?{' '}
                            <Link to="/create-user" className="link">S'inscrire</Link>
                        </p>
                    </div>
                </div>
            </div>

            <Toast
                show={toast?.show}
                type={toast?.type}
                message={toast?.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
