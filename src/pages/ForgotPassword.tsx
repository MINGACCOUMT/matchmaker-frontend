import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, CheckCircle, Heart } from 'lucide-react';
import { forgotPassword } from '@/lib/api';

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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || '发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF4081] to-[#9C27B0] px-4">
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <motion.div animate={pulseRing} className="absolute inset-0 rounded-full bg-white/30" />
            <motion.div
              animate={heartFloat}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl"
            >
              <Heart className="h-10 w-10 fill-primary-500 text-primary-500" />
            </motion.div>
          </div>
          <h1 className="mb-1 text-3xl font-bold text-white">心动</h1>
          <p className="text-sm text-white/80">遇见你的心动瞬间</p>
        </div>

        <div className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:bg-[#1A1A1A]/95">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
          >
            <ChevronLeft className="h-4 w-4" />
            返回登录
          </button>

          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">找回密码</h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            输入邮箱，我们将发送重置链接
          </p>

          {success ? (
            <div className="mt-8 rounded-2xl bg-green-50 px-4 py-8 text-center dark:bg-green-500/10">
              <CheckCircle className="mx-auto h-14 w-14 text-green-500" />
              <p className="mt-4 text-base font-semibold text-green-600 dark:text-green-400">
                重置邮件已发送，请查收
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="邮箱"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(255,64,129,0.15)] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : null}

              <motion.button
                whileHover={{ y: -0.5, boxShadow: '0 8px 24px rgba(255,64,129,0.35)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-primary-500 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? '发送中...' : '发送重置链接'}
              </motion.button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-primary-500 transition-colors hover:text-primary-600"
            >
              返回登录
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
