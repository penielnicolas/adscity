import { Search } from 'lucide-react';
import '../../styles/components/ui/Searchbar.scss';

// Avec un placeholder=Rechercher dans le compte AdsCity
export default function Searchbar({
    icon = <Search size={18} />,
    iconPosition = "left", // "left" | "right"
    searchTerm,
    onChange,
    placeholder = "Rechercher dans le compte AdsCity",
    className=''
}) {
    return (
        <div className={`searchbar ${iconPosition} ${className}`}>
            {icon && <span className="searchbar-icon">{icon}</span>}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="searchbar-input"
            />
        </div>
    );
};
