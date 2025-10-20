import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/public/Dashboard';
import ManagePosts from '../components/ManagePosts';
import Posts from '../components/posts/Posts';
import PostDetail from '../components/posts/PostDetail';
import PostForm from '../components/posts/NewPost';
import PostStats from '../components/posts/PostStats';
import NewPost from '../components/posts/NewPost';

export const AppNavigation = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='/posts' element={<ManagePosts />}>
                        <Route index element={<Posts />} />
                        <Route path=':id/details' element={<PostDetail />} />
                        <Route path='new' element={<NewPost />} />
                        <Route path=':id/edit' element={<PostForm mode="edit" />} />
                        <Route path=':id/stats' element={<PostStats />} />
                    </Route>
                    <Route path="settings" element={<div>Settings</div>} />
                </Route>
            </Routes>
        </Router>
    );
};
