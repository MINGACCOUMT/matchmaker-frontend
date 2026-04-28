"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
    gender: 1,
    birth_date: '',
    city: '',
    bio: '',
    tags: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/discover');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 px-4 mb-10">
        <h1 className="text-2xl font-bold text-center mb-6">创建账号</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input name="email" type="email" placeholder="邮箱" onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
          <input name="password" type="password" placeholder="密码" onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
          <input name="nickname" placeholder="昵称" onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
          <select name="gender" onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none">
            <option value={1}>男</option>
            <option value={0}>女</option>
          </select>
          <input name="birth_date" type="date" placeholder="出生日期" onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
          <input name="city" placeholder="城市" onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
          <textarea name="bio" placeholder="个人介绍" onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none h-20" />
          <input name="tags" placeholder="标签（用逗号分隔，如：旅行,美食,读书）" onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 transition">
            {loading ? '注册中...' : '注册'}
          </button>
          <p className="text-center text-sm text-gray-600">
            已有账号？ <Link href="/login" className="text-pink-600 hover:underline">立即登录</Link>
          </p>
        </form>
      </div>
    </>
  );
}
