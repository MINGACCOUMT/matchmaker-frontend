import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Inbox, MessageCircle } from 'lucide-react';
import { getMatches } from '@/lib/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/Skeleton';
import { pageTransition, listItem } from '@/lib/animations';

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    loadMatches();
  }, [navigate]);

  const loadMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getConvId = (otherId: number) => {
    const myId = JSON.parse(localStorage.getItem('user') || '{}').id || 0;
    return `${Math.min(myId, otherId)}_${Math.max(myId, otherId)}`;
  };

  return (
    <>
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }} className="max-w-md mx-auto py-6 px-4 pb-24">
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">我的匹配</h1>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton variant="circle" width="48px" height="48px" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" height="16px" width="40%" />
                  <Skeleton variant="text" height="12px" width="60%" />
                </div>
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Inbox className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">还没有匹配</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">去发现页面寻找缘分吧</p>
            <Button onClick={() => navigate('/discover')}>去发现</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {matches.map((m: any) => (
              <motion.div
                key={m.id}
                {...listItem}
                onClick={() => navigate(`/chat/${getConvId(m.other_user.id)}`)}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition"
              >
                <Avatar src={m.other_user.avatar_url} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {m.other_user.nickname || '用户'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {m.other_user.last_message || '开始聊天吧~'}
                  </p>
                </div>
                {m.other_user.unread_count > 0 && (
                  <Badge variant="primary">{m.other_user.unread_count}</Badge>
                )}
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      <BottomNav />
    </>
  );
}
