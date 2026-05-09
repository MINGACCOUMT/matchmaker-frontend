import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  Heart,
  Users,
  MessageCircle,
  User,
  Eye,
  ChevronRight,
} from 'lucide-react';
import {
  getMe,
  discoverUsers,
  getMatches,
  getConversations,
  likeUser,
} from '@/lib/api';
import BottomNav from '@/components/BottomNav';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AppUser {
  id: number;
  nickname?: string;
  name?: string;
  avatar?: string;
  age?: number;
  city?: string;
  occupation?: string;
  online?: boolean;
  interests?: string[];
  match_score?: number;
}

interface MatchItem {
  id: number;
  user?: AppUser;
  other_user?: AppUser;
  created_at?: string;
}

interface Conversation {
  id: string;
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
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

function avatarUrl(src?: string): string {
  return (
    src ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face'
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

function Header({
  user,
  unreadNotifications,
}: {
  user: AppUser | null;
  unreadNotifications: number;
}) {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const nickname = user?.nickname || user?.name || '心动用户';

  return (
    <header className="sticky top-0 z-50 h-14 bg-white/80 backdrop-blur-xl dark:bg-[#1A1A1A]/80 border-b border-gray-100 dark:border-gray-800">
      <div className="mx-auto max-w-md h-full px-4 flex items-center justify-between">
        {/* Left — avatar + greeting */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-primary-400 to-secondary-500">
              <img
                src={avatarUrl(user?.avatar)}
                alt="avatar"
                className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-gray-800"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white dark:border-[#1A1A1A]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {greeting}，{nickname}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              今天也是美好的一天 ✨
            </p>
          </div>
        </div>

        {/* Right — bell */}
        <button
          onClick={() => navigate('/chat')}
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="通知"
        >
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          {unreadNotifications > 0 && (
            <motion.span
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </button>
      </div>
    </header>
  );
}

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: '每日推荐',
      icon: Heart,
      gradient: 'from-[#FF6B9D] to-[#FF4081]',
      path: '/discover',
    },
    {
      label: '我的匹配',
      icon: Users,
      gradient: 'from-[#AB47BC] to-[#9C27B0]',
      path: '/matches',
    },
    {
      label: '消息中心',
      icon: MessageCircle,
      gradient: 'from-[#FFB74D] to-[#F97316]',
      path: '/chat',
    },
    {
      label: '完善资料',
      icon: User,
      gradient: 'from-[#4DB6AC] to-[#14B8A6]',
      path: '/profile',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-4 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {actions.map((a) => (
        <motion.button
          key={a.label}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(a.path)}
          className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] transition-shadow"
        >
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white`}
          >
            <a.icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {a.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

function StatCards({ unreadCount }: { unreadCount: number }) {
  const stats = [
    {
      label: '今日浏览',
      value: 128,
      badge: '+12%',
      icon: Eye,
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
    },
    {
      label: '新匹配',
      value: 24,
      badge: '+5%',
      icon: Heart,
      iconBg: 'bg-primary-50 dark:bg-primary-900/20',
      iconColor: 'text-primary-500',
    },
    {
      label: '未读消息',
      value: unreadCount,
      badge: '+3%',
      icon: MessageCircle,
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-3 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={itemVariants}
          whileHover={{
            y: -2,
            boxShadow:
              '0 4px 20px rgba(255,64,129,0.15), 0 2px 8px rgba(0,0,0,0.06)',
          }}
          className="relative p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] transition-shadow cursor-default"
        >
          <div className="flex items-start justify-between mb-2">
            <div
              className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}
            >
              <s.icon className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <span className="text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded">
              {s.badge}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
            {s.value}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {s.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function DailyRecommend({
  users,
  loading,
}: {
  users: AppUser[];
  loading: boolean;
}) {
  const navigate = useNavigate();
  const [likedSet, setLikedSet] = useState<Set<number>>(new Set());

  const handleLike = async (id: number) => {
    if (likedSet.has(id)) return;
    setLikedSet((prev) => new Set(prev).add(id));
    try {
      await likeUser(id);
    } catch {
      // revert on failure
      setLikedSet((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <SkeletonPulse className="h-5 w-24" />
          <SkeletonPulse className="h-4 w-16" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <SkeletonPulse key={i} className="w-[200px] h-[280px] flex-shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title row */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          每日推荐
        </h2>
        <button
          onClick={() => navigate('/discover')}
          className="flex items-center gap-0.5 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          查看更多
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {users.map((u) => {
          const matchScore = u.match_score ?? Math.floor(85 + Math.random() * 14);
          const isLiked = likedSet.has(u.id);
          return (
            <motion.div
              key={u.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="relative w-[200px] flex-shrink-0 snap-start rounded-2xl overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] cursor-pointer"
              onClick={() => navigate(`/discover`)}
            >
              {/* Image */}
              <div className="relative h-[220px]">
                <img
                  src={avatarUrl(u.avatar)}
                  alt={u.nickname || '用户'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Match badge */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-bold text-primary-500">
                  {matchScore}%匹配
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm font-bold text-white">
                      {u.nickname || '用户'}
                    </span>
                    {u.online && (
                      <span className="w-2 h-2 bg-success rounded-full" />
                    )}
                  </div>
                  <div className="text-xs text-white/80">
                    {u.age ? `${u.age}岁 · ` : ''}
                    {u.occupation || '未知职业'}
                    {u.city ? ` · ${u.city}` : ''}
                  </div>
                </div>
              </div>

              {/* Bottom row: tags + like */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {(u.interests || ['旅行', '美食']).slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(u.id);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isLiked
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-primary-500'
                  }`}
                  aria-label="喜欢"
                >
                  <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function RecentMatches({
  matches,
  loading,
}: {
  matches: MatchItem[];
  loading: boolean;
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <SkeletonPulse className="h-5 w-24" />
          <SkeletonPulse className="h-4 w-16" />
        </div>
        <SkeletonPulse className="h-20 w-full" />
      </section>
    );
  }

  const recent = matches.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title row */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          最近匹配
        </h2>
        <button
          onClick={() => navigate('/matches')}
          className="flex items-center gap-0.5 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          查看全部
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)]"
      >
        {/* Overlapping avatars */}
        <div className="flex -space-x-3">
          {recent.map((m) => {
            const u = m.user || m.other_user;
            return (
              <div key={m.id} className="relative">
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-primary-400 to-secondary-500">
                  <img
                    src={avatarUrl(u?.avatar)}
                    alt={u?.nickname || '用户'}
                    className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-gray-800"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1A1A1A] ${
                    u?.online ? 'bg-success' : 'bg-gray-400'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {recent.length}位新匹配
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            打个招呼吧，缘分从这里开始
          </p>
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/matches')}
          className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors shadow-md whitespace-nowrap"
        >
          打招呼
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard page                                                */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AppUser | null>(null);
  const [recommendUsers, setRecommendUsers] = useState<AppUser[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [meData, discoverData, matchData, convData] = await Promise.all([
          getMe(),
          discoverUsers(),
          getMatches(),
          getConversations(),
        ]);

        if (cancelled) return;

        // getMe may return the user object directly or wrapped
        const me: AppUser = meData?.id ? meData : meData?.user ?? meData;
        setUser(me);

        // discoverUsers may return array directly or wrapped
        const discovered: AppUser[] = Array.isArray(discoverData)
          ? discoverData
          : discoverData?.users || [];
        setRecommendUsers(discovered.slice(0, 3));

        // getMatches may return array or wrapped
        const matchList: MatchItem[] = Array.isArray(matchData)
          ? matchData
          : matchData?.matches || [];
        setMatches(matchList.slice(0, 3));

        // unread count from conversations
        const convs: Conversation[] = Array.isArray(convData)
          ? convData
          : convData?.conversations || [];
        const unread = convs.reduce(
          (sum, c) => sum + (c.unread_count || 0),
          0
        );
        setUnreadCount(unread);
      } catch {
        // On error, still show page with fallback data
        setRecommendUsers([]);
        setMatches([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Check auth — if no token, redirect to home
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    load();

    return () => {
      cancelled = true;
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
        <Header user={user} unreadNotifications={unreadCount} />

        {/* Content */}
        <main className="px-4 pt-4 pb-28 space-y-5">
          {/* Quick Actions */}
          <QuickActions />

          {/* Stat Cards */}
          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <SkeletonPulse key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : (
            <StatCards unreadCount={unreadCount} />
          )}

          {/* Daily Recommend */}
          <DailyRecommend users={recommendUsers} loading={loading} />

          {/* Recent Matches */}
          <RecentMatches matches={matches} loading={loading} />
        </main>

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </motion.div>
  );
}
