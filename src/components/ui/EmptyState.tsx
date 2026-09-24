import React from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#080808] p-10 text-center ${className}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#242424] bg-[#0E0E0E] text-[#808080]">
        {icon || <Search className="h-5 w-5" />}
      </div>
      <h4 className="font-mono text-sm sm:text-base font-bold text-[#EAEAEA]">{title}</h4>
      <p className="mt-1.5 max-w-sm text-xs text-[#808080] leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
