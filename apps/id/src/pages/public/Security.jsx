import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { CheckCircle, Key, Smartphone, XCircle } from 'lucide-react';
import { user } from '../../data/mockData';
import Button from '../../components/ui/Button';
import '../../styles/public/Security.scss';

export default function Security() {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled);

    const handleBack = () => {
        window.history.back();
    }

    const handleSubmit = async () => { }

    return (
        <div className='security'>
            <PageHeader
                onClick={handleBack}
                location={'Sécurité'}
                title={'Vos paramètres de sécurité'}
                description={"Gérez les paramètres et recommandations pour vous aider à protéger votre compte"}
            />

            {/* Password section */}
            <Card>
                <CardHeader>
                    <CardTitle className='two-factor__header'>
                        <Key size={18} />
                        Mot de passe
                    </CardTitle>
                    <CardDescription>
                        Sécurisez votre compte avec un mot de passe fort.
                    </CardDescription>
                </CardHeader>
                <CardBody>
                    {!showChangePassword ? (
                        <div className="change-password__status">
                            <p>Dernière mise à jour 3 months ago</p>
                            <Button
                                onClick={() => setShowChangePassword(true)}
                                variant="outline"
                                size='sm'
                            >
                                Modifier
                            </Button>
                        </div>
                    ) : (
                        <form className="change-password__form" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="current-password">Current Password</label>
                                <input type="password" id="current-password" autoComplete="current-password" />
                            </div>

                            <div>
                                <label htmlFor="new-password">New Password</label>
                                <input type="password" id="new-password" autoComplete="new-password" />
                            </div>

                            <div>
                                <label htmlFor="confirm-password">Confirm New Password</label>
                                <input type="password" id="confirm-password" autoComplete="new-password" />
                            </div>

                            <div className="change-password__form-actions">
                                <Button type="submit" size='sm'>Save Changes</Button>
                                <Button type="button" variant="outline" size='sm' onClick={() => setShowChangePassword(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </CardBody>
            </Card>

            {/* Two-factor authentication */}
            <Card>
                <CardHeader>
                    <CardTitle className="two-factor__header">
                        <Smartphone size={18} />
                        Authentification à deux facteurs
                    </CardTitle>
                    <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte</CardDescription>
                </CardHeader>

                <CardBody>
                    <div className="two-factor__status-container">
                        <div className="two-factor__status">
                            <div className="two-factor__status-icon">
                                {twoFactorEnabled ? (
                                    <CheckCircle className="enabled" />
                                ) : (
                                    <XCircle className="disabled" />
                                )}
                            </div>
                            <div className="two-factor__status-text">
                                <p>{twoFactorEnabled ? 'Activé' : 'Désactivé'}</p>
                                <p>
                                    {twoFactorEnabled
                                        ? 'Vous avez activé l’authentification à deux facteurs'
                                        : 'Vous n’avez pas activé l’authentification à deux facteurs'}
                                </p>
                            </div>
                        </div>

                        <Button
                            size='sm'
                            variant={twoFactorEnabled ? 'outline' : 'primary'}
                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        >
                            {twoFactorEnabled ? 'Désactiver' : 'Activer'}
                        </Button>
                    </div>
                </CardBody>
            </Card>

        </div>
    )
}
