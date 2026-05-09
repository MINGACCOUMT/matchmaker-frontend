import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { matchCelebration } from '@/lib/animations';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

interface MatchModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onChat: () => void;
}

export default function MatchModal({ isOpen, user, onClose, onChat }: MatchModalProps) {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...matchCelebration.overlay}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 dark:bg-black/70"
          onClick={onClose}
        >
          <motion.div
            {...matchCelebration.modal}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-[90%] max-w-sm p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating hearts */}
            <div className="relative h-16 mb-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  {...matchCelebration.floatingHearts}
                  transition={{ ...matchCelebration.floatingHearts.transition, delay: 0.5 + i * 0.3 }}
                  className="absolute left-1/2 top-full"
                  style={{ marginLeft: (i - 1) * 30 }}
                >
                  <Heart className="w-6 h-6 text-primary-500 fill-primary-500" />
                </motion.div>
              ))}
            </div>

            {/* Avatars */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div {...matchCelebration.avatarLeft}>
                <Avatar size="2xl" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 500, damping: 15 }}
              >
                <Heart className="w-10 h-10 text-primary-500 fill-primary-500" />
              </motion.div>
              <motion.div {...matchCelebration.avatarRight}>
                <Avatar src={user.avatar_url} size="2xl" />
              </motion.div>
            </div>

            {/* Title */}
            <motion.h2
              {...matchCelebration.title}
              className="text-2xl font-bold text-primary-500 mb-2"
            >
              匹配成功！
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-400 mb-6"
            >
              你和 {user.nickname} 互相喜欢了对方
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3"
            >
              <Button variant="ghost" className="flex-1" onClick={onClose}>
                继续浏览
              </Button>
              <Button className="flex-1" onClick={onChat}>
                去聊天
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
