import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/ui/Loading";
import { postlist } from "../../data/mockData";
import PostCard from "../../components/posts/PostCard";
import PostList from "../../components/posts/PostList";
import { getCategoryBySlug } from "../../services/categories";

export default function Category() {
    const { slug } = useParams();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(null);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getCategoryBySlug(slug);
            if (res.success) {
                setTitle(res.data.category.name)
                setListings(res.listings || []);
                setCategory(res.data);
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    useEffect(() => {
        document.title = title;
    }, [title]);

    console.log(category)

    // Filtrer les posts par catégorie
    const filteredPosts = postlist.filter(postItem =>
        postItem.post.category === category?.name
    );

    if (loading) return <Loading />
    return (
        <div >
            <div style={styles.catImageWrap}>
                <img
                    style={styles.catImage}
                    src={category.image}
                    alt={category.slug}
                    crossOrigin="anonymous"
                />
            </div>
            <div style={styles.bottomHeader}>
                {category.children.map((cat, index) => {
                    const slug = cat.slug;
                    return (
                        <div style={styles.bottomHeaderItem}>
                            <Link
                                key={index}
                                style={styles.bottomHeaderLink}
                                to={`/category/${category.slug}/subcategory/${slug}`}
                            >
                                <img
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        // position: 'relative',
                                        objectFit: 'cover'
                                    }}
                                    src={cat.image}
                                    alt={cat.slug}
                                    crossOrigin="anonymous"
                                />
                                <span> {cat.name} </span>
                            </Link>
                        </div>
                    )
                })}
            </div>

            {filteredPosts.length > 0 ? (
                <PostList>
                    {filteredPosts.map(({ id, post, seller, stats, onAction }) => (
                        <PostCard
                            key={id}
                            post={post}
                            seller={seller}
                            stats={stats}
                            onAction={onAction}
                        />
                    ))}
                </PostList>
            ) : (
                <div className="no-posts-message">
                    <p>Aucune annonce trouvée dans cette catégorie.</p>
                </div>
            )}
        </div >
    );
};

const styles = {
    container: {
        height: '100vh',
        marginTop: '11rem'
    },
    catImageWrap: {
        height: '50vh',
        width: '100%',
        position: 'relative',
    },
    catImage: {
        height: '100%',
        width: '100%',
        objectFit: 'cover'
    },
    bottomHeader: {
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        scrollbarWidth: 'thin',
        justifyContent: 'space-around',
        padding: '5px',
    },
    bottomHeaderItem: {
        margin: '5px',
        fontSize: '15px'
    },
    bottomHeaderLink: {
        display: 'flex',
        padding: '5px',
        alignItems: 'center',
        borderRadius: '18px',
        backgroundColor: '#ffffff',
        textDecoration: 'none',
        color: '#000',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    }
}
