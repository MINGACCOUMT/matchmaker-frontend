import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import { login } from '@/lib/api';
import Toast from '@/components/ui/Toast';

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null;
}

function getAuthToken(value: unknown): string | null {
  if (!isRecord(value)) return null;

  const directToken = value.access_token;
  if (typeof directToken === 'string' && directToken) return directToken;

  const nestedData = value.data;
  if (isRecord(nestedData)) {
    const nestedToken = nestedData.access_token ?? nestedData.token;
    if (typeof nestedToken === 'string' && nestedToken) return nestedToken;
  }

  const directAltToken = value.token;
  if (typeof directAltToken === 'string' && directAltToken) return directAltToken;

  return null;
}

function getAuthUser(value: unknown) {
  if (!isRecord(value)) return null;

  if (isRecord(value.user)) return value.user;
  if (isRecord(value.data) && isRecord(value.data.user)) return value.data.user;
  if (isRecord(value.profile)) return value.profile;

  return null;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const heartFloat = {
  y: [0, -8, 0],
  rotate: [0, 3, -3, 0],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
};

const pulseRing = {
  scale: [1, 1.3, 1.3],
  opacity: [0.5, 0, 0],
  transition: { duration: 2, repeat: Infinity, ease: 'easeOut' as const },
};

/* ------------------------------------------------------------------ */
/*  Main Login page                                                    */
/* ------------------------------------------------------------------ */

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    variant: 'success' as 'success' | 'error' | 'info',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      const token = getAuthToken(data);
      const user = getAuthUser(data);

      if (!token) {
        throw new Error('登录成功，但未收到有效 token');
      }

      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }

      setToast({ visible: true, message: '登录成功', variant: 'success' });
      setTimeout(() => navigate('/discover'), 800);
    } catch (err: any) {
      setToast({ visible: true, message: err.message || '登录失败', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#FF4081] to-[#9C27B0] relative overflow-hidden flex items-center justify-center px-4">
      {/* Decorative blur circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="w-full max-w-sm"
      >
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {/* Pulse ring */}
            <motion.div
              animate={pulseRing}
              className="absolute inset-0 rounded-full bg-white/30"
            />
            {/* Logo circle */}
            <motion.div
              animate={heartFloat}
              className="relative w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center"
            >
              <Heart className="w-10 h-10 text-primary-500 fill-primary-500" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">心动</h1>
          <p className="text-white/80 text-sm">遇见你的心动瞬间</p>
        </div>

        {/* Glass card */}
        <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-white/10 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
            欢迎回来
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(255,64,129,0.15)] transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                required
                className="w-full h-12 pl-10 pr-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(255,64,129,0.15)] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                className="text-xs text-primary-500 hover:text-primary-600 font-medium"
              >
                忘记密码？
              </button>
            </div>

            {/* Login button */}
            <motion.button
              whileHover={{ y: -0.5, boxShadow: '0 8px 24px rgba(255,64,129,0.35)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/30 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '登录中...' : '登录'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">或</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            还没有账号？{' '}
            <Link
              to="/register"
              className="text-primary-500 font-semibold hover:text-primary-600"
            >
              立即注册
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Toast */}
      <Toast
        message={toast.message}
        variant={toast.variant}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
