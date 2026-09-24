import React from 'react';

export interface StatusDotProps {
  status?: 'active' | 'success' | 'warning' | 'error' | 'idle';
  ping?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status = 'active',
  ping = true,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  const colorMap = {
    active: 'bg-[#00FF9C]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    idle: 'bg-[#666666]',
  };

  return (
    <span className={`relative inline-flex shrink-0 ${sizeMap[size]} ${className}`}>
      {ping && status !== 'idle' && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colorMap[status]}`}
        />
      )}
      <span className={`relative inline-flex rounded-full ${sizeMap[size]} ${colorMap[status]}`} />
    </span>
  );
};
