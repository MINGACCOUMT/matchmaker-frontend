import { X } from 'lucide-react';

interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export default function Tag({ children, onRemove, className = '' }: TagProps) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm
      bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
      ${className}
    `}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-gray-900 dark:hover:text-gray-200">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
