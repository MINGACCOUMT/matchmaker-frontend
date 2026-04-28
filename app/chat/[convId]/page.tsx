"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMessages, sendMessage } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ChatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const convId = params.convId as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [myId, setMyId] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setMyId(user.id || 0);
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [convId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await getMessages(convId);
      setMessages(data);
      if (data.length > 0) {
        const uid = JSON.parse(localStorage.getItem('user') || '{}').id || 0;
        const firstOther = data.find((m: any) => m.sender_id !== uid);
        if (firstOther) {
          setOtherUser({ nickname: firstOther.sender_name, avatar_url: firstOther.sender_avatar });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await sendMessage(convId, input.trim());
      setInput('');
      loadMessages();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto flex flex-col h-[calc(100vh-60px)]">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/chat')} className="text-gray-500 text-lg">{'<-'}</button>
          <div className="font-semibold">{otherUser?.nickname || 'Chat'}</div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 py-10">Send your first message~</p>
          ) : (
            messages.map((msg: any) => {
              const isMe = msg.sender_id === myId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isMe
                      ? 'bg-pink-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-pink-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="bg-white border-t px-4 py-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-2 bg-pink-500 text-white rounded-full disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
