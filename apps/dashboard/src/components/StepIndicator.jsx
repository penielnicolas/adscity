import Label from "./ui/Label";
import '../styles/components/StepIndicator.scss';

export default function StepIndicator({ currentStep, totalSteps, title }) {
    return (
        <div className="step-indicator">
            <div className="step-count">
                Étape {currentStep} sur {totalSteps}
            </div>
            <Label size="h4" text={title} className="step-title" />
        </div>
    );
};
