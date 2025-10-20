import {
    Dots,
    Levels,
    Sentry,
    Spinner,
    Squares,
    Digital,
    Bounce,
    Windmill
} from "react-activity";
import '../../styles/components/ui/ActivityIndicator.scss';
import "react-activity/dist/library.css";

const activityTypes = {
    dots: Dots,
    levels: Levels,
    sentry: Sentry,
    spinner: Spinner,
    squares: Squares,
    digital: Digital,
    bounce: Bounce,
    windmill: Windmill
};

// size
// color

export default function ActivityIndicator({
    type = "spinner",
    size = 32,
    color = "#1877f2",
    speed = 1,
    animating = true,
    className = "",
    message = "",
    overlay = false,
    center = false
}) {
    const ActivityComponent = activityTypes[type] || Spinner;

    const indicator = (
        <div className={`activity-indicator ${className} ${center ? 'center' : ''}`}>
            <ActivityComponent
                size={size}
                color={color}
                speed={speed}
                animating={animating}
            />
            {message && (
                <span className="activity-message" style={{ color }}>
                    {message}
                </span>
            )}
        </div>
    );

    if (overlay) {
        return (
            <div className="activity-overlay">
                {indicator}
            </div>
        );
    }

    return indicator;
};
