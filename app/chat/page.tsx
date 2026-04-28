"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getConversations } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ChatListPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    loadConversations();
  }, [router]);

  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto py-6 px-4">
        <h1 className="text-xl font-bold mb-4">Messages</h1>
        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading...</p>
        ) : conversations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv: any) => (
              <div
                key={conv.conversation_id}
                onClick={() => router.push(`/chat/${conv.conversation_id}`)}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-xl text-white flex-shrink-0">
                  {conv.other_user.avatar_url ? (
                    <img src={conv.other_user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{conv.other_user.nickname || 'User'}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.last_message ? conv.last_message.content : 'Start chatting~'}
                  </p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {conv.unread_count}
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
