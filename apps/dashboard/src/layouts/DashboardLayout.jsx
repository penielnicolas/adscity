import { Outlet } from 'react-router-dom';
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/layouts/DashboardLayout.scss';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

            <div className="layout-content">
                <Header toggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};