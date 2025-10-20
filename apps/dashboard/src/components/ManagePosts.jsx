import { Outlet } from "react-router-dom";

export default function ManagePosts() {
    return (
        <div style={{ padding: 20 }}>
            <h2>Gestion des annonces</h2>

            <Outlet />
        </div>
    );
};
