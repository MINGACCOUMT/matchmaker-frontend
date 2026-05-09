import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, X, Star, MapPin } from 'lucide-react';
import { discoverUsers, likeUser } from '@/lib/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MatchModal from '@/components/MatchModal';
import Skeleton from '@/components/Skeleton';
import Tag from '@/components/ui/Tag';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { pageTransition } from '@/lib/animations';

interface User {
  id: number;
  nickname: string;
  avatar_url?: string;
  gender?: number;
  birth_date?: string;
  city?: string;
  bio?: string;
  tags?: string;
}

export default function Discover() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchAlert, setMatchAlert] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await discoverUsers();
      setUsers(data);
      setCurrent(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (current >= users.length) return;
    try {
      const result = await likeUser(users[current].id);
      if (result.is_match) {
        setMatchAlert(users[current]);
      }
      setCurrent((c) => c + 1);
      if (current + 1 >= users.length) loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSkip = () => {
    setCurrent((c) => c + 1);
    if (current + 1 >= users.length) loadUsers();
  };

  const user = users[current];
  const tags = user?.tags ? JSON.parse(user.tags) : [];
  const age = user?.birth_date
    ? new Date().getFullYear() - parseInt(user.birth_date.split('-')[0])
    : null;

  return (
    <>
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }} className="max-w-md mx-auto py-6 px-4 pb-24">
        <MatchModal
          isOpen={!!matchAlert}
          user={matchAlert}
          onClose={() => setMatchAlert(null)}
          onChat={() => { setMatchAlert(null); navigate('/matches'); }}
        />

        {loading ? (
          <div className="space-y-4">
            <Skeleton variant="rect" height="320px" className="rounded-2xl" />
            <Skeleton variant="text" height="24px" width="60%" />
            <Skeleton variant="text" height="16px" width="40%" />
            <div className="flex gap-2">
              <Skeleton variant="rect" height="32px" width="80px" />
              <Skeleton variant="rect" height="32px" width="80px" />
            </div>
          </div>
        ) : users.length === 0 || current >= users.length ? (
          <div className="flex flex-col items-center justify-center h-96 px-4 text-center">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">没有更多推荐啦</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">稍后再来看看吧</p>
            <Button onClick={loadUsers}>刷新</Button>
          </div>
        ) : (
          <>
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="h-80 bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center relative">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.nickname} className="w-full h-full object-cover" />
                ) : (
                  <Heart className="w-20 h-20 text-white/50" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {user.nickname || '匿名用户'}
                  </h2>
                  {age && <Badge variant="primary">{age}岁</Badge>}
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  {user.city || '未知城市'}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                  {user.bio || '这位用户还没有写介绍~'}
                </p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tags.map((tag: string) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSkip}
                className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-error hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <X className="w-7 h-7" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="w-16 h-16 rounded-full bg-love shadow-lg flex items-center justify-center text-white hover:bg-pink-600 transition"
              >
                <Heart className="w-8 h-8 fill-white" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-warning hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <Star className="w-7 h-7 fill-warning" />
              </motion.button>
            </div>

            <p className="text-center text-gray-400 dark:text-gray-600 text-sm mt-4">
              {current + 1} / {users.length}
            </p>
          </>
        )}
      </motion.div>
      <BottomNav />
    </>
  );
}
