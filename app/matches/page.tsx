"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMatches } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    loadMatches();
  }, [router]);

  const loadMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getConvId = (otherId: number, matchId: number) => {
    const myId = JSON.parse(localStorage.getItem('user') || '{}').id || 0;
    return `${Math.min(myId, otherId)}_${Math.max(myId, otherId)}`;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto py-6 px-4">
        <h1 className="text-xl font-bold mb-4">My Matches</h1>
        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading...</p>
        ) : matches.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No matches yet, go discover!</p>
            <button onClick={() => router.push('/discover')} className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg">
              Discover
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((m: any) => (
              <div
                key={m.id}
                onClick={() => router.push(`/chat/${getConvId(m.other_user.id, m.id)}`)}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-xl text-white flex-shrink-0">
                  {m.other_user.avatar_url ? (
                    <img src={m.other_user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{m.other_user.nickname || 'User'}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {m.other_user.last_message || 'Start chatting~'}
                  </p>
                </div>
                {m.other_user.unread_count > 0 && (
                  <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {m.other_user.unread_count}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
