import { useMemo } from "react";
import Input from "./ui/Input";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

export default function useSignupSteps({
    formData,
    errors,
    loading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    onInputChange,
    validateField,
}) {

    const steps = useMemo(() => [
        {
            title: "Informations personnelles",
            content: (
                <>
                    <div className="form-group">
                        <Input
                            className="input-wrapper"
                            type="text"
                            name="firstName"
                            placeholder="Prénoms"
                            value={formData.firstName}
                            onChange={(value) => onInputChange('firstName', value)}
                            icon={<User size={18} />}
                            disabled={loading}
                            required
                            error={!!errors.firstName}
                            onBlur={() => validateField('firstName')}
                        />
                        {errors.firstName && (
                            <div className="input-error-message">
                                {errors.firstName}
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <Input
                            className="input-wrapper"
                            type="text"
                            name="lastName"
                            placeholder="Nom"
                            value={formData.lastName}
                            onChange={(value) => onInputChange('lastName', value)}
                            icon={<User size={18} />}
                            disabled={loading}
                            required
                            error={!!errors.lastName}
                            onBlur={() => validateField('lastName')}
                        />
                        {errors.lastName && (
                            <div className="input-error-message">
                                {errors.lastName}
                            </div>
                        )}
                    </div>
                </>
            )
        },
        {
            title: "Informations de contact",
            content: (
                <>
                    <div className="form-group">
                        <Input
                            className="input-wrapper"
                            type="email"
                            name="email"
                            placeholder="Adresse email"
                            value={formData.email}
                            onChange={(value) => onInputChange('email', value)}
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

                    <div className="form-group">
                        <Input
                            className="input-wrapper"
                            type="text"
                            name="phoneNumber"
                            placeholder="Ex: +225 01 23 45 6789"
                            value={formData.phoneNumber}
                            onChange={(value) => onInputChange('phoneNumber', value)}
                            icon={<Phone size={18} />}
                            disabled={loading}
                            required
                            error={!!errors.phoneNumber}
                            onBlur={() => validateField('phoneNumber')}
                        />
                        {errors.phoneNumber && (
                            <div className="input-error-message">
                                {errors.phoneNumber}
                            </div>
                        )}
                    </div>
                </>
            )
        },
        {
            title: "Informations de sécurité",
            content: (
                <>
                    <div className="form-group">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={(value) => onInputChange('password', value)}
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
                            <div className="input-error-message">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirmez le mot de passe"
                            value={formData.confirmPassword}
                            onChange={(value) => onInputChange('confirmPassword', value)}
                            icon={<Lock size={18} />}
                            disabled={loading}
                            required
                            rightElement={
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                            error={!!errors.confirmPassword}
                            onBlur={() => validateField('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <div className="input-error-message">
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>
                </>
            )
        },
    ], [formData, errors, loading, showPassword, showConfirmPassword, onInputChange, setShowPassword, setShowConfirmPassword, validateField]);

    return steps;
};
