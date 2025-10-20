import { useCallback, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/ui/Button';
import { Camera, ChevronRight, Mail, Phone, Save, Search, User, UserCog, X } from 'lucide-react';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { formattedDate } from '../../utils';
import Input from '../../components/ui/Input';
import '../../styles/public/Profile.scss';
import Searchbar from '../../components/ui/Searchbar';
import Tabs from '../../components/ui/Tabs';
import Label from '../../components/ui/Label';
import { formatDate } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';

const tabs = [
    { value: 'home', label: "Accueil" },
    { value: 'personal-data', label: "Informations personnelles" },
];

export default function Profile() {
    const { currentUser } = useAuth();

    const [activeTab, setActiveTab] = useState('home'); // < posts | searches | profiles >

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phone,
        country: currentUser.country,
        city: currentUser.city,
    });

    const name = `${currentUser.firstName} ${currentUser.lastName}`;
    const primaryEmail = currentUser?.emails?.length
        && currentUser.emails.find(e => e.types?.includes('PRIMARY'))?.email;

    const recoveryEmail = currentUser?.emails?.length
        && currentUser.emails.find(e => e.types?.includes('RECOVERY'))?.email;

    const contactEmail = currentUser?.emails?.length
        && currentUser.emails.find(e => e.types?.includes('CONTACT'))?.email;



    // Formatage du numéro de téléphone
    const formatPhoneNumber = (value) => {
        // Nettoyer la valeur (ne garder que les chiffres)
        const cleaned = value.replace(/\D/g, '');

        // Si la valeur commence par 225, on la traite comme un numéro complet
        if (cleaned.startsWith('225')) {
            const rest = cleaned.slice(3);
            if (rest.length === 0) return '+225';
            if (rest.length <= 2) return `+225 ${rest}`;
            if (rest.length <= 4) return `+225 ${rest.slice(0, 2)} ${rest.slice(2)}`;
            if (rest.length <= 6) return `+225 ${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(4)}`;
            if (rest.length <= 8) return `+225 ${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(4, 6)} ${rest.slice(6)}`;
            return `+225 ${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(4, 6)} ${rest.slice(6, 8)} ${rest.slice(8, 10)}`;
        }

        // Sinon, on formate comme un numéro local
        if (cleaned.length === 0) return '';
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
        if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
    };

    const handleInputChange = useCallback((name, value) => {
        // Formatage spécial pour le numéro de téléphone
        if (name === 'phoneNumber') {
            const formattedValue = formatPhoneNumber(value);
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

        // Effacer l'erreur du champ quand l'utilisateur tape
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
                // Nettoyer le numéro pour la validation (enlever les espaces et le +225)
                const cleanPhone = formData.phoneNumber.replace(/\s+/g, '').replace(/^\+225/, '');
                if (!formData.phoneNumber.trim()) {
                    newErrors.phoneNumber = 'Le numéro de téléphone est requis';
                } else if (cleanPhone.length !== 10) {
                    newErrors.phoneNumber = 'Le numéro de téléphone doit contenir 10 chiffres';
                } else if (!/^0[1-9]\d{7}$/.test(cleanPhone)) {
                    newErrors.phoneNumber = 'Veuillez entrer un numéro de téléphone valide';
                } else {
                    delete newErrors.phoneNumber;
                }
                break;

            case 'country':
                if (!formData.country.trim()) {
                    newErrors.country = 'Le mot de passe est requis';
                } else {
                    delete newErrors.country;
                }
                break;

            case 'city':
                if (!formData.city.trim()) {
                    newErrors.city = 'Le mot de passe est requis';
                } else {
                    delete newErrors.city;
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
        validateField('country');
        validateField('city');

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});
        setIsEditing(false);
    };

    const handleBack = () => {
        window.history.back();
    }

    return (
        <div className='profile'>
            <PageHeader
                onClick={handleBack}
                location={'Profil'}
                title={'Votre Profil'}
                description={"Gérez les informations sur vous et vos préférences dans les services AdsCity"}
            />

            <Card>
                <CardBody>
                    <div className="avatar-wrapper">
                        <Avatar
                            username={name}
                            size="lg"
                            border
                            source={currentUser.avatar}
                        />
                        <Label size='h5' text={`Bienvenue ${name}`} />
                    </div>
                </CardBody>
            </Card>

            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <Searchbar
                icon={<Search size={18} />}
                iconPosition="right"
                className='search-bar'
            />

            {activeTab === 'home' && (
                <>
                    <Card>
                        <CardHeader>
                            <CardDescription>
                                Gérez les adresses e-mail associées à votre compte AdsCity.
                            </CardDescription>
                        </CardHeader>

                        <Card>
                            <CardBody>
                                <Label size='h6' text={"Adresse e-mail du compte AdsCity"} />
                                <CardDescription>
                                    Adresse non modifiable qui permet d'identifier votre compte AdsCity.
                                </CardDescription>
                            </CardBody>

                            <CardFooter>
                                <Label size='small' text={primaryEmail} />
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardBody>
                                <Label size='h6' text={"Adresse e-mail de récupération"} />
                                <CardDescription>
                                    Adresse à laquelle AdsCity peut vous contacter en cas d'activité inhabituelle sur votre compte ou de problème d'accès.
                                </CardDescription>
                            </CardBody>

                            <CardFooter>
                                {recoveryEmail ? (
                                    <Label size='small' text={recoveryEmail} />
                                ) : (
                                    <Button variant='outline' size='sm'>
                                        Ajouter une e-mail de récupération
                                    </Button>
                                )}

                            </CardFooter>
                        </Card>

                        <Card>
                            <CardBody>
                                <Label size='h6' text={"Adresse e-mail de contact"} />
                                <CardDescription>
                                    Adresse à laquelle vous recevez des informations sur la plupart des produits et services AdsCity que vous utilisez avec ce compte.
                                </CardDescription>
                            </CardBody>

                            <CardFooter>
                                {contactEmail ? (
                                    <Label size='small' text={contactEmail} />
                                ) : (
                                    <Button variant='outline' size='sm'>
                                        Ajouter une e-mail de contact
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </Card>
                </>
            )}

            {activeTab === 'personal-data' && (
                <>
                    <Card>
                        <CardHeader>
                            <Label size='h6' text={"Les informations de votre profil dans les services AdsCity"} />
                            <CardDescription>
                                Voici vos informations personnelles et des options pour les gérer. Vous pouvez permettre aux autres utilisateurs d'en voir certaines (par ex. vos coordonnées pour être facilement joignable). Vous pouvez aussi voir un résumé de votre profil.
                            </CardDescription>
                        </CardHeader>

                        <Card>
                            <CardBody>
                                <Label size='h6' text={"Informations générales"} />
                                <CardDescription>
                                    Certaines de ces informations peuvent être vues par les autres utilisateurs des services AdsCity.
                                </CardDescription>

                                <div style={{ height: '15px' }} />

                                <Card>
                                    <div className="label-value">
                                        <div className="text-block">
                                            <span className="label">Photo de profil</span>
                                            <span className="value">Une photo de profil permet de personnaliser votre compte</span>
                                        </div>
                                        <span className="chevron">
                                            <Avatar
                                                username={name}
                                                size="md"
                                                border
                                                isClickable
                                                onClick={() => console.log('click on avatar')}
                                                source={currentUser.avatar}
                                            />
                                        </span>
                                    </div>
                                </Card>

                                <div style={{ height: '15px' }} />

                                <Card>
                                    <Link to={'/profile/name/firstName'}>
                                        <div className="label-value">
                                            <div className="text-block">
                                                <span className="label">Nom</span>
                                                <span className="value">{currentUser.firstName}</span>
                                            </div>
                                            <span className="chevron">
                                                <ChevronRight size={20} />
                                            </span>
                                        </div>
                                    </Link>
                                </Card>

                                <div style={{ height: '10px' }} />

                                <Card>
                                    <Link to={'/profile/name/lastName'}>
                                        <div className="label-value">
                                            <div className="text-block">
                                                <span className="label">Prénoms</span>
                                                <span className="value">{currentUser.lastName}</span>
                                            </div>
                                            <span className="chevron">
                                                <ChevronRight size={20} />
                                            </span>
                                        </div>
                                    </Link>
                                </Card>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <Label size='h6' text={"Coordonnées"} />

                                {/* <div style={{ height: '15px' }} /> */}

                                <Card>
                                    <div className="label-value">
                                        <div className="text-block">
                                            <span className="label">Adresse-email</span>
                                            <span className="value">{currentUser.email}</span>
                                        </div>
                                        <span className="chevron">
                                            <ChevronRight size={20} />
                                        </span>
                                    </div>
                                </Card>

                                <div style={{ height: '15px' }} />

                                <Card>
                                    <div className="label-value">
                                        <div className="text-block">
                                            <span className="label">Téléphone</span>
                                            <span className="value">{currentUser.phone}</span>
                                        </div>
                                        <span className="chevron">
                                            <ChevronRight size={20} />
                                        </span>
                                    </div>
                                </Card>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <Label size='h6' text={"Autres infos"} />
                                <CardDescription>
                                    Méthodes pour valider votre identité.
                                </CardDescription>
                                <div style={{ height: '15px' }} />
                                <Card>
                                    <CardHeader>
                                        <Label size='p' text={"Mot de passe"} />
                                        <CardDescription>
                                            Un mot de passe sécurisé contribue à protéger votre compte AdsCity
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <div className="label-value">
                                            <div className="text-block">
                                                <span className="label">........</span>
                                                <span className="value">{`Dernière modification: ${formatDate(currentUser.updatedAt)}`}</span>
                                            </div>
                                            <span className="chevron">
                                                <ChevronRight size={20} />
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>

                            </CardBody>
                        </Card>
                    </Card>
                </>
            )}


            <Button
                variant={isEditing ? "outline" : "primary"}
                icon={isEditing ? <X size={16} /> : <UserCog size={16} />}
                onClick={() => setIsEditing(!isEditing)}
            >
                {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>

            {/* Profile information card */}
            <Card>
                <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-header">
                            <div className="avatar-wrapper">
                                <Avatar
                                    username={name}
                                    size="lg"
                                    border
                                    source={currentUser.avatar}
                                />
                                {isEditing && (
                                    <div className="avatar-edit-icon">
                                        <label htmlFor="avatar-upload" className="avatar-upload-label">
                                            <Camera size={14} />
                                            <input
                                                type="file"
                                                id="avatar-upload"
                                                className="hidden-input"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="profile-meta">
                                <p className="meta-text">Membre depuis {formattedDate(currentUser.createdAt)}</p>
                                <p className="meta-text">Dernière mise à jour: {formattedDate(currentUser.updatedAt)}</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="firstName" className="field-label">Prénoms</label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            className="input-wrapper"
                                            type="text"
                                            name="firstName"
                                            placeholder={formData.firstName}
                                            value={formData.firstName}
                                            onChange={(value) => handleInputChange('firstName', value)}
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
                                    </>
                                ) : (
                                    <p className="field-value">{currentUser.firstName}</p>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="lastName" className="field-label">Nom</label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            className="input-wrapper"
                                            type="text"
                                            name="firstName"
                                            placeholder={formData.lastName}
                                            value={formData.lastName}
                                            onChange={(value) => handleInputChange('lastName', value)}
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
                                    </>
                                ) : (
                                    <p className="field-value">{currentUser.lastName}</p>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="email" className="field-label">Adresse e-mail</label>
                                {isEditing ? (
                                    <>
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
                                    </>
                                ) : (
                                    <p className="field-value">{currentUser.email}</p>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="phoneNumber" className="field-label">Numéro de téléphone</label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            className="input-wrapper"
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="Ex: 225 01 23 45 67 89"
                                            value={formData.phoneNumber}
                                            onChange={(value) => handleInputChange('phoneNumber', value)}
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
                                    </>
                                ) : (
                                    <p className="field-value">{currentUser.phone}</p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-footer">
                                <Button type="submit" icon={<Save size={16} />}>
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </form>

                </CardBody>
            </Card>

            {/* Account activity timeline */}
            <Card className='activity-card'>
                <CardHeader>
                    <CardTitle>Activité du Compte</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="activity-timeline">
                        <div className="activity-item">
                            <div className="activity-icon-column">
                                <div className="activity-icon activity-icon--primary">
                                    <UserCog size={20} />
                                </div>
                                <div className="activity-line" />
                            </div>
                            <div className="activity-details">
                                <p className="activity-title">Mise à jour</p>
                                <p className="activity-subtitle">Vous avez mis à jour les informations de votre profile</p>
                                <p className="activity-date">{formattedDate(currentUser.updatedAt)}</p>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon-column">
                                <div className="activity-icon activity-icon--success">
                                    <UserCog size={20} />
                                </div>
                                <div className="activity-line" />
                            </div>
                            <div className="activity-details">
                                <p className="activity-title">Compte crée</p>
                                <p className="activity-subtitle">Bienvenue sur la plateforme !</p>
                                <p className="activity-date">{formattedDate(currentUser.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter>
                    <Button variant="outline" size="sm">
                        Voir le journal d'activité complet
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
