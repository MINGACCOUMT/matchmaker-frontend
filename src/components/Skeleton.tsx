import { motion } from 'framer-motion';
import { skeletonPulse } from '@/lib/animations';

interface SkeletonProps {
  variant?: 'rect' | 'circle' | 'text';
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({ variant = 'rect', width, height, className = '' }: SkeletonProps) {
  const baseClass = 'bg-gray-200 dark:bg-gray-800 rounded';
  const shapeClass = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded-sm',
  };

  return (
    <motion.div
      {...skeletonPulse}
      className={`${baseClass} ${shapeClass[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}
