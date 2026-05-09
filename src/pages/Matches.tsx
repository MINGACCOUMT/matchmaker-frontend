import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Heart, MessageCircle, User, ChevronRight } from 'lucide-react';
import { getMatches } from '@/lib/api';
import BottomNav from '@/components/BottomNav';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MatchUser {
  id: number;
  nickname?: string;
  avatar_url?: string;
  age?: number;
  city?: string;
  online?: boolean;
  match_score?: number;
  last_message?: string;
  matched_at?: string;
}

interface MatchItem {
  id: number;
  other_user?: MatchUser;
  user?: MatchUser;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
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

function formatMatchTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function getConvId(otherId: number): string {
  const myId = JSON.parse(localStorage.getItem('user') || '{}').id || 0;
  return `${Math.min(myId, otherId)}_${Math.max(myId, otherId)}`;
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
        <Heart className="w-10 h-10 text-primary-300 dark:text-primary-700" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        还没有匹配哦
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[240px]">
        去发现页滑动卡片寻找缘分吧～
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
/*  RecentMatchBar                                                     */
/* ------------------------------------------------------------------ */

function RecentMatchBar({ matches }: { matches: MatchItem[] }) {
  const navigate = useNavigate();
  const users = matches
    .map((m) => m.other_user || m.user)
    .filter((u): u is MatchUser => Boolean(u))
    .slice(0, 8);

  if (users.length === 0) return null;

  return (
    <div className="px-4 py-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        最近匹配
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {users.map((user) => (
          <motion.button
            key={user.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/chat/${getConvId(user.id)}`)}
            className="flex flex-col items-center min-w-[72px] gap-1.5"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-primary-400 to-secondary-500">
                <img
                  src={avatarUrl(user.avatar_url)}
                  alt={user.nickname || '用户'}
                  className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-gray-800"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {user.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-white dark:border-[#0F0F0F]" />
              )}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[72px]">
              {user.nickname || '用户'}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MatchCard                                                          */
/* ------------------------------------------------------------------ */

function MatchCard({ match, index }: { match: MatchItem; index: number }) {
  const navigate = useNavigate();
  const user = match.other_user || match.user;
  if (!user) return null;

  const score = user.match_score || 92;
  const scoreColor = score >= 90 ? 'bg-primary-500' : 'bg-secondary-500';

  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(255,64,129,0.12)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] overflow-hidden flex"
    >
      {/* Photo area */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <img
          src={avatarUrl(user.avatar_url)}
          alt={user.nickname || '用户'}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white ${scoreColor}`}
        >
          {score}% 匹配
        </span>
      </div>

      {/* Info area */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {user.nickname || '用户'}
            </h3>
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                user.online ? 'bg-success' : 'bg-gray-400'
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {user.age ? `${user.age}岁` : ''}
            {user.age && user.city ? ' · ' : ''}
            {user.city || ''}
            {(user.age || user.city) && user.matched_at ? ' · ' : ''}
            {formatMatchTime(user.matched_at)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {user.last_message || '开始聊天吧~'}
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/chat/${getConvId(user.id)}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-500 text-white text-xs font-semibold shadow-md shadow-primary-500/20"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            聊天
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/discover`)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium"
          >
            <User className="w-3.5 h-3.5 inline mr-1" />
            资料
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Matches page                                                  */
/* ------------------------------------------------------------------ */

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchItem[]>([]);
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
        const data = await getMatches();
        if (!active) return;
        const list: MatchItem[] = Array.isArray(data)
          ? data
          : data?.matches || [];
        setMatches(list);
      } catch {
        setMatches([]);
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
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              我的匹配
              {matches.length > 0 && (
                <span className="ml-1 text-sm font-normal text-primary-500">
                  ({matches.length})
                </span>
              )}
            </h1>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="筛选"
            >
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="pb-28">
          {loading ? (
            <div className="space-y-4 px-4 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm flex animate-pulse"
                >
                  <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 p-3 space-y-2">
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : matches.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <RecentMatchBar matches={matches} />
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-4 mt-2 space-y-3"
              >
                {matches.map((match, i) => (
                  <MatchCard key={match.id} match={match} index={i} />
                ))}
              </motion.div>
            </>
          )}
        </main>

        <BottomNav />
      </div>
    </motion.div>
  );
}
