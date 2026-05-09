import { NavLink } from 'react-router-dom';
import { Home, Compass, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/discover', label: '发现', icon: Compass },
  { path: '/chat', label: '消息', icon: MessageCircle },
  { path: '/profile', label: '我的', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-4xl mx-auto h-full flex items-center justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-colors
              ${isActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}
            `}
          >
            {({ isActive }) => (
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-0.5"
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{tab.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
