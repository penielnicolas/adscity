import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bankServices from '../../services/banks';
import SocialIcons from '../../components/SocialIcons';
import '../../styles/footer/Footer.scss';

const HELP_URL = process.env.REACT_APP_HELP_URL || "http://localhost:3004"

const logo = require('../../assets/icons/white-no-bg.png');

export default function Footer() {
    const [bankLogos, setBankLogos] = useState([]);

    const currentYear = new Date().getFullYear();
    const startingYear = 2024;
    const displayYear = currentYear === startingYear ? `${currentYear}` : `${startingYear} - ${currentYear}`;

    useEffect(() => {
        const fetchBankLogos = async () => {
            try {
                const res = await bankServices.getBankLogos();
                setBankLogos(res.data);
            } catch (err) {
                console.error("Erreur récupération logos:", err);
            }
        };
        fetchBankLogos();
    }, []);

    return (
        <footer className="ads-footer">
            <div className="footer-columns">
                <div className="footer-section">
                    <h4>Société</h4>
                    <ul>
                        <li><Link to="/about">Notre mission</Link></li>
                        <li><Link to="/about/team">Équipe & partenaires</Link></li>
                        <li><Link to="/advertise">Publicité sur AdsCity</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Pour les Vendeurs</h4>
                    <ul>
                        <li><Link to="/tips">Astuces de vente</Link></li>
                        <li><Link to="/stores/create">Créer une boutique</Link></li>
                        <li><Link to="/boost">Booster une annonce</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Communauté</h4>
                    <ul>
                        <li><Link to="/ambassadors">Ambassadeurs AdsCity</Link></li>
                        <li><Link to="/referral">Programme de parrainage</Link></li>
                        <li><Link to="/stories">Témoignages utilisateurs</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Aide & Support</h4>
                    <ul>
                        <li><Link to={HELP_URL}>Centre d’aide / FAQ</Link></li>
                        <li><Link to="/security">Centre de sécurité</Link></li>
                        <li><Link to="/contact">Assistance & contact</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Légal</h4>
                    <ul>
                        <li><Link to="/terms">Conditions d'utilisation</Link></li>
                        <li><Link to="/privacy">Politique de confidentialité</Link></li>
                        <li><Link to="/cookies">Politique sur les cookies</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-branding">
                <a href="/">
                    <img src={logo} className="footer-logo" alt="AdsCity logo" />
                </a>
                <p>
                    Publiez, Vendez, Échangez.
                </p>

                <SocialIcons />
            </div>

            <div className="footer-bottom">
                <p>© {displayYear} AdsCity Inc. Tous droits réservés.</p>
                <div className="payment-icons">
                    {bankLogos.map((logo, i) => (
                        <img
                            key={i}
                            src={logo}
                            alt={`bank-logo-${i}`}
                            crossOrigin="anonymous"
                        />
                    ))}
                </div>
            </div>
        </footer>
    )
}
