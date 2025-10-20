import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCallback, useRef, useState } from 'react';
import Logo from '../../components/ui/Logo';
import { logos } from '../../config';
import Avatar from '../../components/ui/Avatar';
import { Eye, EyeOff, Lock } from 'lucide-react';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import { verifyPassword } from '../../services/auth';
import '../../styles/public/VerifyIdentity.scss';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Label from '../../components/ui/Label';
import ReCAPTCHA from 'react-google-recaptcha';
import Checkbox from '../../components/ui/Checkbox';

const HOME_URL = process.env.REACT_APP_HOME_URL;
const ID_URL = process.env.REACT_APP_ACCOUNT_URL;
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

export default function VerifyIdentity() {
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const action = searchParams.get('action');

    const recaptchaRef = useRef(null);

    const [agree, setAgree] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [formData, setFormData] = useState({
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const name = `${currentUser.firstName} ${currentUser.lastName}`;

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

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const res = await verifyPassword(formData.password);

            if (res.success) {
                if (action === 'recovery-email') {
                    window.location.href = `${ID_URL}/security/email-addresses/add?type=${action}`;
                } else if (action === 'edit-phone') {
                    window.location.href = `${ID_URL}/profile/personal-info/phone-number?action=${action}`;
                }
            } else {
                setErrors({ password: 'Mot de passe incorrect. Veuillez réessayer.' });
            }
        } catch (error) {
            console.log(error);
            setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='verify-identity'>
            <div className="container">
                <div className='logo'>
                    <Logo
                        src={logos.letterWhiteBgBlue}
                        size='lg'
                        alt='AdsCity'
                        text='AdsCity'
                        showText={false}
                        onclick={() => window.location.href = HOME_URL}
                    />
                </div>
                <div id="user-details">
                    <div>
                        <h2> {name} </h2>

                        <button>
                            <Avatar name={name} size='sm' />
                            <span> {currentUser.email} </span>
                        </button>
                    </div>
                </div>
                <div className="form">
                    <p>Pour continuer, veuillez confirmer votre identité</p>
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

                    <div className="form-group">
                        <span className="other-method">
                            Essayez une autre méthode
                        </span>

                        <Button
                            type='submit'
                            onClick={handleSubmit}
                            variant='primary'
                            disabled={loading}
                            className="button button--next"
                            fullWidth
                        >
                            {loading ? (
                                <ActivityIndicator type="digital" size={20} color="#ffffff" />
                            ) : (
                                <Label text={'Se connecter'} color='white' />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
