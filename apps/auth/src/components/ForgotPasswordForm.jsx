import { Mail } from "lucide-react";
import Input from "./ui/Input";
import ReCAPTCHA from "react-google-recaptcha";
import ActivityIndicator from "./ui/ActivityIndicator";

export default function ForgotPasswordForm({ formData, errors, loading, recaptchaRef, RECAPTCHA_SITE_KEY, handleInputChange, onSubmit, validateField, handleCaptchaChange }) {
    return (
        <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
                <Input
                    className="input-wrapper"
                    type="email"
                    name="email"
                    placeholder="Adresse email"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    icon={<Mail size={18} />}
                    disabled={loading}
                    required
                    error={!!errors.email}
                    onBlur={() => validateField('email')}
                />
                {errors.email && (
                    <div className="input-error-message">
                        {errors.email}
                    </div>
                )}
            </div>

            {/* reCAPTCHA */}
            <div className="form-group">
                <div className="captcha-wrapper">
                    <ReCAPTCHA
                        ref={recaptchaRef}
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


            <button
                type="submit"
                className="submit-button"
                disabled={loading || !formData.email}
            >
                {loading
                    ? <ActivityIndicator
                        type="material"
                        color="#ffffff"
                        className="spinner"
                        size={16}
                    /> :
                    "Envoyer le lien"
                }
            </button>
        </form>
    );
};
