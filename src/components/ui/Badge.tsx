import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'platform' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'xs' | 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded transition-colors whitespace-nowrap';

  const sizeStyles = {
    xs: 'px-1.5 py-0.2 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const variantStyles = {
    primary: 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30',
    platform: 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 font-semibold',
    success: 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30',
    neutral: 'bg-[#111111] text-[#B0B0B0] border border-[#242424]',
    outline: 'bg-transparent text-[#757575] border border-[#242424]',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
