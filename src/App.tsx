import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Discover from '@/pages/Discover';
import Matches from '@/pages/Matches';
import ChatList from '@/pages/ChatList';
import ChatDetail from '@/pages/ChatDetail';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';

function AnimatedRoutes() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Home />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:convId" element={<ChatDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
