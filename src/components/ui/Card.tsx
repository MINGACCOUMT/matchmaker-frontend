interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`
      bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden
      ${className}
    `}>
      {children}
    </div>
  );
}
