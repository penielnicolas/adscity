import { Link } from 'react-router-dom';
import { CardItem } from '../../components/ui/Card';
import Label from '../../components/ui/Label';
import { useAuth } from '../../contexts/AuthContext';
import { navItems } from '../../config';
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

    return (
        <div className="account-dashboard">
            <Label size='h5' text={`${getGreeting()}, ${name} 👋`} className='greeting' />

            <div className="quick-access-container">
                {/* QUICK ACCESS */}
                <CardItem title="Accès Rapide" className="mb-6">
                    <div className="quick-access-items">

                        {navItems().map((item, index) => {
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
