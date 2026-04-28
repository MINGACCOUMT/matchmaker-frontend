"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-pink-600">
          ❤️ Matchmaker
        </Link>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <Link href="/discover" className="text-gray-700 hover:text-pink-600">发现</Link>
            <Link href="/matches" className="text-gray-700 hover:text-pink-600">匹配</Link>
            <Link href="/chat" className="text-gray-700 hover:text-pink-600">消息</Link>
            <Link href="/profile" className="text-gray-700 hover:text-pink-600">我的</Link>
            <button onClick={logout} className="text-red-500 hover:text-red-700">退出</button>
          </div>
        )}
      </div>
    </nav>
  );
}
