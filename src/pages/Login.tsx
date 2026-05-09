import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Navbar from '@/components/Navbar';
import Toast from '@/components/ui/Toast';
import { pageTransition } from '@/lib/animations';

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

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', variant: 'success' as 'success' | 'error' | 'info' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
      setError(err.message);
      setToast({ visible: true, message: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }} className="max-w-md mx-auto mt-16 px-4 pb-20">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          欢迎回来
        </h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4">
          <Input
            label="邮箱"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱"
            error={error}
            required
          />
          <Input
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            required
          />
          <Button type="submit" loading={loading} size="lg" className="w-full">
            {loading ? '登录中...' : '登录'}
          </Button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            还没有账号？ <Link to="/register" className="text-primary-500 hover:underline">立即注册</Link>
          </p>
        </form>
      </motion.div>
      <Toast
        message={toast.message}
        variant={toast.variant}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}
