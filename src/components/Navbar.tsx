import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-500 font-bold text-xl">
          <Heart className="w-6 h-6 fill-current" />
          <span>Matchmaker</span>
        </Link>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <Link to="/discover" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition">发现</Link>
            <Link to="/matches" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition">匹配</Link>
            <Link to="/chat" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition">消息</Link>
            <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition">我的</Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="text-gray-400 hover:text-error transition"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>
    </nav>
  );
}
