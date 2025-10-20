import { useCallback, useRef, useState } from "react";
import { parsePhoneNumberFromString, isValidPhoneNumber, AsYouType } from 'libphonenumber-js';
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { AnimatePresence, motion } from 'framer-motion';
import Logo from "../../components/ui/Logo";
import ActivityIndicator from "../../components/ui/ActivityIndicator";
import Toast from "../../components/ui/Toast";
import { createUser } from "../../services/auth";
import { logos } from "../../config";
import Checkbox from "../../components/ui/Checkbox";
import Button from "../../components/ui/Button";
import Label from "../../components/ui/Label";
import StepIndicator from "../../components/StepIndicator";
import useSignupSteps from "../../components/SignupSteps";
import '../../styles/public/Signup.scss';

const HOME_URL = process.env.REACT_APP_HOME_URL;
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

export default function Signup() {
    const navigate = useNavigate();

    // États du formulaire
    const [step, setStep] = useState(0);
    const [agree, setAgree] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const recaptchaRef = useRef(null);

    const handleInputChange = useCallback((name, value) => {
        if (name === 'phoneNumber') {
            // 🔹 Format "en direct" lors de la saisie
            const formattedValue = new AsYouType('CI').input(value); // "CI" = Côte d'Ivoire
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    const validateField = useCallback((fieldName) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'firstName':
                if (!formData.firstName.trim()) {
                    newErrors.firstName = 'Le prénom est requis';
                } else if (formData.firstName.length < 2) {
                    newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
                } else if (formData.firstName.length >= 50) {
                    newErrors.firstName = 'Le prénom ne doit pas dépasser 50 caractères';
                } else {
                    delete newErrors.firstName;
                }
                break;

            case 'lastName':
                if (!formData.lastName.trim()) {
                    newErrors.lastName = 'Le nom est requis';
                } else if (formData.lastName.length < 2) {
                    newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
                } else if (formData.lastName.length >= 50) {
                    newErrors.lastName = 'Le nom ne doit pas dépasser 50 caractères';
                } else {
                    delete newErrors.lastName;
                }
                break;

            case 'email':
                if (!formData.email.trim()) {
                    newErrors.email = 'L\'email est requis';
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = 'Veuillez entrer une adresse email valide';
                } else {
                    delete newErrors.email;
                }
                break;

            case 'phoneNumber':
                if (!formData.phoneNumber.trim()) {
                    newErrors.phoneNumber = 'Le numéro de téléphone est requis';
                } else if (!isValidPhoneNumber(formData.phoneNumber, 'CI')) {
                    newErrors.phoneNumber = 'Veuillez entrer un numéro ivoirien valide';
                } else {
                    delete newErrors.phoneNumber;
                }
                break;

            case 'password':
                if (!formData.password.trim()) {
                    newErrors.password = 'Le mot de passe est requis';
                } else if (formData.password.length < 8) {
                    newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                    newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
                } else {
                    delete newErrors.password;
                }
                break;

            case 'confirmPassword':
                if (!formData.confirmPassword.trim()) {
                    newErrors.confirmPassword = 'Le mot de passe est requis';
                } else if (formData.confirmPassword !== formData.password) {
                    newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return !newErrors[fieldName];
    }, [errors, formData]);

    const validateForm = () => {
        const newErrors = {};

        // Validation de tous les champs
        validateField('firstName');
        validateField('lastName');
        validateField('email');
        validateField('phoneNumber');
        validateField('password');
        validateField('confirmPassword');

        // Validation des conditions
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

    // Soumission du formulaire
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const phoneToSend = parsePhoneNumberFromString(formData.phoneNumber, 'CI')?.number;

            const res = await createUser(
                formData.email,
                phoneToSend,
                formData.firstName,
                formData.lastName,
                formData.password,
                captchaValue
            );

            if (res.success) {
                setToast({ show: true, type: 'success', message: 'Inscription réussie 🎉' });
                localStorage.setItem('pending_email_to_verify', res.user?.email)
                navigate('/verify-email', { replace: true });
            } else {
                let message = res?.message || 'Erreur lors de l\'inscription';
                setErrors(prev => ({ ...prev, submit: message }));
                setToast({ show: true, type: 'error', message });
            }
        } catch (error) {
            console.error(error);
            setErrors(prev => ({ ...prev, submit: 'Impossible de se connecter au serveur' }));
            setToast({ show: true, type: 'error', message: 'Serveur indisponible, réessayez plus tard.' });
        } finally {
            setLoading(false);
            // Réinitialiser reCAPTCHA
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setCaptchaValue(null);
            }
        }
    };

    // Navigation entre les étapes
    const nextStep = useCallback(() => {
        let isValid = true;
        const newErrors = {};

        if (step === 0) {
            if (!formData.firstName.trim()) {
                newErrors.firstName = 'Le prénom est requis';
                isValid = false;
            }
            if (!formData.lastName.trim()) {
                newErrors.lastName = 'Le nom est requis';
                isValid = false;
            }
        } else if (step === 1) {
            if (!formData.email.trim()) {
                newErrors.email = 'L\'email est requis';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Veuillez entrer une adresse email valide';
                isValid = false;
            }

            const cleanPhone = formData.phoneNumber.replace(/\s+/g, '').replace(/^\+225/, '');
            if (!formData.phoneNumber.trim()) {
                newErrors.phoneNumber = 'Le numéro de téléphone est requis';
                isValid = false;
            } else if (cleanPhone.length !== 10) {
                newErrors.phoneNumber = 'Le numéro de téléphone doit contenir 10 chiffres';
                isValid = false;
            }
        } else if (step === 2) {
            if (!formData.password.trim()) {
                newErrors.password = 'Le mot de passe est requis';
                isValid = false;
            } else if (formData.password.length < 8) {
                newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
                isValid = false;
            }

            if (!formData.confirmPassword.trim()) {
                newErrors.confirmPassword = 'La confirmation du mot de passe est requis';
                isValid = false;
            } else if (formData.confirmPassword !== formData.password) {
                newErrors.confirmPassword = 'Les mots de passe doivent correspondre';
                isValid = false;
            }
        }

        if (!isValid) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            return;
        }

        setStep(step + 1);
    }, [step, formData]);

    const prevStep = useCallback(() => {
        if (step > 0) {
            setStep(step - 1);
        }
    }, [step]);

    const steps = useSignupSteps({
        formData,
        errors,
        loading,
        showPassword,
        showConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        onInputChange: handleInputChange,
        validateField
    });
    return (
        <div className="signup">
            <div className="container">
                <div className="header">
                    <Logo
                        src={logos.letterWhiteBgBlue}
                        size='lg'
                        alt='AdsCity'
                        text='AdsCity'
                        showText={false}
                        onclick={() => window.location.href = HOME_URL}
                    />
                    <h1 className="title">Créer un compte</h1>
                    <p className="subtitle">
                        Rejoignez notre communauté en quelques étapes simples
                    </p>
                </div>

                <div className="form">
                    <StepIndicator step={step} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="step-content"
                        >
                            <h2 className="step-title">
                                {steps[step]?.title}
                            </h2>
                            {steps[step]?.content}
                        </motion.div>
                    </AnimatePresence>

                    <div className="form-group">
                        <Checkbox
                            label={
                                <span>
                                    J'accepte les {' '}
                                    <Link to="/legal/terms" className="terms-link">
                                        conditions d'utilisation
                                    </Link>
                                    {' '} et la {' '}
                                    <Link to="/legal/privacy" className="terms-link">
                                        politique de confidentialité
                                    </Link>
                                </span>
                            }
                            checked={agree}
                            onChange={setAgree}
                            disabled={loading}
                            error={!!errors.agree}
                        />
                        {errors.agree && (
                            <div className="input-error-message">
                                {errors.agree}
                            </div>
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

                    {/* Navigation Buttons */}
                    <div className="form-navigation">
                        {/* Bouton Retour - seulement visible si ce n'est pas la première étape */}
                        {step > 0 && (
                            <Button
                                size="sm"
                                type='button'
                                onClick={prevStep}
                                variant='outline'
                                disabled={loading}
                                className="button button--back"
                                fullWidth
                            >
                                <Label text={'Retour'} color="white" />
                            </Button>
                        )}

                        <div className="nav-spacer" />

                        {/* Bouton Suivant/Créer */}
                        {step < 2 ? (
                            <Button
                                size="sm"
                                type='button'
                                onClick={nextStep}
                                variant='primary'
                                disabled={loading}
                                className="button button--next"
                                fullWidth
                            >
                                <Label text={'Suivant'} color='white' />
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                type='submit'
                                onClick={handleSubmit}
                                variant='primary'
                                disabled={loading}
                                className="button button--submit"
                                fullWidth
                            >
                                {loading ? (
                                    <ActivityIndicator type="digital" size={20} color="#ffffff" />
                                ) : (
                                    <Label text={"S'inscrire"} color='white' />
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Lien de connexion */}
                    <div className="signup-link">
                        <p>
                            Vous avez déjà un compte ?
                            {' '}
                            <Link to="/signin" className="link">
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    <Toast show={toast?.show} type={toast?.type} message={toast?.message} onClose={() => setToast({ ...toast, show: false })} />
                </div>
            </div>
        </div>
    );
};