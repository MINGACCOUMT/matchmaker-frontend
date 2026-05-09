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

  return (
    <motion.div
      className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F0F0F]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-md min-h-screen">
        <header className="sticky top-0 z-50 h-14 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          <div className="flex h-full items-center justify-between px-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 p-[2px]">
                  <img
                    src={getAvatar(user || undefined)}
                    alt={displayName}
                    className="h-full w-full rounded-full object-cover bg-white dark:bg-neutral-900"
                  />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-success dark:border-[#1A1A1A]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back</p>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Hi, {displayName}</h1>
              </div>
            </div>
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#1A1A1A] text-gray-700 shadow-sm dark:text-gray-200"
                aria-label="通知"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-error"
                    animate={{ scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }}
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white px-2 py-3 shadow-sm dark:bg-white/5"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-[12px] font-medium text-gray-700 dark:text-gray-200">{action.label}</span>
              </motion.button>
            ))}
          </motion.section>

          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              <SkeletonBlock className="h-28" />
              <SkeletonBlock className="h-28" />
              <SkeletonBlock className="h-28" />
            </div>
          ) : (
            <motion.section variants={itemVariants} className="grid grid-cols-3 gap-3">
              {[
                { label: '今日浏览', value: 128, delta: '+12%', icon: Eye, tone: 'text-sky-500 bg-sky-500/10' },
                { label: '新匹配', value: 24, delta: '+5%', icon: Heart, tone: 'text-pink-500 bg-pink-500/10' },
                { label: '未读消息', value: unreadCount, delta: '+3%', icon: MessageCircle, tone: 'text-orange-500 bg-orange-500/10' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -2, boxShadow: '0 12px 28px rgba(15, 23, 42, 0.10)' }}
                  className="rounded-2xl bg-white p-4 shadow-sm dark:bg-white/5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${stat.tone}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-500">{stat.delta}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.section>
          )}

          <motion.section variants={itemVariants}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">每日推荐</h2>
              <button
                type="button"
                onClick={() => navigate('/discover')}
                className="flex items-center text-sm text-pink-500"
              >
                查看更多
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <SkeletonBlock className="h-[304px] w-[200px] shrink-0" />
                <SkeletonBlock className="h-[304px] w-[200px] shrink-0" />
                <SkeletonBlock className="h-[304px] w-[200px] shrink-0" />
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recommendedUsers.map((recommendedUser) => {
                  const liked = likedIds.includes(recommendedUser.id);
                  const interestTags = (recommendedUser.interests || []).slice(0, 2);
                  const matchScore = recommendedUser.match_score || 92;

                  return (
                    <motion.button
                      key={recommendedUser.id}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      onClick={() => navigate('/discover')}
                      className="w-[200px] shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-sm dark:bg-white/5"
                    >
                      <div className="relative h-[220px]">
                        <img
                          src={getAvatar(recommendedUser)}
                          alt={recommendedUser.nickname || recommendedUser.name || 'User'}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-1 text-xs font-semibold text-pink-500 backdrop-blur">
                          {matchScore}%
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-base font-semibold">
                            {recommendedUser.nickname || recommendedUser.name || 'User'}
                            {recommendedUser.age ? `, ${recommendedUser.age}` : ''}
                          </div>
                          <div className="text-xs text-white/80">{recommendedUser.city || 'Unknown city'}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-3">
                        <div className="flex flex-wrap gap-1.5">
                          {interestTags.map((interest) => (
                            <span
                              key={interest}
                              className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleLike(recommendedUser.id);
                          }}
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${liked ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-500 dark:bg-white/10'}`}
                          aria-label="Like user"
                        >
                          <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
                        </motion.button>
                      </div>
                    </motion.button>
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
                className="flex items-center text-sm text-pink-500"
              >
                查看全部
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <SkeletonBlock className="h-20 w-full" />
            ) : (
              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-white/5">
                <div className="flex -space-x-3">
                  {recentMatchUsers.map((matchUser) => (
                    <div key={matchUser.id} className="relative">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 p-[2px]">
                        <img
                          src={getAvatar(matchUser)}
                          alt={matchUser.nickname || matchUser.name || 'User'}
                          className="h-full w-full rounded-full object-cover bg-white dark:bg-neutral-900"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#0F0F0F]" />
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">3位新匹配</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">现在去打个招呼吧</div>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/matches')}
                  className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white"
                >
                  打招呼
                </motion.button>
              </div>
            )}
          </motion.section>
        </motion.main>

        <BottomNav />
      </div>
    </motion.div>
  );
}
