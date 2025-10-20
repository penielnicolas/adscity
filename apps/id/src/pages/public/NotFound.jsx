import { useNavigate } from 'react-router-dom';
import { Icon404 } from '../../config';
import '../../styles/public/NotFound.scss';

export default function NotFound() {
    const navigate = useNavigate();
    
    return (
        <div className='not-found'>
            <img src={Icon404} style={{ width: '100px' }} alt="Page non trouvée" className="error-image" />
            <h1>404</h1>
            <h2>Page Non Trouvée</h2>
            <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
            <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
    );
};
