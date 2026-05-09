import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, MapPin, LogOut } from 'lucide-react';
import { getMe, updateMe } from '@/lib/api';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Avatar from '@/components/ui/Avatar';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { pageTransition } from '@/lib/animations';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [toast, setToast] = useState({ visible: false, message: '', variant: 'success' as 'success' | 'error' | 'info' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const data = await getMe();
      setProfile(data);
      setForm({
        nickname: data.nickname || '',
        bio: data.bio || '',
        city: data.city || '',
        avatar_url: data.avatar_url || '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await updateMe(form);
      setEditing(false);
      setToast({ visible: true, message: '保存成功', variant: 'success' });
      loadProfile();
    } catch (err: any) {
      setToast({ visible: true, message: err.message, variant: 'error' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </>
    );
  }

  const tags = profile.tags ? JSON.parse(profile.tags) : [];
  const age = profile.birth_date
    ? new Date().getFullYear() - parseInt(profile.birth_date.split('-')[0])
    : null;

  return (
    <>
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }} className="max-w-md mx-auto py-6 px-4 pb-24">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={profile.avatar_url} size="xl" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.nickname || '用户'}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.email}</p>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                {age ? `${age}岁` : ''} {profile.city || ''}
              </div>
            </div>
          </div>

          {editing ? (
            <div className="space-y-3">
              <Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="昵称" />
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="城市" />
              <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="头像链接" />
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none h-20 resize-none" placeholder="个人介绍" />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSave}>保存</Button>
                <Button variant="ghost" className="flex-1" onClick={() => setEditing(false)}>取消</Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio || '还没有写介绍~'}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag: string) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2" onClick={() => setEditing(true)}>
                  <Pencil className="w-4 h-4" />
                  编辑资料
                </Button>
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-error" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                  退出登录
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
      <BottomNav />
      <Toast
        message={toast.message}
        variant={toast.variant}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}
