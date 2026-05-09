interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-secondary-500 text-white',
  outline: 'bg-transparent text-primary-500 border border-primary-500',
  ghost: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  error: 'bg-error text-white',
};

export default function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium
      ${variantStyles[variant]} ${className}
    `}>
      {children}
    </span>
  );
}
