import { useCallback, useEffect, useRef, useState } from "react";
import { logos, resetPasswordRules } from "../../config";
import Logo from "../../components/ui/Logo";
import { Lock } from "lucide-react";
import SecureInput from "../../components/ui/SecureInput";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";

const HOME_URL = process.env.REACT_APP_HOME_URL;
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
        agree: false
    });
    const [captchaValue, setCaptchaValue] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isFormValid, setIsFormValid] = useState(false);

    // Refs
    const validationTimeouts = useRef({});
    const recaptchaRef = useRef(null);

    // Fonction de validation d'un champ
    const validateField = useCallback((name, value, allFormData = formData) => {
        const rules = resetPasswordRules[name];
        if (!rules) return null;

        const trimmedValue = typeof value === 'string' ? value.trim() : value;

        // Vérification requis
        if (rules.required && (!trimmedValue || trimmedValue === '')) {
            return rules.messages.required;
        }

        // Si le champ n'est pas requis et est vide, pas d'erreur
        if (!rules.required && (!trimmedValue || trimmedValue === '')) {
            return null;
        }

        // Vérification longueur minimale
        if (rules.minLength && trimmedValue.length < rules.minLength) {
            return rules.messages.minLength;
        }

        // Vérification longueur maximale
        if (rules.maxLength && trimmedValue.length > rules.maxLength) {
            return rules.messages.maxLength;
        }

        // Vérification pattern
        if (rules.pattern && !rules.pattern.test(trimmedValue)) {
            return rules.messages.pattern;
        }

        return null;
    }, [formData]);

    // Validation en temps réel
    useEffect(() => {
        const isValid = formData.email &&
            formData.password &&
            formData.agree &&
            captchaValue &&
            Object.keys(errors).length === 0;
        setIsFormValid(isValid);
    }, [formData, errors, captchaValue]);

    // Gestion des changements dans le formulaire
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value.trim()
        }));

        // Validation en temps réel avec debounce
        if (validationTimeouts.current[name]) {
            clearTimeout(validationTimeouts.current[name]);
        }
    }, []);

    // Validation de tout le formulaire
    const validateAllFields = useCallback(() => {
        let isValid = true;
        const newErrors = {};

        // Valider tous les champs
        Object.keys(resetPasswordRules).forEach(fieldName => {
            const error = validateField(fieldName, formData[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
                isValid = false;
            }
        });

        if (!captchaValue) {
            newErrors.captcha = 'Veuillez compléter le captcha';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [formData, captchaValue, validateField]);

    // Affichage des toasts
    const showToast = useCallback((type, message) => {
        setToast({ show: true, type, message });
    }, []);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        if (value) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.captcha;
                return newErrors;
            });
        }
    };

    // Soumission du formulaire
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validateAllFields()) {
            showToast('error', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setIsLoading(true);


    }, [validateAllFields, showToast]);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className="signin">
            <div className='container'>
                {/* Header avec Logo */}
                <div className='header'>
                    <Logo src={logos.letterWhiteBgBlue} size='lg' alt='AdsCity' onclick={() => window.location.href = HOME_URL} />
                    <h1 className="title">
                        Bon retour !
                    </h1>
                    <p className="subtitle">
                        Connectez-vous à votre compte
                    </p>
                </div>

                {/* Form */}
                <div className="form">
                    {errors.serve && <p className="error-message">{errors.serve}</p>}

                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                            Nouveau mot de passe
                        </label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" />

                            <SecureInput
                                className={`form-input ${errors.newPassword ? 'error' : ''} ${formData.newPassword ? 'filled' : ''}`}
                                // type={showPassword ? 'text' : 'password'}
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                placeholder="Votre mot de passe"
                                value={formData.newPassword}
                                onChange={handleChange}
                                autoComplete="current-password"
                                showPasswordToggle={true}
                                onTogglePassword={toggleShowPassword}
                                showPassword={showPassword}
                                aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                                aria-describedby={errors.newPassword ? 'password-error' : undefined}
                            />
                        </div>
                        {errors.newPassword && (
                            <div id="password-error" className="error-message" role="alert">
                                {errors.newPassword}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Conrimez le mot de passe
                        </label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" />

                            <SecureInput
                                className={`form-input ${errors.confirmPassword ? 'error' : ''} ${formData.confirmPassword ? 'filled' : ''}`}
                                // type={showPassword ? 'text' : 'password'}
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Votre mot de passe"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="current-password"
                                showPasswordToggle={true}
                                onTogglePassword={toggleShowConfirmPassword}
                                showPassword={showConfirmPassword}
                                aria-label={showConfirmPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                                aria-describedby={errors.confirmPassword ? 'password-error' : undefined}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <div id="password-error" className="error-message" role="alert">
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>

                    {/* Conditions d'utilisation */}
                    <div className="form-group">
                        <label className="checkbox-wrapper checkbox-wrapper--terms">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={formData.agree}
                                onChange={handleChange}
                                className="checkbox-input"
                                aria-describedby={errors.agree ? 'agree-error' : undefined}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-label">
                                J'accepte les{' '}
                                <Link to={`/legal/terms`} target="_blank" className="terms-link">
                                    Conditions d'utilisation{' '}
                                </Link>
                                et la{' '}
                                <Link to={`/legal/privacy-policy`} target="_blank" className="terms-link">
                                    Politique de confidentialité
                                </Link>
                            </span>
                        </label>
                        {errors.agree && (
                            <div id="agree-error" className="error-message" role="alert">
                                {errors.agree}
                            </div>
                        )}
                    </div>

                    {/* reCAPTCHA */}
                    <div className="form-group">
                        <div className="captcha-wrapper">
                            <ReCAPTCHA
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={handleCaptchaChange}
                                theme="light"
                                size="normal"
                            />
                        </div>
                        {errors.captcha && (
                            <div className="error-message" role="alert">
                                {errors.captcha}
                            </div>
                        )}
                    </div>

                    {/* Bouton de connexion */}
                    <button
                        type="submit"
                        className="nav-button nav-button--submit"
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        {isLoading ? (
                            <>
                                <Spinner variant="bounce" size={15} color="#fff" />
                            </>
                        ) : (
                            <span>
                                Confirmer
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
