import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  MapPin,
  Camera,
  Plus,
  Heart,
} from 'lucide-react';
import { register } from '@/lib/api';
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
/*  Predefined interest tags                                           */
/* ------------------------------------------------------------------ */

const PREDEFINED_TAGS = [
  '摄影',
  '旅行',
  '美食',
  '音乐',
  '电影',
  '阅读',
  '运动',
  '游戏',
  '宠物',
  '咖啡',
  '瑜伽',
  '绘画',
];

/* ------------------------------------------------------------------ */
/*  Main Register page                                                 */
/* ------------------------------------------------------------------ */

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
    gender: 1,
    birth_date: '',
    city: '',
    bio: '',
    avatar_url: '',
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    variant: 'success' as 'success' | 'error' | 'info',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register({
        ...form,
        gender: Number(form.gender),
        tags: JSON.stringify(selectedTags),
      });
      const token = getAuthToken(data);
      const user = getAuthUser(data);

      if (!token) {
        throw new Error('注册成功，但未收到有效 token');
      }

      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }

      setToast({ visible: true, message: '注册成功', variant: 'success' });
      setTimeout(() => navigate('/discover'), 800);
    } catch (err: any) {
      setToast({ visible: true, message: err.message || '注册失败', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#FF4081] to-[#9C27B0] relative overflow-hidden">
      {/* Decorative blur circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 h-14">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/login')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Step indicator */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={
                  i === 0
                    ? { scale: 1.2, backgroundColor: '#FF4081' }
                    : { scale: 1, backgroundColor: 'rgba(255,255,255,0.4)' }
                }
                className="w-2.5 h-2.5 rounded-full"
              />
            ))}
          </div>

          <div className="w-10" />
        </div>

        {/* Logo area */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-3">
            <motion.div
              animate={pulseRing}
              className="absolute inset-0 rounded-full bg-white/30"
            />
            <motion.div
              animate={heartFloat}
              className="relative w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center"
            >
              <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-0.5">创建账号</h1>
          <p className="text-white/80 text-sm">填写信息，开启心动之旅</p>
        </div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="flex-1 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-xl rounded-t-3xl border-t border-white/30 dark:border-white/10 p-6 overflow-y-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto pb-8">
            {/* Avatar upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden">
                  {form.avatar_url ? (
                    <img
                      src={form.avatar_url}
                      alt="头像"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                name="avatar_url"
                value={form.avatar_url}
                onChange={handleChange}
                placeholder="头像链接（可选）"
                className="mt-2 w-full max-w-[200px] text-xs text-center bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none text-gray-600 dark:text-gray-400 placeholder-gray-400 py-1"
              />
            </div>

            {/* Basic info group */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                基本信息
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="邮箱"
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(255,64,129,0.15)] transition-all text-sm"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
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

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    placeholder="昵称"
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(255,64,129,0.15)] transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Profile group */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                个人资料
              </h3>
              <div className="space-y-3">
                {/* Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gender: 0 })}
                    className={`h-12 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                      form.gender === 0
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span className="text-lg">👩</span> 女
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gender: 1 })}
                    className={`h-12 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                      form.gender === 1
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span className="text-lg">👨</span> 男
                  </button>
                </div>

                {/* Birth date + City */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="birth_date"
                      value={form.birth_date}
                      onChange={handleChange}
                      className="w-full h-12 pl-10 pr-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(255,64,129,0.15)] transition-all text-sm"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="城市"
                      className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(255,64,129,0.15)] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Bio */}
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="个人介绍（选填）"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(255,64,129,0.15)] transition-all text-sm resize-none"
                />
              </div>
            </div>

            {/* Interest tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                兴趣标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_TAGS.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <motion.button
                      key={tag}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selected
                          ? 'bg-primary-500 text-white border border-primary-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {tag}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Create account button */}
            <motion.button
              whileHover={{ y: -0.5, boxShadow: '0 8px 24px rgba(255,64,129,0.35)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/30 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '创建中...' : '创建账号'}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400">或</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Social register */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
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

            {/* Login link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              已有账号？{' '}
              <Link
                to="/login"
                className="text-primary-500 font-semibold hover:text-primary-600"
              >
                立即登录
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

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
