"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { discoverUsers, likeUser } from '@/lib/api';
import Navbar from '@/components/Navbar';
import UserCard from '@/components/UserCard';

export default function DiscoverPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchAlert, setMatchAlert] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await discoverUsers();
      setUsers(data);
      setCurrent(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (current >= users.length) return;
    try {
      const result = await likeUser(users[current].id);
      if (result.is_match) {
        setMatchAlert(users[current]);
      }
      setCurrent((c) => c + 1);
      if (current + 1 >= users.length) loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSkip = () => {
    setCurrent((c) => c + 1);
    if (current + 1 >= users.length) loadUsers();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading...</p>
        </div>
      </>
    );
  }

  if (users.length === 0 || current >= users.length) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-96 px-4">
          <p className="text-xl text-gray-600 mb-4">No more users for now</p>
          <button onClick={loadUsers} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
            Refresh
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-6 px-4">
        {matchAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setMatchAlert(null)}>
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="text-6xl mb-4">Party Popper</div>
              <h2 className="text-2xl font-bold text-pink-600 mb-2">Its a Match!</h2>
              <p className="text-gray-600 mb-4">You and {matchAlert.nickname} matched</p>
              <div className="flex gap-3">
                <button onClick={() => setMatchAlert(null)} className="flex-1 py-2 bg-gray-200 rounded-lg">Keep Browsing</button>
                <button onClick={() => { setMatchAlert(null); router.push('/matches'); }} className="flex-1 py-2 bg-pink-500 text-white rounded-lg">Chat Now</button>
              </div>
            </div>
          </div>
        )}
        <UserCard user={users[current]} onLike={handleLike} onSkip={handleSkip} />
        <p className="text-center text-gray-400 text-sm mt-4">
          {current + 1} / {users.length}
        </p>
      </div>
    </>
  );
}
