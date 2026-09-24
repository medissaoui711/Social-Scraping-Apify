import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline' | 'terminal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'terminal',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 min-h-[32px]',
    md: 'px-3 py-1.5 text-xs sm:text-sm gap-2 min-h-[38px]',
    lg: 'px-4 py-2 text-sm sm:text-base gap-2.5 min-h-[44px]',
  };

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#090909] border border-[#242424] ${className}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center justify-center font-medium rounded-lg transition-all select-none ${sizeClasses[size]} ${
                isActive
                  ? 'bg-[#00FF9C] text-black font-bold shadow-md shadow-[#00FF9C]/20'
                  : 'text-[#B0B0B0] hover:text-[#EAEAEA] hover:bg-[#141414]'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {Icon && <Icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-[#808080]'}`} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? 'bg-black text-[#00FF9C]' : 'bg-[#1C1C1C] text-[#B0B0B0]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className={`flex items-center gap-4 border-b border-[#242424] overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center gap-2 pb-2.5 pt-1 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-[#00FF9C] text-[#00FF9C] font-bold'
                  : 'border-transparent text-[#808080] hover:text-[#EAEAEA]'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="rounded bg-[#161616] px-1.5 py-0.5 text-[10px] font-mono text-[#808080] border border-[#242424]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: 'terminal' geometric style
  return (
    <div className={`flex flex-wrap items-center gap-1 rounded-xl bg-[#090909] p-1.5 border border-[#242424] font-mono ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center justify-center font-medium rounded-lg transition select-none ${sizeClasses[size]} ${
              isActive
                ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 font-bold shadow-sm'
                : 'text-[#808080] hover:text-[#EAEAEA] hover:bg-[#121212] border border-transparent'
            } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {Icon && <Icon className={`h-4 w-4 ${isActive ? 'text-[#00FF9C]' : 'text-[#757575]'}`} />}
            <span className="font-sans">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] ${
                  isActive ? 'bg-[#00FF9C]/20 text-[#00FF9C]' : 'bg-[#181818] text-[#757575]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
