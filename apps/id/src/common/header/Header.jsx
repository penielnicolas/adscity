import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Toast from "../../components/ui/Toast";
import Logo from "../../components/ui/Logo";
import { logos } from "../../config";
import Loading from "../../components/ui/Loading";
import '../../styles/common/header/Header.scss';
import Avatar from "../../components/ui/Avatar";

const HOME_URL = process.env.REACT_APP_HOME_URL;

export default function Header({ toggleSidebar }) {
    const { currentUser } = useAuth();
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [isLoading] = useState(false);

    const name = `${currentUser?.firstName} ${currentUser?.lastName}`;
    console.log(currentUser)

    if (isLoading) return <Loading />

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-section">
                    <button className="menu-button" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <div className="logo-title">
                        <Logo
                            src={logos.letterBlueBgWhite}
                            size='md'
                            alt='AdsCity'
                            text='AdsCity'
                            showText={false}
                            onclick={() => window.location.href = HOME_URL}
                        />
                        <h1 className="title">Compte</h1>
                    </div>
                </div>

                <Avatar
                    username={name}
                    size="sm"
                    border={true}
                    isClickable={false}
                />

                {/* <div className="notification-section">
                    <div className="notification-button">
                        <button>
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="notification-count">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div> */}
            </div>
            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ show: false, type: '', message: '' })} />
        </header>

    );
};
