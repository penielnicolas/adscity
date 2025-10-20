import { useState } from "react";
import Button from "../../components/ui/Button";
import { ArrowLeftIcon, Menu, X } from "lucide-react";
import Logo from "../../components/ui/Logo";
import { logos, navigation } from "../../config";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../../components/ui/Avatar";
import Toast from "../../components/ui/Toast";
import { NavLink } from "react-router-dom";
import '../../styles/common/header/Header.scss';

const HOME_URL = process.env.REACT_APP_HOME_URL;

export default function Header({ onBackToHome, showBackButton = false }) {
    const { currentUser } = useAuth();
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const name = `${currentUser?.firstName} ${currentUser?.lastName}` || "Plateform User";

    return (
        <header className="header">
            <div>
                <div className="header-content">
                    <div className="logo-section">
                        {showBackButton && (
                            <button className="menu-button" onClick={onBackToHome}>
                                <ArrowLeftIcon size={24} />
                            </button>
                        )}
                        <div className="logo-title">
                            <Logo
                                src={logos.letterBlueBgWhite}
                                size='md'
                                alt='AdsCity'
                                text='AdsCity'
                                showText={false}
                                onclick={() => window.location.href = HOME_URL}
                            />
                            <h1 className="title">Help</h1>
                        </div>
                    </div>

                    <nav>
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href}>
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    <Avatar
                        username={name}
                        size="sm"
                        border={true}
                        isClickable={false}
                    />

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="" />
                        ) : (
                            <Menu className="" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="">
                        <nav className="">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className=""
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, type: '', message: '' })} />
        </header>
    );
};
