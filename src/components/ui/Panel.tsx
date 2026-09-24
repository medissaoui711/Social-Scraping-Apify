import React from 'react';

export interface PanelProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'base' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  variant = 'base',
  padding = 'md',
  className = '',
  id,
}) => {
  const variantStyles = {
    base: 'bg-[#090909] border border-[#242424]',
    elevated: 'bg-[#111111] border border-[#2A2A2A] shadow-2xl shadow-black/80',
    bordered: 'bg-[#050505] border border-[#181818]',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-7',
  };

  return (
    <section
      id={id}
      className={`rounded-xl ${variantStyles[variant]} ${className} transition-all duration-150`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between border-b border-[#1C1C1C] px-5 py-3.5">
          <div>
            {typeof title === 'string' ? (
              <h3 className="font-sans font-bold text-sm sm:text-base text-[#EAEAEA]">{title}</h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-[#757575] font-sans">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}

      <div className={paddingStyles[padding]}>{children}</div>

      {footer && (
        <div className="border-t border-[#1C1C1C] bg-[#050505]/40 px-5 py-3 rounded-b-xl">
          {footer}
        </div>
      )}
    </section>
  );
};
