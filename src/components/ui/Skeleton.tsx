import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle' | 'card';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  countInt = 1,
  count = 1,
}) => {
  const baseStyles = 'animate-pulse bg-[#161616] border border-[#222222]/40';

  const variantStyles = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-lg',
    circle: 'h-10 w-10 rounded-full',
    card: 'h-48 w-full rounded-xl',
  };

  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        />
      ))}
    </>
  );
};
