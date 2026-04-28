"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/discover');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-pink-600 mb-4">❤️ Matchmaker</h1>
        <p className="text-xl text-gray-700 mb-8">找到你的缘分，开启幸福旅程</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition shadow-lg"
          >
            立即注册
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-pink-500 border-2 border-pink-500 rounded-full font-semibold hover:bg-pink-50 transition"
          >
            登录
          </Link>
        </div>
      </div>
    </div>
  );
}
