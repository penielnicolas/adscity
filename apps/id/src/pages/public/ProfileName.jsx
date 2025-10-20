import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronLeft, ChevronRight, PenSquare } from "lucide-react";
import { Card, CardBody, CardDescription, CardFooter, CardTitle } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useState } from "react";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import ActivityIndicator from "../../components/ui/ActivityIndicator";
import '../../styles/public/Profile.scss';
import { updateUserProfile } from "../../services/users";

const BackButton = ({ label, navigate }) => {
    return (
        <div className="back-button">
            <div className="svg-wrap" title="Retour">
                <ChevronLeft size={24} onClick={navigate} />
            </div>
            <p> {label} </p>
        </div>
    )
}

export default function ProfileName() {
    const { field } = useParams(); // récupère "firstName" ou "lastName"
    const { currentUser } = useAuth();
    const value = currentUser?.[field] || "";
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newValue, setNewValue] = useState(value || "");
    const [errors, setErrors] = useState({});

    const sanitizeInput = (str) => {
        if (!str) return "";
        return str
            .replace(/<[^>]*>?/gm, "") // supprime balises HTML
            .replace(/["'`;(){}]/g, "") // supprime chars suspects
            .trim();
    };

    // Choisir dynamiquement le label et la valeur
    const labelMap = {
        firstName: "Nom",
        lastName: "Prénoms"
    };


    const handleChange = (val) => {
        const raw = val;
        const cleaned = sanitizeInput(raw);

        if (raw !== cleaned) {
            setErrors({ input: "Certains caractères ne sont pas autorisés." });
        } else {
            setErrors({});
        }

        setNewValue(cleaned);
    };


    const handleSave = async () => {
        setLoading(true);

        try {
            const res = await updateUserProfile(currentUser.id, field, newValue);
            if (res.success) {
                setIsEditing(false);
                setLoading(false);
            } else {

            }
        } catch (error) {
            setErrors({ submit: error.message })
        }
    };

    return (
        <div className="profile-name">
            <BackButton
                label={labelMap[field]}
                navigate={() => navigate('/profile')}
            />

            <div className="card-wrap">
                <Card>
                    <Card>
                        <div className="label-value">
                            <div className="text-block">
                                <span className="label">{labelMap[field]}</span>
                                <span className="value">{value}</span>
                            </div>
                            <span className="chevron" onClick={() => setIsEditing(true)}>
                                Modifier <ChevronRight size={20} />
                            </span>
                        </div>
                    </Card>

                    <CardBody>
                        <CardTitle>
                            Qui peut voir votre {labelMap[field]}
                        </CardTitle>
                        <CardDescription>
                            Toute personne peut voir cette information lorsqu'elle échange avec vous ou consulte une annonce que vous avez créée sur la plateforme AdsCity.
                        </CardDescription>
                    </CardBody>
                </Card>
            </div>

            {isEditing && (
                <Modal
                    isOpen={isEditing}
                    title={`Modification`}
                    size="small"
                    animation="fade"

                    onClose={() => setIsEditing(false)}
                >
                    <CardBody>
                        <Input
                            type="text"
                            required
                            value={newValue}
                            placeholder={value}
                            icon={<PenSquare size={18} />}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.input && <p className="error">{errors.input}</p>}
                    </CardBody>

                    <div style={{ height: '15px' }} />

                    <CardFooter>
                        <div className="edit-footer">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </Button>

                            <Button
                                size="sm"
                                variant="primary"
                                disabled={loading}
                                onClick={handleSave}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size={24}
                                        type="digital"
                                        color="white"
                                    />
                                ) : "Enregister"}
                            </Button>
                        </div>
                    </CardFooter>

                </Modal>
            )}
        </div>
    );
};
