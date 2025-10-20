import { Check } from "lucide-react";
import { logos } from "../config";
import Logo from "./ui/Logo";

export default function ForgotPasswordHeader({ isEmailSent, formData, HOME_URL }) {
    return (
        <div className='header'>
            <Logo src={logos.letterWhiteBgBlue} size='lg' alt='AdsCity' onclick={() => window.location.href = HOME_URL} />
            {!isEmailSent ? (
                <>
                    <h1 className="title">
                        Mot de passe oublié ?
                    </h1>
                    <p className="subtitle">
                        Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                </>
            ) : (
                <>
                    <div className="success-icon">
                        <Check size={48} />
                    </div>
                    <h1 className="title">
                        E-mail envoyé !
                    </h1>
                    <p className="subtitle">
                        Nous avons envoyé un lien de réinitialisation à <strong>{formData.email}</strong>
                    </p>
                </>
            )}
        </div>
    );
};
