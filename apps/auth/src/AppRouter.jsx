import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// layouts
import AuthLayout from './layouts/AuthLayout';

// pages
import Signin from './pages/public/Signin';
import Signup from './pages/public/Signup';
import VerifyIdentity from './pages/public/VerifyIdentity';
import VerifyEmail from './pages/public/VerifyEmail';
import VerifyPhone from './pages/public/VerifyPhone';
import ForgotPassword from './pages/public/ForgotPassword';
// import ResetPassword from './pages/public/ResetPassword';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path='/' element={<Navigate to={'/signin'} />} />
                    <Route path='/signin' element={<Signin />} />
                    <Route path='/create-user' element={<Signup />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-phone" element={<VerifyPhone />} />
                    <Route path="/verify-identity" element={<VerifyIdentity />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    {/* <Route path='/reset-password/:token' element={<ResetPassword />} /> */}
                </Route>
            </Routes>
        </Router>
    );
};
