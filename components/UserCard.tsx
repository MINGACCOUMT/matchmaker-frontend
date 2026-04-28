"use client";

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

interface Props {
  user: User;
  onLike: () => void;
  onSkip: () => void;
}

export default function UserCard({ user, onLike, onSkip }: Props) {
  const tags = user.tags ? JSON.parse(user.tags) : [];
  const age = user.birth_date
    ? new Date().getFullYear() - parseInt(user.birth_date.split('-')[0])
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
      <div className="h-80 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.nickname} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl">👤</div>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold">
          {user.nickname || '匿名用户'}
          {age && <span className="text-gray-500 font-normal ml-2">{age}岁</span>}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{user.city || '未知城市'}</p>
        <p className="text-gray-700 mt-3 line-clamp-3">{user.bio || '这位用户还没有写介绍~'}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            ❌ 跳过
          </button>
          <button
            onClick={onLike}
            className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
          >
            ❤️ 喜欢
          </button>
        </div>
      </div>
    </div>
  );
}
