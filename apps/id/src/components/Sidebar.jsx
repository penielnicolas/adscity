import { ExternalLink, X } from 'lucide-react';
import { navItems } from '../config';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './ui/Avatar';
import Label from './ui/Label';
import '../styles/components/Sidebar.scss';

export default function Sidebar({ isOpen, closeSidebar }) {
    const { currentUser } = useAuth();

    const name = `${currentUser?.firstName} ${currentUser?.lastName}`;

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div className="overlay" onClick={closeSidebar} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    {/* LOGO */}
                    <div className="logo-section">
                        <div className="logo">AdsCity</div>
                        <button className="close-button" onClick={closeSidebar}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* NAV ITEMS */}
                    <nav className="nav">
                        {navItems(currentUser?.role).map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                {(item.label === 'Boutique' || item.label === 'Tableau de bord') && (
                                    <ExternalLink className='external-link' size={16} />
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* USER INFO */}
                    <div className="user-infos">
                        <Avatar
                            name={name}
                            size="md"
                            border
                            shadow
                            username={name}
                            source={currentUser?.avatar || null}
                        />
                        <p className="user-name">{name}</p>
                        <Label size='p' maxLength={90} expandable lines={1} truncate text={currentUser?.email} className='user-email' />
                    </div>
                </div>
            </aside>
        </>
    );
};