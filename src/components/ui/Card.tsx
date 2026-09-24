import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'elevated' | 'panel' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'base',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl border transition-all duration-200';

  const variantStyles = {
    base: 'bg-[#090909] border-[#222222] text-[#EAEAEA]',
    elevated: 'bg-[#111111] border-[#2A2A2A] text-[#EAEAEA] shadow-xl shadow-black/60',
    panel: 'bg-[#050505] border-[#1C1C1C] text-[#D1D1D1]',
    interactive: 'bg-[#090909] border-[#222222] text-[#EAEAEA] hover:border-[#00FF9C]/50 hover:bg-[#0D0D0D] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/70 cursor-pointer',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-7',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};
