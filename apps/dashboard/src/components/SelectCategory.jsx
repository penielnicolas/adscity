import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getCategories } from "../services/categories";
import Select from "./ui/Select";
import { Shapes } from "lucide-react";
import Button from "./ui/Button";
import Toast from "./ui/Toast";
import '../styles/components/SelectCategory.scss';

const ID_URL = process.env.REACT_APP_ID_URL;

const stepMapping = {
    'category-select': 1,
    'details-provider': 2,
    'image-uploader': 3,
    'location-picker': 4,
    'form-review': 5,
};

const reverseStepMapping = {
    1: 'category-select',
    2: 'details-provider',
    3: 'image-uploader',
    4: 'location-picker',
    5: 'form-review',
};

export default function SelectCategory({ formData, setFormData }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const stepParam = searchParams.get('step') || 'category-select';
    const [step, setStep] = useState(stepMapping[stepParam] || 1);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const stepParam = searchParams.get('step');
        const mappedStep = stepMapping[stepParam];

        if (mappedStep) {
            setStep(mappedStep);
        } else {
            navigate('/posts/new?step=category-select', { replace: true });
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            const res = await getCategories();
            if (isMounted && res.success) {
                setCategories(res.data);
            }
        };

        loadData();

        return () => { isMounted = false }; // Nettoyage
    }, []);

    // Mise à jour des sous-catégories quand la catégorie change
    useEffect(() => {
        if (formData.category && categories.length) {
            const selectedCategory = categories.find(cat => cat.slug === formData.category);
            setSubcategories(selectedCategory?.children || []);
        } else {
            setSubcategories([]);
        }
    }, [formData.category, categories]);

    // Gestion des changements de catégorie
    const handleChangeCategory = useCallback((newValue) => {
        console.log("new value", newValue);
        setFormData(prev => ({ ...prev, category: newValue, subcategory: '' }));
    }, [setFormData]);



    // Gestion des changements de sous-catégorie
    const handleChangeSubcategory = useCallback((newSubcategory) => {
        setFormData(prev => ({ ...prev, subcategory: newSubcategory }));
    }, [setFormData]);

    // Gère les étapes du formulaire
    const nextStep = () => {
        const next = step + 1;
        const stepKey = reverseStepMapping[next] || 'category-select';
        navigate(`/posts/new?step=${stepKey}`);
    };

    return (
        <div className='select-cat'>
            <Select
                options={categories.map(cat => ({ value: cat.slug, label: cat.name }))}
                value={formData.category}
                onChange={handleChangeCategory}
                icon={<Shapes size={24} />}
            />

            <div className="separator" />

            {formData.category && subcategories.length > 0 && (
                <Select
                    options={subcategories.map(subcat => ({ value: subcat.slug, label: subcat.name }))}
                    value={formData.subcategory}
                    onChange={handleChangeSubcategory}
                    icon={<Shapes size={24} />}
                    required
                />
            )}

            {/* Contact support */}
            <div className="contact-support">
                <p>Vous ne trouvez pas la catégorie ? <Link to={`${ID_URL}/help`}>Contactez le support</Link></p>
            </div>

            {formData.subcategory && (
                <div className="form-navigation">
                    <Button
                        size="sm"
                        variant="primary"
                        type="button"
                        onClick={nextStep}
                    >
                        Suivant
                    </Button>
                </div>
            )}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
};
