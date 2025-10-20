import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { user } from '../../data/mockData';
import { Globe, Eye, Save, Bell, Smartphone } from 'lucide-react';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { channels, notificationTypes } from '../../config';
import { getUserPreferences, updateUserPreferences } from '../../services/notifications';
import '../../styles/public/Settings.scss';

export default function Settings() {
    const { currentUser } = useAuth();

    const [preferences, setPreferences] = useState({});
    const [formData, setFormData] = useState({
        preferredLanguage: user.preferredLanguage,
        emailNotifications: user.emailNotifications,
        smsNotifications: user.smsNotifications,
        isProfilePublic: user.isProfilePublic,
        showPhoneNumber: user.showPhoneNumber,
    });

    useEffect(() => {
        const fetchPreferences = async () => {
            const resp = await getUserPreferences(currentUser.id);
            if (resp.success) {
                const prefs = {};
                resp.data.forEach(pref => {
                    prefs[pref.type] = pref.channels;
                });
                setPreferences(prefs);
            }
        }

        if (currentUser && currentUser.id) {
            fetchPreferences();
        }
    }, [currentUser]);

    const handleToggleChannel = (type, channel) => {
        setPreferences(prev => {
            const prevChannels = prev[type] || [];
            const updatedChannels = prevChannels.includes(channel)
                ? prevChannels.filter(c => c !== channel)
                : [...prevChannels, channel];
            return { ...prev, [type]: updatedChannels };
        });
    };

    const handleSavePreferences = async (e) => {
        e.preventDefault();
        // Sauvegarde des préférences
        await updateUserPreferences(currentUser.id, preferences);
        alert('Préférences sauvegardées !');
    };


    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev,
                [name]: checked
            }
        }));
    };


    const handleToggleChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, would save to backend here
        alert('Settings saved successfully!');
    };

    const handleBack = () => {
        window.history.back();
    }

    return (
        <div className='settings'>
            <PageHeader
                onClick={handleBack}
                location={'Paramètres'}
                title={'Paramètres de votre compte'}
                description={"Personnalisez votre expérience sur AdsCity"}
            />

            <Card className="settings-card">
                <CardHeader>
                    <CardTitle className="card-title-icon">
                        <Smartphone size={18} className="icon-title" />
                        Numéro de téléphone
                    </CardTitle>
                    <CardDescription>
                        Pour que votre vrai numéro ne tombe pas dans la base de données des escrocs, nous montrons à la place un usurpateur, et nous vous transférons les appels. Cette protection ne peut pas être désactivée.
                    </CardDescription>
                </CardHeader>
                <CardBody>
                    <div>
                        <p className="field-value">{currentUser.phone}</p>
                    </div>
                </CardBody>
            </Card>

            <form onSubmit={handleSubmit} className="settings-form">
                {/* Language preferences */}
                <Card className="settings-card">
                    <CardHeader>
                        <CardTitle className="card-title-icon">
                            <Globe size={18} className="icon-title" />
                            Préférences de langue
                        </CardTitle>
                        <CardDescription>Choississez votre langue préférée pour l'interface</CardDescription>
                    </CardHeader>
                    <CardBody>
                        <div className="form-group">
                            <label htmlFor="preferredLanguage" className="label">
                                Langue Préférée
                            </label>
                            <select
                                id="preferredLanguage"
                                name="preferredLanguage"
                                value={formData.preferredLanguage}
                                onChange={handleSelectChange}
                                className="select-input"
                            >
                                <option value="English">Anglais</option>
                                <option value="French">Français</option>
                            </select>
                        </div>
                    </CardBody>
                </Card>

                {/* Notification settings */}
                <Card className="settings-card">
                    <CardHeader>
                        <CardTitle className="card-title-icon">
                            <Bell size={18} className="icon-title" />
                            Notification Settings
                        </CardTitle>
                        <CardDescription>Control how and when you receive notifications</CardDescription>
                    </CardHeader>
                    <CardBody>
                        <div className="toggle-group">
                            {[
                                {
                                    label: 'Email Notifications',
                                    desc: 'Receive notifications via email',
                                    name: 'emailNotifications',
                                    checked: formData.emailNotifications,
                                },
                                {
                                    label: 'SMS Notifications',
                                    desc: 'Receive notifications via SMS',
                                    name: 'smsNotifications',
                                    checked: formData.smsNotifications,
                                },
                            ].map((setting) => (
                                <div key={setting.name} className="toggle-item">
                                    <div>
                                        <p className="toggle-title">{setting.label}</p>
                                        <p className="toggle-desc">{setting.desc}</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name={setting.name}
                                            checked={setting.checked}
                                            onChange={handleToggleChange}
                                            className="sr-only"
                                        />
                                        <div className="switch-slider"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Privacy settings */}
                <Card className="settings-card">
                    <CardHeader>
                        <CardTitle className="card-title-icon">
                            <Eye size={18} className="icon-title" />
                            Privacy Settings
                        </CardTitle>
                        <CardDescription>Control your profile visibility and data sharing</CardDescription>
                    </CardHeader>
                    <CardBody>
                        <div className="toggle-group">
                            {[
                                {
                                    label: 'Public Profile',
                                    desc: 'Make your profile visible to others',
                                    name: 'isProfilePublic',
                                    checked: formData.isProfilePublic,
                                },
                                {
                                    label: 'Show Phone Number',
                                    desc: 'Allow others to see your phone number',
                                    name: 'showPhoneNumber',
                                    checked: formData.showPhoneNumber,
                                },
                            ].map((privacy) => (
                                <div key={privacy.name} className="toggle-item">
                                    <div>
                                        <p className="toggle-title">{privacy.label}</p>
                                        <p className="toggle-desc">{privacy.desc}</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name={privacy.name}
                                            checked={privacy.checked}
                                            onChange={handleToggleChange}
                                            className="sr-only"
                                        />
                                        <div className="switch-slider"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Danger zone */}
                <Card className="settings-card danger-zone">
                    <CardHeader>
                        <CardTitle className="text-danger">Danger Zone</CardTitle>
                        <CardDescription>Irreversible account actions</CardDescription>
                    </CardHeader>
                    <CardBody>
                        <div className="delete-box">
                            <h4 className="delete-title">Delete Account</h4>
                            <p className="delete-description">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <div className="delete-action">
                                <Button variant="danger">Delete Account</Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className="form-footer">
                    <Button type="submit" icon={<Save size={16} />}>
                        Save Settings
                    </Button>
                </div>
            </form>

            <form onSubmit={handleSubmit} className="settings-form">
                {notificationTypes.map(nt => (
                    <Card key={nt.key} className="settings-card">
                        <CardHeader>
                            <CardTitle>{nt.label}</CardTitle>
                            <CardDescription>Choisissez comment vous voulez recevoir ces notifications</CardDescription>
                        </CardHeader>
                        <CardBody>
                            <div className="toggle-group">
                                {channels.map(ch => (
                                    <div key={ch.key} className="toggle-item">
                                        <div>
                                            <p className="toggle-title">{ch.label}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={preferences[nt.key]?.includes(ch.key) || false}
                                                onChange={() => handleToggleChannel(nt.key, ch.key)}
                                                className="sr-only"
                                            />
                                            <div className="switch-slider"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                ))}
                <div className="form-footer">
                    <Button
                        type="submit"
                        size='sm'
                        onClick={handleSavePreferences}
                    >
                        Sauvegarder les préférences
                    </Button>
                </div>
            </form>
        </div>
    )
}
