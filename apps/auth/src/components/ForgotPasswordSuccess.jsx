import ActivityIndicator from "./ui/ActivityIndicator";

export default function ForgotPasswordSuccess({ onResendEmail, loading }) {
    return (
        <div className="success-content">
            <div className="instructions">
                <h3>Que faire maintenant ?</h3>
                <ol>
                    <li>Vérifiez votre boîte de réception</li>
                    <li>Cliquez sur le lien dans l'e-mail</li>
                    <li>Créez un nouveau mot de passe</li>
                    <li>Connectez-vous avec votre nouveau mot de passe</li>
                </ol>
            </div>

            <div className="help-section">
                <p className="help-text">
                    Vous n'avez pas reçu l'e-mail ? Vérifiez votre dossier spam ou
                </p>
                <button
                    type="button"
                    className="resend-button"
                    onClick={onResendEmail}
                    disabled={loading}
                >
                    {loading 
                    ? <ActivityIndicator
                        type="material"
                        color="#ffffff"
                        className="spinner"
                        size={16}
                    /> : "Renvoyer l'e-mail"}
                </button>
            </div>
        </div>
    );
};
