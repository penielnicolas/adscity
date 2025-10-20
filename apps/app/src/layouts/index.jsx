import { Outlet } from "react-router-dom";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";

export const AppLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};