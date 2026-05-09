import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, MessageCircle } from 'lucide-react';
import { getConversations } from '@/lib/api';
import BottomNav from '@/components/BottomNav';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Conversation {
  conversation_id: string;
  other_user: {
    id: number;
    nickname?: string;
    avatar_url?: string;
    online?: boolean;
  };
  last_message?: {
    content?: string;
    created_at?: string;
  };
  unread_count?: number;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function avatarUrl(src?: string): string {
  return (
    src ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'
  );
}

/* ------------------------------------------------------------------ */
/*  EmptyState                                                         */
/* ------------------------------------------------------------------ */

function EmptyState() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-96 text-center px-6"
    >
      <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
        <MessageCircle className="w-10 h-10 text-primary-300 dark:text-primary-700" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        还没有消息哦
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[240px]">
        去发现页遇见更多人，开启心动对话吧～
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/discover')}
        className="px-8 py-3 rounded-2xl bg-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/30"
      >
        去发现
      </motion.button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatItem                                                           */
/* ------------------------------------------------------------------ */

function ChatItem({
  conv,
  index,
}: {
  conv: Conversation;
  index: number;
}) {
  const navigate = useNavigate();
  const hasUnread = (conv.unread_count || 0) > 0;

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      whileHover={{ backgroundColor: 'rgba(255, 64, 129, 0.04)' }}
      whileTap={{ backgroundColor: 'rgba(255, 64, 129, 0.08)' }}
      onClick={() => navigate(`/chat/${conv.conversation_id}`)}
      className="flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
    >
      {/* Avatar with online dot */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-primary-400 to-secondary-500">
          <img
            src={avatarUrl(conv.other_user?.avatar_url)}
            alt={conv.other_user?.nickname || '用户'}
            className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-gray-800"
            loading="lazy"
            decoding="async"
          />
        </div>
        {conv.other_user?.online && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-white dark:border-[#0F0F0F]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {conv.other_user?.nickname || '用户'}
          </h3>
          <span
            className={`text-xs flex-shrink-0 ml-2 ${
              hasUnread ? 'text-primary-500 font-medium' : 'text-gray-400'
            }`}
          >
            {formatTime(conv.last_message?.created_at)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p
            className={`text-sm truncate pr-2 ${
              hasUnread
                ? 'text-gray-700 dark:text-gray-300 font-medium'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {conv.last_message?.content || '开始聊天吧~'}
          </p>
          {hasUnread && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
              {conv.unread_count}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ChatList page                                                 */
/* ------------------------------------------------------------------ */

export default function ChatList() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    let active = true;

    const load = async () => {
      try {
        const data = await getConversations();
        if (!active) return;
        const list: Conversation[] = Array.isArray(data)
          ? data
          : data?.conversations || [];
        setConversations(list);
      } catch {
        setConversations([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <motion.div
      className="min-h-[100dvh] bg-[#F8F9FA] dark:bg-[#0F0F0F]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-md min-h-[100dvh] relative">
        {/* Header */}
        <header className="sticky top-0 z-50 h-14 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          <div className="flex h-full items-center justify-between px-4 max-w-md mx-auto">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">消息</h1>
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="搜索"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="通知"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <motion.span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="pb-28">
          {loading ? (
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 animate-pulse"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-[#1A1A1A] rounded-2xl mx-4 mt-4 shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {conversations.map((conv, i) => (
                <ChatItem key={conv.conversation_id} conv={conv} index={i} />
              ))}
            </motion.div>
          )}
        </main>

        <BottomNav />
      </div>
    </motion.div>
  );
}
