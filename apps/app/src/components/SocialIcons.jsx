import { FiFacebook, FiLinkedin, FiInstagram, FiYoutube, FiTwitter } from "react-icons/fi";
import '../styles/components/SocialIcons.scss';

export default function SocialIcons() {
    return (
        <div className="social-icons">
            <a
                href="https://facebook.com/adscity"
                target="_blank"
                rel="noopener noreferrer"
                className="facebook"
            >
                <FiFacebook />
            </a>
            <a
                href="https://instagram.com/adscity"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram"
            >
                <FiInstagram />
            </a>
            <a
                href="https://twitter.com/adscity"
                target="_blank"
                rel="noopener noreferrer"
                className="twitter"
            >
                <FiTwitter />
            </a>
            <a
                href="https://linkedin.com/company/adscity"
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin"
            >
                <FiLinkedin />
            </a>
            <a
                href="https://youtube.com/@adscity"
                target="_blank"
                rel="noopener noreferrer"
                className="youtube"
            >
                <FiYoutube />
            </a>
        </div>
    );
};
