import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Heart, Users, MessageCircle, User, Eye, ChevronRight } from 'lucide-react';
import { getMe, discoverUsers, getMatches, getConversations, likeUser } from '@/lib/api';
import BottomNav from '@/components/BottomNav';

type AppUser = {
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
};

type MatchItem = {
  id: number;
  user?: AppUser;
  other_user?: AppUser;
};

type Conversation = {
  id: string;
  unread_count?: number;
};

type ApiRecord = Record<string, unknown>;

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

const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: 'easeOut' as const },
  },
};

const quickActions = [
  {
    label: '每日推荐',
    path: '/discover',
    icon: Heart,
    gradient: 'from-[#FF6B9D] to-[#FF4081]',
  },
  {
    label: '我的匹配',
    path: '/matches',
    icon: Users,
    gradient: 'from-[#AB47BC] to-[#9C27B0]',
  },
  {
    label: '消息中心',
    path: '/chat',
    icon: MessageCircle,
    gradient: 'from-[#FFB74D] to-[#F97316]',
  },
  {
    label: '完善资料',
    path: '/profile',
    icon: User,
    gradient: 'from-[#4DB6AC] to-[#14B8A6]',
  },
] as const;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : undefined;
}

function getAvatar(user?: AppUser): string {
  return user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';
}

function normalizeUser(input: unknown): AppUser | null {
  if (!isRecord(input) || typeof input.id !== 'number') return null;

  const avatar = asString(input.avatar) || asString(input.avatar_url);
  const nickname = asString(input.nickname);
  const name = asString(input.name);
  const city = asString(input.city);
  const occupation = asString(input.occupation);
  const online = asBoolean(input.online);
  const matchScore = asNumber(input.match_score);
  const age = asNumber(input.age) || deriveAge(input.birth_date);
  const interests = asStringArray(input.interests) || parseTags(input.tags);

  return {
    id: input.id,
    nickname,
    name,
    avatar,
    age,
    city,
    occupation,
    online,
    interests,
    match_score: matchScore,
  };
}

function deriveAge(value: unknown): number | undefined {
  if (typeof value !== 'string') return undefined;
  const year = Number(value.split('-')[0]);
  if (!Number.isFinite(year)) return undefined;
  return new Date().getFullYear() - year;
}

function parseTags(value: unknown): string[] | undefined {
  if (typeof value !== 'string') return undefined;
  try {
    const parsed = JSON.parse(value) as unknown;
    return asStringArray(parsed);
  } catch {
    return undefined;
  }
}

function normalizeUsers(input: unknown): AppUser[] {
  if (Array.isArray(input)) {
    return input.map(normalizeUser).filter((user): user is AppUser => user !== null);
  }

  if (isRecord(input)) {
    const nested = input.users;
    if (Array.isArray(nested)) {
      return nested.map(normalizeUser).filter((user): user is AppUser => user !== null);
    }
  }

  return [];
}

function normalizeMatches(input: unknown): MatchItem[] {
  const source = Array.isArray(input)
    ? input
    : isRecord(input) && Array.isArray(input.matches)
      ? input.matches
      : [];

  return source
    .map((item) => {
      if (!isRecord(item) || typeof item.id !== 'number') return null;
      const user = normalizeUser(item.user);
      const otherUser = normalizeUser(item.other_user);
      const result: MatchItem = { id: item.id };
      if (user) result.user = user;
      if (otherUser) result.other_user = otherUser;
      return result;
    })
    .filter((item): item is MatchItem => item !== null);
}

function normalizeConversations(input: unknown): Conversation[] {
  const source = Array.isArray(input)
    ? input
    : isRecord(input) && Array.isArray(input.conversations)
      ? input.conversations
      : [];

  return source
    .map((item) => {
      if (!isRecord(item)) return null;
      const id = asString(item.id) || asString(item.conversation_id);
      if (!id) return null;
      const result: Conversation = { id };
      const unread = asNumber(item.unread_count);
      if (unread !== undefined) result.unread_count = unread;
      return result;
    })
    .filter((item): item is Conversation => item !== null);
}

function normalizeMe(input: unknown): AppUser | null {
  if (isRecord(input) && isRecord(input.user)) {
    return normalizeUser(input.user);
  }
  return normalizeUser(input);
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10 ${className}`} />;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [recommendedUsers, setRecommendedUsers] = useState<AppUser[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [meResponse, discoverResponse, matchesResponse, conversationsResponse] = await Promise.all([
          getMe(),
          discoverUsers(),
          getMatches(),
          getConversations(),
        ]);

        if (!active) return;

        const nextUser = normalizeMe(meResponse);
        const nextRecommendations = normalizeUsers(discoverResponse).slice(0, 6);
        const nextMatches = normalizeMatches(matchesResponse);
        const nextConversations = normalizeConversations(conversationsResponse);
        const nextUnreadCount = nextConversations.reduce(
          (total, conversation) => total + (conversation.unread_count || 0),
          0,
        );

        setUser(nextUser);
        setRecommendedUsers(nextRecommendations);
        setMatches(nextMatches.slice(0, 3));
        setUnreadCount(nextUnreadCount);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLike = async (userId: number) => {
    if (likedIds.includes(userId)) return;

    setLikedIds((current) => [...current, userId]);

    try {
      await likeUser(userId);
    } catch {
      setLikedIds((current) => current.filter((id) => id !== userId));
    }
  };

  const recentMatchUsers = matches
    .map((match) => match.other_user || match.user)
    .filter((matchUser): matchUser is AppUser => Boolean(matchUser))
    .slice(0, 3);

  const displayName = user?.nickname || user?.name || 'there';
  const matchCount = recentMatchUsers.length;
  const stats = [
    {
      label: '今日浏览',
      value: 128,
      delta: '+12%',
      icon: Eye,
      colorClass: 'text-sky-500',
      ringClass: 'stroke-sky-500',
      trackClass: 'stroke-sky-100 dark:stroke-sky-950/40',
      badgeClass: 'bg-sky-500/12 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
      panelClass: 'from-sky-50/90 via-white to-white dark:from-sky-950/20 dark:via-[#171717] dark:to-[#141414]',
      progress: Math.min(128 / 180, 1),
    },
    {
      label: '新匹配',
      value: 24,
      delta: '+5%',
      icon: Heart,
      colorClass: 'text-primary-500',
      ringClass: 'stroke-primary-500',
      trackClass: 'stroke-pink-100 dark:stroke-fuchsia-950/40',
      badgeClass: 'bg-primary-500/12 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400',
      panelClass: 'from-pink-50/90 via-white to-white dark:from-fuchsia-950/20 dark:via-[#171717] dark:to-[#141414]',
      progress: Math.min(24 / 36, 1),
    },
    {
      label: '未读消息',
      value: unreadCount,
      delta: '+3%',
      icon: MessageCircle,
      colorClass: 'text-orange-500',
      ringClass: 'stroke-orange-500',
      trackClass: 'stroke-orange-100 dark:stroke-orange-950/40',
      badgeClass: 'bg-orange-500/12 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
      panelClass: 'from-orange-50/90 via-white to-white dark:from-orange-950/20 dark:via-[#171717] dark:to-[#141414]',
      progress: Math.min(unreadCount / 12, 1),
    },
  ] as const;

  return (
    <motion.div
      className="min-h-screen bg-[#F7F8FC] text-gray-900 dark:bg-[#0F0F10] dark:text-white"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto min-h-screen max-w-md">
        <header className="sticky top-0 z-50 overflow-hidden border-b border-gray-100/50 bg-white/60 backdrop-blur-xl dark:border-gray-800/50 dark:bg-[#1A1A1A]/60">
          <div
            className="pointer-events-none absolute inset-0 dark:hidden"
            style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,64,129,0.08) 0%, rgba(156,39,176,0.06) 50%, transparent 100%)' }}
          />
          <div
            className="pointer-events-none absolute inset-0 hidden dark:block"
            style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,64,129,0.16) 0%, rgba(156,39,176,0.12) 50%, transparent 100%)' }}
          />
          <div className="relative mx-auto flex h-[76px] max-w-md items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 p-[2px] shadow-[0_10px_24px_rgba(236,72,153,0.28)]">
                  <img
                    src={getAvatar(user || undefined)}
                    alt={displayName}
                    className="h-full w-full rounded-full bg-white object-cover dark:bg-[#101010]"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#1A1A1A]" />
              </div>
              <div>
                <p className="text-[12px] text-gray-500 dark:text-gray-400">Welcome back</p>
                <h1 className="text-[16px] font-bold tracking-[0.01em] text-gray-900 dark:text-white">Hi, {displayName}</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/chat')}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm ring-1 ring-black/5 transition-transform hover:scale-[1.03] dark:bg-[#2A2A2A]/80 dark:text-gray-100 dark:ring-white/5"
              aria-label="通知"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </button>
          </div>
        </header>

        <motion.main
          className="space-y-5 px-4 pb-28 pt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.section variants={itemVariants} className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                type="button"
                whileHover={{ y: -4, scale: 1.08, boxShadow: '0 18px 32px rgba(0,0,0,0.20)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 rounded-[22px] bg-white/70 px-2 py-3 backdrop-blur-sm dark:bg-white/5"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient}`}
                  style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-[12px] font-medium text-gray-700 dark:text-gray-200">{action.label}</span>
              </motion.button>
            ))}
          </motion.section>

          {loading ? (
            <motion.section variants={itemVariants} className="grid grid-cols-3 gap-3">
              <SkeletonBlock className="h-[124px] rounded-[24px]" />
              <SkeletonBlock className="h-[124px] rounded-[24px]" />
              <SkeletonBlock className="h-[124px] rounded-[24px]" />
            </motion.section>
          ) : (
            <motion.section variants={itemVariants} className="grid grid-cols-3 gap-3">
              {stats.map((stat) => {
                const radius = 12;
                const circumference = 2 * Math.PI * radius;
                const dashOffset = circumference * (1 - stat.progress);

                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -3, boxShadow: '0 16px 30px rgba(15, 23, 42, 0.12)' }}
                    className={`overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-br ${stat.panelClass} p-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-white/5`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="relative h-8 w-8 shrink-0">
                        <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                          <circle cx="16" cy="16" r={radius} strokeWidth="4" className={stat.trackClass} />
                          <circle
                            cx="16"
                            cy="16"
                            r={radius}
                            strokeWidth="4"
                            strokeLinecap="round"
                            className={stat.ringClass}
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                          />
                        </svg>
                        <div className={`absolute inset-0 flex items-center justify-center ${stat.colorClass}`}>
                          <stat.icon className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${stat.badgeClass}`}>
                        {stat.delta}
                      </span>
                    </div>
                    <div className="text-[24px] font-bold leading-none text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.section>
          )}

          <motion.section variants={itemVariants}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">每日推荐</h2>
              <button
                type="button"
                onClick={() => navigate('/discover')}
                className="flex items-center text-sm font-medium text-pink-500"
              >
                查看更多
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <SkeletonBlock className="h-[352px] w-[210px] shrink-0 rounded-[28px]" />
                <SkeletonBlock className="h-[352px] w-[210px] shrink-0 rounded-[28px]" />
                <SkeletonBlock className="h-[352px] w-[210px] shrink-0 rounded-[28px]" />
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recommendedUsers.map((recommendedUser) => {
                  const liked = likedIds.includes(recommendedUser.id);
                  const interestTags = (recommendedUser.interests || []).slice(0, 3);
                  const matchScore = recommendedUser.match_score || 92;
                  const profileName = recommendedUser.nickname || recommendedUser.name || 'User';
                  const showVip = !recommendedUser.online && matchScore >= 96;

                  return (
                    <motion.div
                      key={recommendedUser.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="w-[210px] shrink-0 overflow-hidden rounded-[28px] border border-white/70 bg-white/85 text-left shadow-[0_18px_32px_rgba(15,23,42,0.10)] backdrop-blur-sm dark:border-white/5 dark:bg-[#171717]/90"
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate('/discover')}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            navigate('/discover');
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <div className="relative h-[260px] overflow-hidden">
                          <img
                            src={getAvatar(recommendedUser)}
                            alt={profileName}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute left-3 top-3 flex items-center gap-2">
                            {showVip ? (
                              <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                                VIP
                              </span>
                            ) : recommendedUser.online ? (
                              <span className="rounded-full bg-emerald-500/92 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg backdrop-blur-sm">
                                在线
                              </span>
                            ) : null}
                          </div>
                          <div className="absolute right-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-pink-500 shadow-sm backdrop-blur-[8px] dark:bg-[#202020]/92 dark:text-pink-300">
                            {matchScore}% 匹配
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <div className="text-[18px] font-bold leading-tight">
                              {profileName}
                              {recommendedUser.age ? `, ${recommendedUser.age}` : ''}
                            </div>
                            <div className="mt-1 text-xs text-white/80">
                              {[recommendedUser.city, recommendedUser.occupation].filter(Boolean).join(' · ') || '正在等待你发现'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 p-3">
                        <div className="flex min-h-[44px] flex-wrap gap-2">
                          {interestTags.length > 0 ? (
                            interestTags.map((interest) => (
                              <span
                                key={interest}
                                className="rounded-full bg-gray-100/95 px-2.5 py-1 text-[10px] font-medium text-gray-600 dark:bg-white/8 dark:text-gray-300"
                              >
                                {interest}
                              </span>
                            ))
                          ) : (
                            <span className="rounded-full bg-gray-100/95 px-2.5 py-1 text-[10px] font-medium text-gray-500 dark:bg-white/8 dark:text-gray-400">
                              等你来认识
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">心动值持续上升中</div>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleLike(recommendedUser.id);
                            }}
                            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors ${liked ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-500 dark:bg-white/10 dark:text-pink-300'}`}
                            aria-label="Like user"
                          >
                            <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>

          <motion.section variants={itemVariants}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">最近匹配</h2>
              <button
                type="button"
                onClick={() => navigate('/matches')}
                className="flex items-center text-sm font-medium text-pink-500"
              >
                查看全部
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <SkeletonBlock className="h-[132px] w-full rounded-[28px]" />
            ) : (
              <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_32px_rgba(15,23,42,0.10)] backdrop-blur-sm dark:border-white/5 dark:bg-[#171717]/90">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-pink-500/20 via-fuchsia-500/15 to-violet-500/10 blur-sm dark:from-pink-500/15 dark:via-fuchsia-500/15 dark:to-violet-500/10" />
                <div className="relative flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {recentMatchUsers.map((matchUser, index) => {
                      const name = matchUser.nickname || matchUser.name || 'User';

                      return index === 0 ? (
                        <motion.div
                          key={matchUser.id}
                          className="relative"
                          animate={{
                            boxShadow: [
                              '0 0 0 0 rgba(236,72,153,0.00)',
                              '0 0 0 8px rgba(236,72,153,0.12)',
                              '0 0 0 16px rgba(236,72,153,0.00)',
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 p-[2px]">
                            <img
                              src={getAvatar(matchUser)}
                              alt={name}
                              className="h-full w-full rounded-full bg-white object-cover dark:bg-[#101010]"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#171717]" />
                        </motion.div>
                      ) : (
                        <div key={matchUser.id} className="relative">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 p-[2px]">
                            <img
                              src={getAvatar(matchUser)}
                              alt={name}
                              className="h-full w-full rounded-full bg-white object-cover dark:bg-[#101010]"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#171717]" />
                        </div>
                      );
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-pink-500/12 px-2 py-1 text-[10px] font-bold text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
                        NEW
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {matchCount > 0 ? `${matchCount}位新匹配` : '新的缘分已靠近'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">别让缘分溜走</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">现在打个招呼，也许就会有故事开始。</div>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/matches')}
                    className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(236,72,153,0.28)]"
                  >
                    打招呼
                  </motion.button>
                </div>
              </div>
            )}
          </motion.section>
        </motion.main>

        <BottomNav />
      </div>
    </motion.div>
  );
}
