import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Loading from "../components/ui/Loading";
import { whoami } from "../services/auth";

// Création du contexte d'authentification
export const AuthContext = createContext();

// Utilisation du contexte pour l'accéder facilement dans les composants
export const useAuth = () => useContext(AuthContext);

// Fournisseur de contexte d'authentification
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [loading, setLoading] = useState(true);

    // Récupération de l'utilisateur (une seule fois au montage)
    const fetchUser = useCallback(async () => {
        try {
            const res = await whoami(); // doit inclure credentials
            if (!res.success) throw new Error("Non authentifié");
            const user = res.user;
            console.log(user)
            setCurrentUser(user);
        } catch (err) {
            console.warn("Pas de session active", err);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    }, []);



    // Online/offline listener
    useEffect(() => {
        const updateOnline = () => {
            setIsOnline(navigator.onLine);
        };
        window.addEventListener("online", updateOnline);
        window.addEventListener("offline", updateOnline);
        return () => {
            window.removeEventListener("online", updateOnline);
            window.removeEventListener("offline", updateOnline);
        };
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);


    if (loading) return <Loading />;

    // Provide values and functions in the context
    const value = {
        currentUser,
        loading,
        isOnline,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}