import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccountLayout from "../layouts/AccountLayout";
import Dashboard from '../pages/public/Dashboard';
import Profile from '../pages/public/Profile';
import Security from '../pages/public/Security';
import Settings from '../pages/public/Settings';
import Subscriptions from '../pages/public/Subscriptions';
import SecurityCenter from '../pages/public/SecurityCenter';
import HelpCenter from '../pages/public/HelpCenter';
import NotFound from '../pages/public/NotFound';
import Messenger from "../pages/public/Messenger";
import Favorites from "../pages/public/Favorites";
import ProfileName from "../pages/public/ProfileName";

export const AppNavigation = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AccountLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path='profile/name/:field' element={<ProfileName />} />
                    <Route path='favorites' element={<Favorites />} />
                    <Route path='messenger' element={<Messenger />} />
                    <Route path="security" element={<Security />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="payments-and-subscriptions" element={<Subscriptions />} />
                    <Route path="security-center" element={<SecurityCenter />} />
                    <Route path="help" element={<HelpCenter />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
                <Route index element={<div> Account AdsCity </div>} />
            </Routes>
        </Router>
    );
};