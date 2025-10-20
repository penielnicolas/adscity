import { Phone } from "lucide-react";
import { useState } from "react";
import '../../styles/ui/CustomPhoneInput.scss';


export default function CustomPhoneInput({ value, onChange, error }) {
    const [raw, setRaw] = useState(value ? value.replace("+225", "") : "");

    const formatCINumber = (num) => {
        return num
            .replace(/\D/g, "")      // garder que chiffres
            .slice(0, 10)            // max 10 chiffres
            .replace(/(\d{2})(?=\d)/g, "$1 ") // blocs de 2
            .trim();
    };

    const handleChange = (e) => {
        let digits = e.target.value.replace(/\D/g, "").slice(0, 10);
        setRaw(digits);
        onChange(`+225${digits}`);
    };

    return (
        <div className="custom-phone-input">
            <Phone className="input-icon" />
            <span className="prefix">+225</span>
            <input
                type="text"
                value={formatCINumber(raw)}
                onChange={handleChange}
                placeholder="01 23 45 67 89"
                className={error ? "error" : ""}
            />
            {error && <small className="error-text">{error}</small>}
        </div>
    );
}
