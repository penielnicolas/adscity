import { CardItem } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { navItems } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import Label from '../../components/ui/Label';
import '../../styles/public/Dashboard.scss';

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'Bonjour';
    if (hour >= 12 && hour < 17) return 'Bon après-midi';
    if (hour >= 17 && hour < 21) return 'Bonsoir';
    return 'Bonne nuit';
};

export default function Dashboard() {
    const { currentUser } = useAuth();

    const name = `${currentUser?.firstName} ${currentUser?.lastName}`;
    const role = currentUser?.role;

    return (
        <div className="account-dashboard">
            <Label size='h5' text={`${getGreeting()}, ${name} 👋`} className='greeting' />

            <div className="quick-access-container">
                {/* QUICK ACCESS */}
                <CardItem title="Accès Rapide" className="mb-6">
                    <div className="quick-access-items">

                        {navItems(role).map((item, index) => {
                            if (item.label === 'Accueil' || item.label === 'Tableau de bord') return null;
                            return (
                                <QuickAccessItem
                                    key={index}
                                    to={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    description={item.description}
                                />
                            );
                        })}
                    </div>
                </CardItem>
            </div>

            {/* ACCOUNT OVERVIEW */}
            {/* <CardItem title="Aperçu du Compte" className="mb-6">
                <div className="account-overview">
                    <div className="user-infos">
                        <Avatar
                            username={name}
                            size="md"
                            border={true}
                            isClickable={false}
                        />
                        <h3>{name} </h3>
                        <p>{currentUser?.email}</p>
                        <p>
                            {isPro && (
                                <Badge variant="pro">
                                    <Store className="h-3.5 w-3.5" /> PRO
                                </Badge>
                            )}
                            {verified && (
                                <Badge variant="success">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Vérifié
                                </Badge>
                            )}

                        </p>
                    </div>

                    <div className="account-status">
                        <div>
                            <span>Etat du Compte</span>
                            <span className="status-active">
                                <span></span>
                                Actif
                            </span>
                        </div>
                        <div>
                            <span>Membre depuis</span>
                            <span>
                                {formatJoinDate(currentUser?.createdAt)}
                            </span>
                        </div>
                        <div>
                            <span>Dernière connexion</span>
                            <span>
                                {timeAgo(currentUser?.lastLogin,  { locale: "fr" })}
                            </span>
                        </div>
                    </div>
                </div>
            </CardItem> */}
        </div>
    );
};



const QuickAccessItem = ({ to, icon, label, description, badge }) => {
    return (
        <Link to={to} className="quick-access-item">
            <div className="quick-access-icon-wrapper">
                <div className="quick-access-icon">
                    {icon}
                </div>
                {badge && (
                    <span className="quick-access-badge">
                        {badge}
                    </span>
                )}
            </div>
            <div className="quick-access-details">
                <span className="quick-access-label">{label}</span>
                <span className='quick-access-description'>
                    {description}
                </span>
            </div>
        </Link>
    );
};