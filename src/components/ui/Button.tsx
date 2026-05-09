import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'love';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
  outline: 'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
  danger: 'bg-error text-white hover:bg-red-600',
  love: 'bg-love text-white hover:bg-pink-600',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-6 text-base rounded-md',
  lg: 'h-12 px-8 text-base rounded-lg',
  xl: 'h-14 px-10 text-lg rounded-xl',
  icon: 'h-12 w-12 p-0 rounded-full flex items-center justify-center',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={`
        font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          {size !== 'icon' && '加载中...'}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
