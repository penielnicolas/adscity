import { useEffect, useState } from "react";
import CreatePost from "../../components/posts/CreatePost";
import { useAuth } from "../../contexts/AuthContext";
import PushManager from "../../components/PushManager";
import PostCard from "../../components/posts/PostCard";
import PostList from "../../components/posts/PostList";
import { postlist } from "../../data/mockData";

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        // padding: "10px",
        // height: "100vh",
        // overflowY: "auto",
    },
    separator: { height: "100px" }
};

export default function Home() {
    const { currentUser } = useAuth();
    const [showPush, setShowPush] = useState(false);

    useEffect(() => {
        if (currentUser) {
            console.log("User is logged in:", currentUser);
            setShowPush(true);
        }
    }, [currentUser]);

    return (
        <div >

            {showPush && <PushManager />}
            <h2>Home</h2>
            <CreatePost currentUser={currentUser} />

            <div style={styles.separator} />

            <PostList>
                <PostCard
                    post={{
                        details: {
                            title: "iPhone 14 Pro Max",
                            description: "Excellent état, 256 Go, couleur argent",
                            price: 890
                        },
                        images: [
                            { url: require('../../imgs/post/1.png') },
                            { url: require('../../imgs/post/2.png') }
                        ],
                        category: 'phones-tablets',
                        subcategory: 'smartphones',
                        location: { city: "Paris", region: "Île-de-France" },
                        author: { firstName: "Jean", lastName: "Dupont", avatar: require('../../imgs/post/1.png'), emailVerified: true, phoneVerified: false },
                        createdAt: "2025-10-13T10:00:00Z"
                    }}
                />

                <PostCard
                    post={{
                        details: {
                            title: "iPhone 14 Pro Max",
                            description: "Excellent état, 256 Go, couleur argent",
                            price: 890
                        },
                        images: [
                            { url: require('../../imgs/post/1.png') },
                            { url: require('../../imgs/post/2.png') }
                        ],
                        category: 'phones-tablets',
                        subcategory: 'smartphones',
                        location: { city: "Paris", region: "Île-de-France" },
                        author: { firstName: "Jean", lastName: "Dupont", avatar: require('../../imgs/post/1.png') },
                        createdAt: "2025-10-13T10:00:00Z"
                    }}
                />
            </PostList>

        </div>
    );
};
