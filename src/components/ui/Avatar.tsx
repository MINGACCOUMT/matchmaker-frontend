import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  online?: boolean;
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

export default function Avatar({ src, alt = '', size = 'md', online, className = '' }: AvatarProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`
        ${sizeMap[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-500
        flex items-center justify-center text-white
      `}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white dark:border-gray-900" />
      )}
    </div>
  );
}
