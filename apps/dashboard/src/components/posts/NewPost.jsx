import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SelectCategory from "../SelectCategory";
import Details from "../Details";
import ImageUpload from "../ImageUpload";
import Location from "../Location";
import Audience from "../Audience";
import Review from "../Review";
import StepIndicator from "../StepIndicator";
import ProgressBar from "../ProgressBar";
import { useAuth } from "../../contexts/AuthContext";
import Toast from "../ui/Toast";
import Loading from "../ui/Loading";
import LimitReachedModal from "../LimitReachedModal";
import '../../styles/components/posts/NewPost.scss';

const stepMapping = {
    'category-select': 1,
    'details-provider': 2,
    'image-uploader': 3,
    'location-picker': 4,
    'audience-selector': 5,
    'form-review': 6,
};

const reverseStepMapping = {
    1: 'category-select',
    2: 'details-provider',
    3: 'image-uploader',
    4: 'location-picker',
    5: 'audience-selector',
    6: 'form-review',
};

export default function NewPost() {
    const { currentUser } = useAuth();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const stepParam = searchParams.get('step') || 'category-select';
    const [step, setStep] = useState(stepMapping[stepParam] || 1);

    const [hasSucceed, setHasSucceed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);

    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [formData, setFormData] = useState({ category: '', subcategory: '', details: {}, images: [], location: {}, audience: '' })

    // 🔁 si l’URL change, on met à jour step
    useEffect(() => {
        const stepParam = searchParams.get('step');
        if (stepMapping[stepParam]) {
            setStep(stepMapping[stepParam]);
        } else {
            setStep(1); // fallback en cas de step invalide
        }
    }, [searchParams]);

    // Gestion centralisée des étapes
    const steps = [
        { id: 1, title: "Catégorisation", component: SelectCategory, progress: 15 },
        { id: 2, title: "Détails", component: Details, progress: 30 },
        { id: 3, title: "Images", component: ImageUpload, progress: 50 },
        { id: 4, title: "Emplacement", component: Location, progress: 65 },
        { id: 5, title: "Audience", component: Audience, progress: 80 },
        { id: 6, title: "Vérification", component: Review, progress: 100 },
    ];

    // Gère les étapes du formulaire
    const nextStep = (newStep) => {
        const stepKey = reverseStepMapping[newStep] || 'category-select';
        navigate(`/dashboard/posts/new?step=${stepKey}`, { replace: true });
    };

    const prevStep = () => {
        const newStep = Math.max(step - 1, 1);
        const stepKey = reverseStepMapping[newStep];
        navigate(`/dashboard/posts/new?step=${stepKey}`, { replace: true });
    };

    // Gestion centralisée des changements de l'état du formulaire
    const handleChange = () => {
        setFormData(prevData => {
            let newData = { ...prevData };

            return newData;
        });
    };

    const handleSubmit = async (captchaValue) => {

    }

    return (
        <div>
            <ProgressBar progress={steps[step - 1].progress} />
            <StepIndicator
                currentStep={step}
                totalSteps={steps.length}
                title={steps[step - 1].title}
            />

            {steps.map(({ id, component: Component }) => (
                step === id ? (
                    <Component
                        formData={formData}
                        isLoading={isLoading}
                        currentUser={currentUser}
                        onBack={prevStep}
                        onNext={nextStep}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        setFormData={setFormData}
                        hasSucceed={hasSucceed}
                        showLimitModal={showLimitModal}
                    />
                ) : null
            ))}

            <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
            {showLimitModal && (<LimitReachedModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} onUpgrade={() => navigate('/pricing')} />)}
            {isLoading && <Loading />}
        </div>
    );
};
