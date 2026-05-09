import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '@/lib/api';
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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', nickname: '', gender: 1, birth_date: '', city: '', bio: '', tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', variant: 'success' as 'success' | 'error' | 'info' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register({
        ...form,
        gender: Number(form.gender),
        tags: form.tags ? JSON.stringify(form.tags.split(',').map((t: string) => t.trim())) : '[]',
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
      setError(err.message);
      setToast({ visible: true, message: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }} className="max-w-md mx-auto mt-10 px-4 pb-20">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">创建账号</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4">
          {error && <p className="text-sm text-error">{error}</p>}
          <Input name="email" type="email" placeholder="邮箱" onChange={handleChange} required />
          <Input name="password" type="password" placeholder="密码" onChange={handleChange} required />
          <Input name="nickname" placeholder="昵称" onChange={handleChange} required />
          <select name="gender" onChange={handleChange}
            className="w-full h-12 px-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none">
            <option value={1}>男</option>
            <option value={0}>女</option>
          </select>
          <Input name="birth_date" type="date" placeholder="出生日期" onChange={handleChange} required />
          <Input name="city" placeholder="城市" onChange={handleChange} />
          <textarea name="bio" placeholder="个人介绍" onChange={handleChange}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none h-20 resize-none" />
          <Input name="tags" placeholder="标签（用逗号分隔，如：旅行,美食,读书）" onChange={handleChange} />
          <Button type="submit" loading={loading} size="lg" className="w-full">
            {loading ? '注册中...' : '注册'}
          </Button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            已有账号？ <Link to="/login" className="text-primary-500 hover:underline">立即登录</Link>
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
