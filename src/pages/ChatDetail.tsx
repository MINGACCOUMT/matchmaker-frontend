import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MoreVertical, Image, Send, Check } from 'lucide-react';
import { getMessages, sendMessage, getWsUrl } from '@/lib/api';
import BottomNav from '@/components/BottomNav';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  id: number;
  sender_id: number;
  sender_name?: string;
  sender_avatar?: string;
  content: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const messageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function avatarUrl(src?: string): string {
  return (
    src ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'
  );
}

function formatDivider(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  }
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ------------------------------------------------------------------ */
/*  TimeDivider                                                        */
/* ------------------------------------------------------------------ */

function TimeDivider({ date }: { date: string }) {
  return (
    <div className="flex justify-center my-4">
      <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-400">
        {formatDivider(date)}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MessageBubble                                                      */
/* ------------------------------------------------------------------ */

function MessageBubble({
  msg,
  isMe,
}: {
  msg: Message;
  isMe: boolean;
}) {
  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {/* Other avatar (left) */}
      {!isMe && (
        <img
          src={avatarUrl(msg.sender_avatar)}
          alt={msg.sender_name || '用户'}
          className="w-8 h-8 rounded-full object-cover bg-gray-100 dark:bg-gray-800 flex-shrink-0 self-end mb-1"
          loading="lazy"
          decoding="async"
        />
      )}

      <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-3.5 py-2.5 text-sm ${
            isMe
              ? 'bg-primary-500 text-white rounded-2xl rounded-br-sm shadow-lg shadow-primary-500/20'
              : 'bg-white dark:bg-[#1A1A1A] text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-sm shadow-sm'
          }`}
        >
          <p>{msg.content}</p>
        </div>

        {/* Time + read status */}
        <div
          className={`flex items-center gap-1 mt-1 ${
            isMe ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-[10px] text-gray-400">{formatTime(msg.created_at)}</span>
          {isMe && <Check className="w-3 h-3 text-primary-500" />}
        </div>
      </div>

      {/* My avatar (right) */}
      {isMe && (
        <img
          src={avatarUrl()}
          alt="我"
          className="w-8 h-8 rounded-full object-cover bg-gray-100 dark:bg-gray-800 flex-shrink-0 self-end mb-1"
          loading="lazy"
          decoding="async"
        />
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ChatDetail page                                               */
/* ------------------------------------------------------------------ */

export default function ChatDetail() {
  const navigate = useNavigate();
  const { convId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUser, setOtherUser] = useState<{ nickname?: string; avatar_url?: string; online?: boolean } | null>(null);
  const [myId, setMyId] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setMyId(user.id || 0);
    loadMessages();
    if (!convId) return;
    const ws = new WebSocket(getWsUrl(convId));
    wsRef.current = ws;
    ws.onopen = () => {};
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === 'message') {
        setMessages((prev) => [...prev, parsed]);
      }
      if (parsed.type === 'user_online') {
        setOtherUser((prev) => (prev ? { ...prev, online: true } : prev));
      }
      if (parsed.type === 'user_offline') {
        setOtherUser((prev) => (prev ? { ...prev, online: false } : prev));
      }
    };
    ws.onerror = () => {};
    ws.onclose = () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
      // Auto reconnect: max 3 attempts, 3s interval
      if (reconnectAttemptsRef.current < 3) {
        reconnectAttemptsRef.current++;
        setTimeout(() => {
          if (convId) {
            const newWs = new WebSocket(getWsUrl(convId));
            wsRef.current = newWs;
          }
        }, 3000);
      }
    };
    return () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
      ws.close();
    };
  }, [convId, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!convId) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || input.length === 0) {
      setIsTyping(false);
      return;
    }

    ws.send(JSON.stringify({ type: 'typing', typing: true }));
    setIsTyping(true);

    const timeout = window.setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'typing', typing: false }));
      }
      setIsTyping(false);
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [convId, input]);

  const loadMessages = async () => {
    if (!convId) return;
    try {
      const data = await getMessages(convId);
      const list: Message[] = Array.isArray(data) ? data : data?.messages || [];
      setMessages(list);
      if (list.length > 0) {
        const uid = JSON.parse(localStorage.getItem('user') || '{}').id || 0;
        const firstOther = list.find((m) => m.sender_id !== uid);
        if (firstOther) {
          setOtherUser({
            nickname: firstOther.sender_name,
            avatar_url: firstOther.sender_avatar,
          });
        }
      }
    } catch {
      // silent fail on poll
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !convId) return;
    const text = input.trim();
    setInput('');
    // optimistic
    const optimistic: Message = {
      id: Date.now(),
      sender_id: myId,
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    // Try WebSocket first
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'message', content: text }));
        return;
      } catch {
        // fallback to REST
      }
    }

    // Fallback to REST
    try {
      await sendMessage(convId, text);
      loadMessages();
    } catch (err: any) {
      alert(err.message || '发送失败');
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  };

  // Group messages by date for dividers
  const groupedMessages = messages.reduce<{ date: string; items: Message[] }[]>((acc, msg) => {
    const date = new Date(msg.created_at).toDateString();
    const last = acc[acc.length - 1];
    if (last && last.date === date) {
      last.items.push(msg);
    } else {
      acc.push({ date, items: [msg] });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#F8F9FA] dark:bg-[#0F0F0F] flex flex-col"
    >
      <div className="mx-auto max-w-md w-full min-h-[100dvh] flex flex-col relative"
      >
        {/* Header */}
        <header className="sticky top-0 z-50 h-14 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-3"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/chat')}
              className="p-1 -ml-1 text-gray-600 dark:text-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <img
              src={avatarUrl(otherUser?.avatar_url)}
              alt={otherUser?.nickname || '聊天'}
              className="w-9 h-9 rounded-full object-cover bg-gray-100 dark:bg-gray-800"
            />
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white"
              >
                {otherUser?.nickname || '聊天'}
              </div>
              <div className={`text-xs flex items-center gap-1 ${otherUser?.online !== false ? 'text-success' : 'text-gray-400'}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${otherUser?.online !== false ? 'bg-success' : 'bg-gray-400'}`}
                />
                {otherUser?.online !== false ? '在线' : '离线'}
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        >
          {loading ? (
            <div className="flex items-center justify-center h-32"
            >
              <p className="text-gray-400 dark:text-gray-600"
              >加载中...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-32"
            >
              <p className="text-gray-400 dark:text-gray-600"
              >发送第一条消息吧~</p>
            </div>
          ) : (
            <AnimatePresence>
              {groupedMessages.map((group, gi) => (
                <div key={group.date}
                >
                  <TimeDivider date={group.items[0]?.created_at || group.date} />
                  <div className="space-y-3"
                  >
                    {group.items.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        isMe={msg.sender_id === myId}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-2"
        >
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 disabled:opacity-40 disabled:shadow-none flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
