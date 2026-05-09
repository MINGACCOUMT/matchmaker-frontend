import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send } from 'lucide-react';
import { getMessages, sendMessage } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Avatar from '@/components/ui/Avatar';
import { pageTransition } from '@/lib/animations';

export default function ChatDetail() {
  const navigate = useNavigate();
  const { convId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [myId, setMyId] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setMyId(user.id || 0);
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [convId, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await getMessages(convId!);
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
      await sendMessage(convId!, input.trim());
      setInput('');
      loadMessages();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }} className="max-w-md mx-auto flex flex-col h-[calc(100vh-56px)]">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 shadow-sm px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/chat')} className="text-gray-500 dark:text-gray-400">
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <Avatar src={otherUser?.avatar_url} size="sm" />
          <div className="font-semibold text-gray-900 dark:text-gray-100">{otherUser?.nickname || '聊天'}</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-gray-950">
          {loading ? (
            <p className="text-center text-gray-400 dark:text-gray-600">加载中...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-600 py-10">发送第一条消息吧~</p>
          ) : (
            messages.map((msg: any) => {
              const isMe = msg.sender_id === myId;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                    isMe
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-pink-100' : 'text-gray-400 dark:text-gray-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full outline-none focus:ring-2 focus:ring-primary-500/20 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-2.5 bg-primary-500 text-white rounded-full disabled:opacity-50 flex items-center gap-1"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>
    </>
  );
}
