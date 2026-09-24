import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'terminal';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00FF9C] disabled:opacity-40 disabled:pointer-events-none select-none';

  const sizeStyles = {
    xs: 'px-2 py-1 text-[11px] gap-1.5 h-6',
    sm: 'px-2.5 py-1.5 text-xs gap-1.5 h-8',
    md: 'px-3.5 py-2 text-xs sm:text-sm gap-2 h-9',
    lg: 'px-5 py-2.5 text-sm gap-2.5 h-11',
  };

  const variantStyles = {
    primary: 'bg-[#00FF9C] text-black font-bold hover:bg-[#00E68D] active:bg-[#00CC7D] shadow-sm',
    secondary: 'bg-[#111111] text-[#EAEAEA] border border-[#242424] hover:bg-[#181818] hover:border-[#333333] hover:text-white',
    outline: 'bg-transparent text-[#B0B0B0] border border-[#242424] hover:text-[#EAEAEA] hover:border-[#00FF9C]/40 hover:bg-[#00FF9C]/5',
    ghost: 'bg-transparent text-[#808080] hover:text-[#EAEAEA] hover:bg-[#141414]',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-300',
    terminal: 'bg-[#050505] text-[#00FF9C] border border-[#00FF9C]/40 hover:bg-[#00FF9C]/10 font-bold',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
