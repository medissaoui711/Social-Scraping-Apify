import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 font-sans">
      {label && (
        <div className="flex items-center justify-between text-xs font-mono font-medium text-[#B0B0B0]">
          <label htmlFor={inputId}>{label}</label>
          {hint && <span className="text-[11px] text-[#707070]">{hint}</span>}
        </div>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 rtl:right-3 rtl:left-auto text-[#707070]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border bg-[#050505] px-3 py-2 text-xs sm:text-sm font-mono text-[#EAEAEA] placeholder-[#757575] transition-all duration-150 focus:border-[#00FF9C] focus:outline-none focus:ring-1 focus:ring-[#00FF9C]/30 disabled:opacity-40 min-h-[38px] ${
            leftIcon ? 'pl-9 rtl:pr-9 rtl:pl-3' : ''
          } ${rightElement ? 'pr-9 rtl:pl-9 rtl:pr-3' : ''} ${
            error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30' : 'border-[#242424] hover:border-[#00FF9C]/30'
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2.5 rtl:left-2.5 rtl:right-auto flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="font-mono text-[11px] text-[#EF4444]">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
