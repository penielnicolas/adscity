import { useState } from "react";
import { FiMoreHorizontal, FiMapPin } from "react-icons/fi";
import { timeAgo } from "../../utils/timeAgo";
import { Card, CardBody, CardFooter, CardHeader } from "../ui/Card";
import Menu from "../ui/Menu";
import { ExternalLink, Flag, SquarePen, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/components/posts/PostCard.scss";
import { Link, useNavigate } from "react-router-dom";
import { deletePost } from "../../services/posts";

export default function PostCard({ post }) {
    const { currentUser } = useAuth();

    const navigate = useNavigate();

    const [currentImage, setCurrentImage] = useState(0);

    const [openModal, setOpenModal] = useState(false);
    const [openReportModal, setOpenReportModal] = useState(false);

    if (!post) return null;

    const details = post.details || {};
    const location = post.location || {};
    const images = post.images || [];

    const isOwner = currentUser && post.author && currentUser.id === post.author.id;


    const mainImage = images[currentImage]?.url || "/placeholder.jpg";

    const title = details.title || "Annonce sans titre";
    const price = details.price ? `${details.price} €` : "Prix non précisé";

    const authorName = post.author
        ? `${post.author.firstName || ""} ${post.author.lastName || ""}`
        : "Annonceur inconnu";

    const city = location.city || location.region || "Lieu non précisé";

    const options = [
        { label: "Partager", action: "share", icon: <ExternalLink size={20} /> },
        { label: "Signaler", action: "report", icon: <Flag size={20} /> },
        ...(isOwner
            ? [
                { label: "Modifier", action: "edit", icon: <SquarePen size={20} /> },
                { label: "Supprimer", action: "delete", icon: <Trash2 size={20} /> },
            ]
            : []),
    ];

    const reportOptions = [
        { label: "Contenu inapproprié", action: "inappropriate" },
        { label: "Spam ou arnaque", action: "spam" },
        { label: "Annonceur suspect", action: "suspicious" },
        { label: "Autre raison", action: "other" },
    ];

    const handleMenuAction = (action) => {
        switch (action) {
            case "edit":
                setOpenModal(false);
                navigate(`/posts/edit/${post.id}`);
                break;

            case "delete":
                setOpenModal(false);
                handleDelete(post.id);
                break;

            case "report":
                setOpenModal(false);
                setOpenReportModal(true);
                break;

            case "share":
                setOpenModal(false);
                const shareData = {
                    title: details.title,
                    text: details.description,
                    url: `${window.location.origin}/posts/${post.id}`,
                };
                if (navigator.share) {
                    navigator.share(shareData).catch(err =>
                        console.error("Erreur de partage :", err)
                    );
                } else {
                    navigator.clipboard.writeText(shareData.url);
                    alert("Lien copié dans le presse-papiers !");
                }
                break;

            default:
                console.log("Action non reconnue :", action);
        }
    };

    const handleReportMenuAction = (action) => {
        console.log("Report reason:", action);
        setOpenReportModal(false);
        alert("Merci pour votre signalement.");
    };

    const handleDelete = async (postId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
            // Appeler la fonction de suppression ici
            try {
                const res = await deletePost(postId);
                console.log("Post deleted response:", res);
                // Optionnel: rafraîchir la liste des posts ou rediriger l'utilisateur
                window.location.reload();
            } catch (error) {
                console.error("Erreur lors de la suppression du post:", error);
            }
            console.log("Post deleted:", postId);
        }
    };

    return (
        <Card className="post-card">
            <CardHeader className="post-header">
                <div className="author-info">
                    <img
                        src={post.author?.avatar || "/user-placeholder.png"}
                        alt="avatar"
                        className="author-avatar"
                    />
                    <div>
                        <h4 className="author-name">
                            {authorName}

                            {(post.author?.emailVerified || post.author?.phoneVerified) && (
                                <span
                                    className={`verify-badge ${post.author?.emailVerified && post.author?.phoneVerified
                                        ? "verified-both"
                                        : post.author?.emailVerified
                                            ? "verified-email"
                                            : "verified-phone"
                                        }`}
                                    title={
                                        post.author?.emailVerified && post.author?.phoneVerified
                                            ? "Email et téléphone vérifiés"
                                            : post.author?.emailVerified
                                                ? "Email vérifié"
                                                : "Téléphone vérifié"
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="verify-icon"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M20.285 6.709a1 1 0 00-1.414-1.418l-9.192 9.198-4.243-4.244a1 1 0 10-1.414 1.415l5 5a1 1 0 001.414 0l9.849-9.951z"
                                        />
                                    </svg>
                                </span>
                            )}
                        </h4>
                        <p className="post-meta">
                            {city} • {timeAgo(post.createdAt, { locale: "fr" })}
                        </p>
                    </div>
                </div>
                <button
                    className="post-options"
                    onClick={() => {
                        setOpenReportModal(false);
                        setOpenModal(!openModal);
                    }}
                >
                    <FiMoreHorizontal />
                </button>

                <Menu
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    options={options}
                    onAction={handleMenuAction}
                />

                <Menu
                    isOpen={openReportModal}
                    onClose={() => setOpenReportModal(false)}
                    options={reportOptions}
                    onAction={handleReportMenuAction}
                />
            </CardHeader>

            <CardBody>
                <div className="post-image">
                    <Link to={`/category/${post.category}/${post.subcategory}/${title}`}>
                        <img src={mainImage} alt={title} title={title} />
                    </Link>

                    {images.length > 1 && (
                        <div className="image-navigation">
                            <button
                                onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
                            >
                                ‹
                            </button>
                            <span>{currentImage + 1}/{images.length}</span>
                            <button
                                onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </CardBody>

            <CardFooter>
                <div className="post-content">
                    <h3 className="post-title">{title}</h3>
                    <p className="post-price">{price}</p>

                    <div className="post-location">
                        <FiMapPin /> <span>{city}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
