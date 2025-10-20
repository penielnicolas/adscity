import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts principaux
import NotFound from "../pages/public/NotFound";

// Routes principales
import { AppLayout } from "../layouts";

// Pages publiques
import Home from "../pages/public/Home";
import Category from "../pages/public/Category";
import PostDetails from "../pages/public/PostDetails";


export const AppNavigation = () => {
    return (
        <Router>
            <Routes>
                {/* Page publique principale */}
                <Route
                    path="/"
                    element={<AppLayout />}
                >
                    <Route index element={<Home />} />
                    <Route path="/category/:slug" element={<Category />} />
                    <Route path="/category/:slug/:subcategory/:title" element={<PostDetails />} />
                    {/* Autres routes enfants peuvent être ajoutées ici */}
                </Route>

                {/* 404 fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};