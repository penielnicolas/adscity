import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../ui/Loading";
import { getUserPosts } from "../../services/user";
import '../../styles/components/posts/Posts.scss';
import { useNavigate } from "react-router-dom";

export default function Posts() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        try {
            const userId = currentUser.id;
            const { data } = await getUserPosts(userId);
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchPosts();
        }
    }, [currentUser, fetchPosts]);


    if (loading) return <Loading />

    return (
        <div className="posts">
            {/* Head */}
            <div className="head">
                <Label text="Liste des annonces" size="h5" bold />
                <Button
                    icon={<Plus size={24} />}
                    iconPosition="left"
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/posts/new?step=category-select')}
                >
                    <span>Ajouter une annonce</span>
                </Button>
            </div>

            <div>
                {posts.length === 0 ? (
                    <p>Aucune annonce trouvée</p>
                ) : (
                    <ul>
                        {posts.map(post => (
                            <li key={post.id}>{post.title}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
