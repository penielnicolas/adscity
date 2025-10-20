import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../components/ui/Loading";
import categoryServices from "../../services/categories";

export default function Subcategory() {
    const { slug } = useParams();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [subcategory, setSubcategory] = useState(null);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await categoryServices.getSubcategoryBySlug(slug);
            if (res.success) {
                setTitle(res.data.name)
                setListings(res.listings);
                setSubcategory(res.data);
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    useEffect(() => {
        document.title = title;
    }, [title]);

    if (loading) return <Loading />

    return (
        <div>Subcategory</div>
    );
};
