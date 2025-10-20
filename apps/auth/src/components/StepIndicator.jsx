import '../styles/components/StepIndicator.scss';

export default function StepIndicator({ step }) {
    return (
        <div className="step-indicator">
            <div className={`step ${step >= 0 ? 'active' : ''} ${step > 0 ? 'completed' : ''}`}>
                1
            </div>
            <div className={`step-line ${step > 0 ? 'completed' : ''}`}></div>
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                2
            </div>
            <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
                3
            </div>
        </div>
    );
};
