import { useState } from "react";
import { reactionIcons } from "../config";
import "../styles/components/ReactionPicker.scss";

export default function ReactionPickerHover({ onSelect }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("like"); // valeur par défaut

    const reactions = [
        { icon: reactionIcons.like, label: "Like", value: "like" },
        { icon: reactionIcons.love, label: "Love", value: "love" },
        { icon: reactionIcons.smile, label: "Smile", value: "smile" },
        { icon: reactionIcons.haha, label: "Haha", value: "haha" },
        { icon: reactionIcons.sad, label: "Sad", value: "sad" },
        { icon: reactionIcons.angry, label: "Angry", value: "angry" },
    ];

    // récupérer la réaction sélectionnée
    const selectedReaction = reactions.find(r => r.value === selected) || reactions[0];

    const handleReact = () => {
        setOpen(true)
    };

    return (
        <div
            className="reaction-picker"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                className="reaction-picker__trigger"
                onClick={handleReact}
            >
                <img
                    src={selectedReaction.icon}
                    alt={selectedReaction.label}
                    className="reaction-picker__image"
                />
                <span> {selectedReaction.label} </span>
            </button>

            {open && (
                <div className="reaction-picker__modal">
                    {reactions.map((r) => (
                        <button
                            key={r.value}
                            className={`reaction-picker__icon ${selected === r.value ? "active" : ""}`}
                            onClick={() => {
                                setSelected(r.value); // mise à jour
                                onSelect(r.value);    // callback parent
                                setOpen(false);       // fermeture
                            }}
                            title={r.label}
                        >
                            <img
                                src={r.icon}
                                alt={r.label}
                                className="reaction-picker__image"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}