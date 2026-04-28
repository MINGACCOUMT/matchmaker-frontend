"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, updateMe } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    loadProfile();
  }, [router]);

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
      loadProfile();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading...</p>
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
      <div className="max-w-md mx-auto py-6 px-4">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-3xl text-white">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                'U'
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile.nickname || 'User'}</h1>
              <p className="text-gray-500">{profile.email}</p>
              <p className="text-gray-500">{age ? `${age}yo` : ''} {profile.city || ''}</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-3">
              <input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" placeholder="Nickname" />
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" placeholder="City" />
              <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" placeholder="Avatar URL" />
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg h-20" placeholder="Bio" />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 py-2 bg-pink-500 text-white rounded-lg">Save</button>
                <button onClick={() => setEditing(false)} className="flex-1 py-2 bg-gray-200 rounded-lg">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">{profile.bio || 'No bio yet~'}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">{tag}</span>
                  ))}
                </div>
              )}
              <button onClick={() => setEditing(true)} className="w-full py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
