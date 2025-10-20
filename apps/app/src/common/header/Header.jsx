import { Link } from "react-router-dom";
import { logos } from "../../config";
import Logo from "../../components/ui/Logo";
import Avatar from "../../components/ui/Avatar";
import { Plus } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import getCreatePostRedirectPath from "../../utils/redirect";
import { getCategories } from "../../services/categories";
import '../../styles/header/Header.scss';

const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const ID_URL = process.env.REACT_APP_ID_URL;
const HELP_URL = process.env.REACT_APP_HELP_URL;

const TopHeader = ({ currentUser }) => {
    if (currentUser) return null; // If user is logged in, do not show the top header

    return (
        <div className="top-header">
            <div className="__left">
                <Link to={HELP_URL}><span>Aide</span></Link>
            </div>
            <div className="__right">
                <Link to={`${AUTH_URL}/signin`}><span>Connexion</span></Link>
                <Link to={`${AUTH_URL}/create-user`}><span>Inscription</span></Link>
            </div>
        </div>
    );
};

const MiddleHeader = ({ currentUser }) => {
    const name = `${currentUser?.firstName} ${currentUser?.lastName}`;

    const path = getCreatePostRedirectPath(currentUser);

    const handleClick = () => {
        window.location.href = path; // ✅ Redirection
    };

    const handleGoToProfile = () => {
        if (currentUser) {
            // Redirection directe vers l’espace ID
            window.location.href = ID_URL;
        } else {
            // Redirection vers login avec next encodé
            const NEXT_PARAM = encodeURIComponent(ID_URL);
            window.location.href = `${AUTH_URL}/signin?next=${NEXT_PARAM}`;
        }
    };

    return (
        <div className="middle-header">
            <div className="__left">
                <Logo
                    src={logos.letterBlueBgWhite}
                    size='md'
                    alt='AdsCity'
                    text='AdsCity'
                    showText={false}
                    onclick={() => window.location.href = '/'}
                />
            </div>
            <div className="__middle">
                <SearchBar currentUser={currentUser} />
            </div>
            <div className="__right">
                <Avatar
                    username={name}
                    size="md"
                    border={true}
                    isClickable={true}
                    onClick={handleGoToProfile}
                />

                <button
                    className='create-post-btn'
                    onClick={handleClick}
                >
                    <Plus size={20} className='icon' />
                    <span>Créer une annonce</span>
                </button>
            </div>
        </div>
    );
};

const BottomHeader = () => {
    const [cats, setCats] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { data } = await getCategories();
            setCats(data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };


    return (
        <div className="bottom-header">
            {cats.map((cat, index) => (
                <div key={index} id={cat.id} className="bottom-header-item">
                    <Link to={`/category/${cat.slug}`}>
                        <img
                            src={cat.image}
                            alt={cat.slug}
                            crossOrigin="anonymous"
                        />
                        <span>{cat.name}</span>
                    </Link>
                </div>
            ))}
        </div>
    )
};

export default function Header() {
    const { currentUser } = useAuth();

    return (
        <div className="app-header">
            <div className="content">
                <TopHeader currentUser={currentUser} />
                <MiddleHeader currentUser={currentUser} />
                <BottomHeader />
            </div>
        </div >
    )
}
