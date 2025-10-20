import { PenLine } from "lucide-react";
import getCreatePostRedirectPath from "../../utils/redirect";
import '../../styles/components/posts/CreatePost.scss';

export default function CreatePost({ currentUser }) {
    const path = getCreatePostRedirectPath(currentUser);

    const handleClick = () => {
        window.location.href = path; // ✅ Redirection
    };

    return (
        <button
            title='Créer une annonce'
            onClick={handleClick}
            className='create-post-button'
        >
            <PenLine size={24} className='icon' />
        </button>
    );
};
