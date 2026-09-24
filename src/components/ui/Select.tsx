import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  leftIcon,
  className = '',
  id,
  value,
  onChange,
  disabled,
  ...props
}) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full space-y-1.5 font-sans">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-mono font-medium text-[#B0B0B0]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center pl-3 rtl:pr-3 rtl:pl-0 text-[#757575]">
            {leftIcon}
          </div>
        )}

        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border bg-[#050505] text-[#EAEAEA] text-xs sm:text-sm font-mono transition-all duration-150 ${
            leftIcon ? 'pl-9 rtl:pr-9 rtl:pl-3' : 'pl-3.5 rtl:pr-3.5 rtl:pl-9'
          } pr-9 rtl:pl-9 rtl:pr-3.5 py-2.5 min-h-[42px] ${
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
              : 'border-[#242424] hover:border-[#00FF9C]/40 focus:border-[#00FF9C] focus:outline-none'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-[#0A0A0A] text-[#EAEAEA] py-1"
            >
              {opt.label} {opt.badge ? `(${opt.badge})` : ''}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 h-4 w-4 text-[#757575]" />
      </div>

      {error && <p className="text-[11px] font-mono text-[#EF4444]">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[#757575] font-sans">{helperText}</p>}
    </div>
  );
};
