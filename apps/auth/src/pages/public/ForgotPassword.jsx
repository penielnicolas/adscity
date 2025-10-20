import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { resetPasswordFormValidationRules } from "../../config";
import Toast from "../../components/ui/Toast";
import { forgotPassword } from "../../services/auth";
import ForgotPasswordSuccess from "../../components/ForgotPasswordSuccess";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import ForgotPasswordHeader from "../../components/ForgotPasswordHeader";
import '../../styles/public/ForgotPassword.scss';

const HOME_URL = process.env.REACT_APP_HOME_URL;

export default function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: '',
        agree: false
    });
    const [captchaValue, setCaptchaValue] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isFormValid, setIsFormValid] = useState(false);

    // Refs
    const recaptchaRef = useRef(null);

    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    // Fonction de validation d'un champ
    const validateField = useCallback((name, value, allFormData = formData) => {
        const rules = resetPasswordFormValidationRules[name];
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

        // Validations spéciales
        switch (name) {
            case 'email':
                if (trimmedValue.includes('..') ||
                    trimmedValue.startsWith('.') ||
                    trimmedValue.endsWith('.')) {
                    return rules.messages.pattern;
                }
                break;

            default:
                break;
        }

        return null;
    }, [formData]);

    // Validation en temps réel
    useEffect(() => {
        const isValid = formData.email && formData.agree && captchaValue && Object.keys(errors).length === 0;
        setIsFormValid(isValid);
    }, [formData, errors, captchaValue]);

    // Validation de tout le formulaire
    const validateAllFields = useCallback(() => {
        let isValid = true;
        const newErrors = {};

        // Valider tous les champs
        Object.keys(resetPasswordFormValidationRules).forEach(fieldName => {
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
            return showToast('error', 'Veuillez corriger les erreurs dans le formulaire');
        }

        setLoading(true);
        try {
            const { success, message } = await forgotPassword(formData.email, captchaValue);
            if (!success) throw new Error(message);

            setIsEmailSent(true);
            showToast('success', 'E-mail de réinitialisation envoyé avec succès');
        } catch (error) {
            const errorMap = {
                'user-not-found': 'Aucun compte associé à cette adresse e-mail',
                'too-many-requests': 'Trop de tentatives. Veuillez patienter avant de réessayer.',
                'network': 'Problème de connexion. Vérifiez votre connexion internet.'
            };

            const match = Object.keys(errorMap).find(k => error.message.includes(k));
            showToast('error', match ? errorMap[match] : 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    }, [formData.email, captchaValue, validateAllFields, showToast]);

    const handleInputChange = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, [])

    // Renvoyer l'e-mail
    const handleResendEmail = useCallback(async () => {
        setLoading(true);

        try {
            const response = await forgotPassword(formData.email.toLowerCase());

            if (response.success) {
                showToast('success', 'E-mail renvoyé avec succès');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Erreur lors du renvoi:', error);
            showToast('error', 'Erreur lors du renvoi de l\'e-mail');
        } finally {
            setLoading(false);
        }
    }, [formData.email, showToast]);

    return (
        <div className="forgot-password">
            <div className="container">
                <ForgotPasswordHeader
                    HOME_URL={HOME_URL}
                    isEmailSent={isEmailSent}
                    formData={formData}
                />

                {/* Formulaire */}
                {!isEmailSent
                    ? <ForgotPasswordForm
                        formData={formData}
                        errors={errors}
                        loading={loading}
                        recaptchaRef={recaptchaRef}
                        RECAPTCHA_SITE_KEY={RECAPTCHA_SITE_KEY}
                        handleInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                        validateField={validateField}
                        handleCaptchaChange={handleCaptchaChange}
                    />
                    : <ForgotPasswordSuccess
                        loading={loading}
                        onResendEmail={handleResendEmail}
                    />
                }

                {/* Lien de retour */}
                <div className="back-link">
                    <Link to="/" className="link">
                        <span>Retour à la connexion</span>
                    </Link>
                </div>

                {/* Aide supplémentaire */}
                <div className="help-footer">
                    <p>
                        Besoin d'aide ? <Link to="/help/contact" className="link">Contactez notre support</Link>
                    </p>
                </div>
            </div >

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
