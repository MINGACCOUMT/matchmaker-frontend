import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Lock,
  Smartphone,
  Eye,
  Bell,
  Heart,
  Moon,
  Type,
  Info,
  HelpCircle,
  Shield,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Toggle switch component                                            */
/* ------------------------------------------------------------------ */

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings page                                                      */
/* ------------------------------------------------------------------ */

export default function Settings() {
  const navigate = useNavigate();

  /* persisted preferences */
  const [privacyVisible, setPrivacyVisible] = useState(() => {
    return localStorage.getItem('privacy_visible') !== 'false';
  });
  const [msgNotify, setMsgNotify] = useState(() => {
    return localStorage.getItem('msg_notify') !== 'false';
  });
  const [matchNotify, setMatchNotify] = useState(() => {
    return localStorage.getItem('match_notify') !== 'false';
  });
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [fontSize, setFontSize] = useState(() => {
    return (localStorage.getItem('font_size') as 'small' | 'medium' | 'large') || 'medium';
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /* sync dark mode */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark_mode', String(darkMode));
  }, [darkMode]);

  /* sync font size */
  useEffect(() => {
    localStorage.setItem('font_size', fontSize);
  }, [fontSize]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[100dvh] bg-[#F8F9FA] dark:bg-[#0F0F0F] flex flex-col"
    >
      <div className="mx-auto max-w-md w-full min-h-[100dvh] flex flex-col relative">
        {/* Header */}
        <header className="sticky top-0 z-50 h-14 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 flex items-center px-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/profile')}
            className="p-1 -ml-1 text-gray-600 dark:text-gray-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="flex-1 text-center text-base font-semibold text-gray-900 dark:text-white -ml-6">
            设置
          </h1>
        </header>

        {/* Content */}
        <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto pb-24">
          {/* 1. Account settings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35, ease: 'easeOut' as const }}
            className="rounded-2xl bg-white dark:bg-[#1A1A1A] p-4 shadow-sm"
          >
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              账户设置
            </h2>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 py-3 text-left">
                <Lock className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">修改密码</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
              <button className="w-full flex items-center gap-3 py-3 text-left">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">绑定手机</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </motion.div>

          {/* 2. Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35, ease: 'easeOut' as const }}
            className="rounded-2xl bg-white dark:bg-[#1A1A1A] p-4 shadow-sm"
          >
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              隐私设置
            </h2>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-200">资料可见性</span>
              </div>
              <Toggle
                checked={privacyVisible}
                onChange={(v) => {
                  setPrivacyVisible(v);
                  localStorage.setItem('privacy_visible', String(v));
                }}
              />
            </div>
          </motion.div>

          {/* 3. Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' as const }}
            className="rounded-2xl bg-white dark:bg-[#1A1A1A] p-4 shadow-sm"
          >
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              通知设置
            </h2>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">新消息提醒</span>
                </div>
                <Toggle
                  checked={msgNotify}
                  onChange={(v) => {
                    setMsgNotify(v);
                    localStorage.setItem('msg_notify', String(v));
                  }}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">匹配通知</span>
                </div>
                <Toggle
                  checked={matchNotify}
                  onChange={(v) => {
                    setMatchNotify(v);
                    localStorage.setItem('match_notify', String(v));
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* 4. Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35, ease: 'easeOut' as const }}
            className="rounded-2xl bg-white dark:bg-[#1A1A1A] p-4 shadow-sm"
          >
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              外观设置
            </h2>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">深色模式</span>
                </div>
                <Toggle checked={darkMode} onChange={setDarkMode} />
              </div>
              <div className="flex items-center gap-3 py-2">
                <Type className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-200">字体大小</span>
                <div className="flex-1 flex justify-end gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        fontSize === size
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5. About */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' as const }}
            className="rounded-2xl bg-white dark:bg-[#1A1A1A] p-4 shadow-sm"
          >
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              关于
            </h2>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 py-3 text-left">
                <Info className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">关于我们</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
              <button className="w-full flex items-center gap-3 py-3 text-left">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">帮助中心</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
              <button className="w-full flex items-center gap-3 py-3 text-left">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">隐私政策</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
              <div className="flex items-center gap-3 py-3">
                <span className="text-xs text-gray-400">版本号 v1.0.0</span>
              </div>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35, ease: 'easeOut' as const }}
            className="pt-2"
          >
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              退出登录
            </button>
          </motion.div>
        </div>

        {/* Logout confirmation modal */}
        <AnimatePresence>
          {showLogoutModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4"
              onClick={() => setShowLogoutModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-xs shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    确认退出
                  </h3>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  退出后需要重新登录，确定要继续吗？
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 h-11 rounded-xl bg-red-500 text-white font-medium text-sm"
                  >
                    退出登录
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav />
      </div>
    </motion.div>
  );
}
