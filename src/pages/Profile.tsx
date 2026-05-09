import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
  Edit3,
  Lock,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Clock,
  User,
  MapPin,
  Zap,
  Heart,
  Users,
  Eye,
} from 'lucide-react';
import { getMe, updateMe } from '@/lib/api';
import BottomNav from '@/components/BottomNav';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProfileData {
  id: number;
  nickname?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  birth_date?: string;
  gender?: number;
  occupation?: string;
  tags?: string;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
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

function deriveAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const year = Number(birthDate.split('-')[0]);
  if (!Number.isFinite(year)) return null;
  return new Date().getFullYear() - year;
}

function parseTags(tags?: string): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* ignore */
  }
  return [];
}

/* ------------------------------------------------------------------ */
/*  StatCard                                                           */
/* ------------------------------------------------------------------ */

function StatCard({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string | number;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(255,64,129,0.15)' }}
      className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] text-center"
    >
      <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  InfoItem                                                           */
/* ------------------------------------------------------------------ */

function InfoItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SettingsItem                                                       */
/* ------------------------------------------------------------------ */

function SettingsItem({
  icon: Icon,
  title,
  desc,
  color,
  danger,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  desc?: string;
  color: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(255, 64, 129, 0.04)' }}
      whileTap={{ backgroundColor: 'rgba(255, 64, 129, 0.08)' }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors ${
        danger ? 'text-error' : ''
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium ${
            danger
              ? 'text-error'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {title}
        </div>
        {desc && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {desc}
          </div>
        )}
      </div>
      <ChevronRight
        className={`w-4 h-4 flex-shrink-0 ${
          danger ? 'text-error/60' : 'text-gray-400'
        }`}
      />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Profile page                                                  */
/* ------------------------------------------------------------------ */

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const data = await getMe();
      const me: ProfileData = data?.id ? data : data?.user ?? data;
      setProfile(me);
      setForm({
        nickname: me.nickname || '',
        bio: me.bio || '',
        city: me.city || '',
        avatar_url: me.avatar_url || '',
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateMe(form);
      setEditing(false);
      loadProfile();
    } catch (err: any) {
      alert(err.message || '保存失败');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#F8F9FA] dark:bg-[#0F0F0F] flex items-center justify-center">
        <div className="animate-pulse w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[100dvh] bg-[#F8F9FA] dark:bg-[#0F0F0F] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">加载失败</p>
      </div>
    );
  }

  const tags = parseTags(profile.tags);
  const age = deriveAge(profile.birth_date);
  const genderText =
    profile.gender === 1 ? '男' : profile.gender === 0 ? '女' : '未知';

  return (
    <motion.div
      className="min-h-[100dvh] bg-[#F8F9FA] dark:bg-[#0F0F0F]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-md min-h-[100dvh] relative pb-28">
        {/* Gradient header */}
        <div className="relative h-48 bg-gradient-to-br from-[#FF4081] to-[#9C27B0] overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute top-10 -left-10 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute bottom-5 right-10 w-16 h-16 rounded-full bg-white/10" />

          {/* Settings button */}
          <button
            onClick={() => setEditing(true)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Profile card */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="px-4 -mt-16 space-y-4"
        >
          {/* Avatar card */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] text-center"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative inline-block -mt-16 mb-3"
            >
              <div className="w-[88px] h-[88px] rounded-full p-[3px] bg-gradient-to-br from-primary-400 to-secondary-500">
                <img
                  src={avatarUrl(profile.avatar_url)}
                  alt={profile.nickname || '用户'}
                  className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-gray-800"
                />
              </div>
            </motion.div>

            {/* Nickname */}
            <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {profile.nickname || '心动用户'}
            </h1>

            {/* ID + VIP */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ID: {profile.id}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary-500 text-white text-[10px] font-bold">
                VIP
              </span>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {profile.bio || '还没有写介绍~'}
            </p>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            variants={cardVariants}
            className="grid grid-cols-3 gap-3"
          >
            <StatCard value={128} label="获赞" icon={Heart} color="text-primary-500" />
            <StatCard value={24} label="匹配" icon={Users} color="text-secondary-500" />
            <StatCard value={56} label="访客" icon={Eye} color="text-amber-500" />
          </motion.div>

          {/* Info card */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="grid grid-cols-2">
              <InfoItem
                icon={Clock}
                label="年龄"
                value={age ? `${age}岁` : '未知'}
                color="bg-primary-50 dark:bg-primary-900/20 text-primary-500"
              />
              <InfoItem
                icon={User}
                label="性别"
                value={genderText}
                color="bg-secondary-50 dark:bg-secondary-900/20 text-secondary-500"
              />
              <InfoItem
                icon={MapPin}
                label="城市"
                value={profile.city || '未知'}
                color="bg-amber-50 dark:bg-amber-900/20 text-amber-500"
              />
              <InfoItem
                icon={Zap}
                label="职业"
                value={profile.occupation || '未知'}
                color="bg-teal-50 dark:bg-teal-900/20 text-teal-500"
              />
            </div>
          </motion.div>

          {/* Interest tags */}
          {tags.length > 0 && (
            <motion.div
              variants={cardVariants}
              className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)]"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                兴趣标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings list */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_2px_12px_rgba(255,64,129,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(255,64,129,0.12),0_1px_4px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <SettingsItem
              icon={Edit3}
              title="编辑资料"
              desc="修改昵称、头像、个人介绍"
              color="bg-primary-50 dark:bg-primary-900/20 text-primary-500"
              onClick={() => setEditing(true)}
            />
            <SettingsItem
              icon={Lock}
              title="隐私设置"
              desc="谁可以看到我的资料"
              color="bg-secondary-50 dark:bg-secondary-900/20 text-secondary-500"
            />
            <SettingsItem
              icon={Bell}
              title="通知设置"
              desc="消息提醒、匹配通知"
              color="bg-amber-50 dark:bg-amber-900/20 text-amber-500"
            />
            <SettingsItem
              icon={HelpCircle}
              title="帮助反馈"
              desc="常见问题、联系客服"
              color="bg-teal-50 dark:bg-teal-900/20 text-teal-500"
            />
            <SettingsItem
              icon={LogOut}
              title="退出登录"
              color="bg-red-50 dark:bg-red-900/20 text-red-500"
              danger
              onClick={logout}
            />
          </motion.div>
        </motion.div>

        <BottomNav />

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center">
                编辑资料
              </h2>
              <div className="space-y-3">
                <input
                  value={form.nickname || ''}
                  onChange={(e) =>
                    setForm({ ...form, nickname: e.target.value })
                  }
                  placeholder="昵称"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30"
                />
                <input
                  value={form.city || ''}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  placeholder="城市"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30"
                />
                <input
                  value={form.avatar_url || ''}
                  onChange={(e) =>
                    setForm({ ...form, avatar_url: e.target.value })
                  }
                  placeholder="头像链接"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30"
                />
                <textarea
                  value={form.bio || ''}
                  onChange={(e) =>
                    setForm({ ...form, bio: e.target.value })
                  }
                  placeholder="个人介绍"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-xl bg-primary-500 text-white font-medium"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
