import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  LayoutDashboard, 
  Layers, 
  Play, 
  Workflow, 
  FileCode, 
  Sparkles, 
  Code2, 
  Activity, 
  ChevronLeft, 
  ChevronRight,
  Globe2,
  ShieldCheck,
  Zap,
  Command,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  onOpenCommand: () => void;
  totalApisCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenCommand,
  totalApisCount
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('osiris_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('osiris_sidebar_collapsed', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const navItems = [
    {
      id: 'dashboard',
      labelEn: 'System Hub',
      labelAr: 'لوحة النظام',
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-[#00FF9C]/10 text-[#00FF9C] border-[#00FF9C]/30',
      descriptionEn: 'Platform overview & metrics',
      descriptionAr: 'نظرة عامة ومقاييس النظام',
    },
    {
      id: 'explorer',
      labelEn: 'API Explorer',
      labelAr: 'مستكشف الواجهات',
      icon: Layers,
      badge: totalApisCount.toLocaleString(),
      badgeColor: 'bg-[#181818] text-[#00FF9C] border-[#262626]',
      descriptionEn: '3,260+ production scrapers',
      descriptionAr: '3,260+ واجهة استخراج وإنتاج',
    },
    {
      id: 'playground',
      labelEn: 'Live Playground',
      labelAr: 'استوديو التشغيل',
      icon: Play,
      badge: undefined,
      descriptionEn: 'Interactive payload executor',
      descriptionAr: 'منفذ الحمولات التفاعلي المباشر',
    },
    {
      id: 'pipelines',
      labelEn: 'Pipelines',
      labelAr: 'خطوط العمل',
      icon: Workflow,
      badge: 'PRO',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      descriptionEn: 'Multi-stage automation workflows',
      descriptionAr: 'سلاسل أتمتة متعددة المراحل',
    },
    {
      id: 'schema-builder',
      labelEn: 'Schema Builder',
      labelAr: 'منشئ المخططات',
      icon: FileCode,
      badge: undefined,
      descriptionEn: 'JSON schema & field extractor',
      descriptionAr: 'مستخرج الحقول ومخططات البيانات',
    },
    {
      id: 'ai-architect',
      labelEn: 'AI Orchestrator',
      labelAr: 'المهندس الذكي',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-[#3B82F6]/10 text-[#60A5FA] border-[#3B82F6]/30',
      descriptionEn: 'Gemini 3.7 automation synthesizer',
      descriptionAr: 'مُولّد السلاسل بالذكاء الاصطناعي',
    },
    {
      id: 'code-studio',
      labelEn: 'Code Studio',
      labelAr: 'استوديو الأكواد',
      icon: Code2,
      badge: '6 SDKs',
      badgeColor: 'bg-[#181818] text-[#A0A0A0] border-[#262626]',
      descriptionEn: 'Python, cURL, Node.js, Go, Rust',
      descriptionAr: 'أكواد جاهزة بـ 6 لغات برمجية',
    },
    {
      id: 'telemetry',
      labelEn: 'NOC & Telemetry',
      labelAr: 'المراقبة الحية',
      icon: Activity,
      badge: '99.9%',
      badgeColor: 'bg-[#00FF9C]/10 text-[#00FF9C] border-[#00FF9C]/30',
      descriptionEn: 'Proxy mesh & node health',
      descriptionAr: 'حالة العقد وشبكة البروكسيات',
    },
  ];

  return (
    <aside
      aria-label="Sidebar Navigation"
      className={`relative z-20 shrink-0 select-none border-b md:border-b-0 ltr:md:border-r rtl:md:border-l border-[#242424] bg-[#070707] transition-all duration-200 ease-in-out flex flex-col ${
        isCollapsed ? 'w-full md:w-[72px]' : 'w-full md:w-[260px]'
      }`}
    >
      {/* Soft Circular Toggle Button (Desktop) */}
      <button
        type="button"
        id="sidebar-collapse-toggle"
        onClick={toggleSidebar}
        title={isCollapsed ? (lang === 'ar' ? 'توسيع القائمة' : 'Expand sidebar') : (lang === 'ar' ? 'طي القائمة' : 'Collapse sidebar')}
        className={`hidden md:flex absolute top-6 z-30 h-7 w-7 items-center justify-center rounded-full bg-[#111111] border border-[#2E2E2E] text-[#9E9E9E] hover:text-[#00FF9C] hover:border-[#00FF9C]/60 shadow-md shadow-black/80 transition-all duration-150 active:scale-90 cursor-pointer ${
          lang === 'ar' ? '-left-3.5' : '-right-3.5'
        }`}
      >
        {isCollapsed ? (
          lang === 'ar' ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )
        ) : lang === 'ar' ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Header / Brand Logo */}
      <div className="flex h-16 items-center px-4 border-b border-[#181818]">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00FF9C]/10 border border-[#00FF9C]/30 text-[#00FF9C] shadow-sm shadow-[#00FF9C]/10">
            <Terminal className="h-5 w-5" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-150">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold tracking-wider text-[#EAEAEA]">
                  OSIRIS<span className="text-[#00FF9C]">-X</span>
                </span>
                <span className="rounded bg-[#141414] border border-[#262626] px-1.5 py-0.2 text-[10px] font-mono font-bold text-[#00FF9C]">
                  v2.6
                </span>
              </div>
              <span className="truncate text-[10px] font-mono text-[#707070]">
                ENTERPRISE MESH
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links (Icon Rail in Collapsed, Full in Expanded) */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto overflow-x-hidden">
        {/* Quick Search trigger in expanded mode */}
        {!isCollapsed && (
          <button
            type="button"
            onClick={onOpenCommand}
            className="w-full mb-3 flex items-center justify-between gap-2 rounded-xl border border-[#222222] bg-[#050505] px-3 py-2 text-xs text-[#808080] hover:border-[#00FF9C]/40 hover:text-[#D1D1D1] transition-all"
          >
            <div className="flex items-center gap-2">
              <Command className="h-3.5 w-3.5 text-[#00FF9C]" />
              <span>{lang === 'ar' ? 'بحث سريع...' : 'Quick Search...'}</span>
            </div>
            <kbd className="rounded border border-[#2A2A2A] bg-[#111111] px-1.5 py-0.5 text-[10px] font-mono text-[#757575]">
              ⌘K
            </kbd>
          </button>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = lang === 'ar' ? item.labelAr : item.labelEn;
          const description = lang === 'ar' ? item.descriptionAr : item.descriptionEn;

          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-xl transition-all duration-150 ${
                  isCollapsed
                    ? 'justify-center h-11 px-0'
                    : 'justify-between px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 shadow-sm shadow-[#00FF9C]/10 font-bold'
                    : 'text-[#999999] hover:bg-[#121212] hover:text-[#EAEAEA] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`shrink-0 transition-transform duration-150 ${
                      isActive ? 'text-[#00FF9C] scale-105' : 'text-[#808080] group-hover:text-[#EAEAEA]'
                    } ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`}
                  />
                  {!isCollapsed && (
                    <span className="truncate text-xs sm:text-sm font-sans font-medium text-start">
                      {label}
                    </span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold border ${
                      item.badgeColor || 'bg-[#181818] text-[#808080] border-[#262626]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Floating Tooltip in Collapsed State */}
              {isCollapsed && (
                <div
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 z-50 hidden md:group-hover:flex flex-col items-start rounded-xl border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-xs shadow-2xl shadow-black transition-all ${
                    lang === 'ar' ? 'right-full mr-2' : 'left-full ml-2'
                  }`}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="font-bold text-[#EAEAEA] font-sans">{label}</span>
                    {item.badge && (
                      <span className="rounded bg-[#1C1C1C] px-1.5 py-0.2 text-[9px] font-mono text-[#00FF9C] border border-[#2E2E2E]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#757575] font-sans whitespace-nowrap">
                    {description}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / Status Area */}
      <div className="p-3 border-t border-[#181818] bg-[#050505]/60 space-y-2">
        {/* Node Live Mesh Badge */}
        {!isCollapsed ? (
          <div className="rounded-xl border border-[#1E1E1E] bg-[#090909] p-2.5 font-mono text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#707070]">NODE MESH</span>
              <span className="flex items-center gap-1.5 text-[#00FF9C] text-[10px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#A0A0A0]">
              <span>14,850 Residential IPs</span>
              <span className="text-[#00FF9C]">24ms</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center group relative">
            <div className="h-8 w-8 rounded-lg bg-[#090909] border border-[#222222] flex items-center justify-center text-[#00FF9C] cursor-pointer">
              <span className="h-2 w-2 rounded-full bg-[#00FF9C] animate-pulse" />
            </div>
            <div
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 z-50 hidden md:group-hover:flex flex-col rounded-xl border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-xs shadow-2xl ${
                lang === 'ar' ? 'right-full mr-2' : 'left-full ml-2'
              }`}
            >
              <span className="font-mono text-[#00FF9C] font-bold">MESH ONLINE</span>
              <span className="text-[10px] text-[#757575] font-mono">14,850 Nodes | 24ms</span>
            </div>
          </div>
        )}

        {/* Language & Command Shortcut */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-1 font-mono text-xs`}>
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            className={`flex items-center gap-1.5 rounded-lg border border-[#222222] bg-[#090909] text-[#A0A0A0] hover:text-[#00FF9C] hover:border-[#00FF9C]/40 transition ${
              isCollapsed ? 'h-8 w-8 justify-center p-0' : 'px-2.5 py-1 text-xs'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" />
            {!isCollapsed && <span>{lang === 'ar' ? 'English' : 'عربي'}</span>}
          </button>

          {!isCollapsed && (
            <button
              type="button"
              onClick={onOpenCommand}
              title="Command Palette"
              className="flex items-center gap-1 text-[#707070] hover:text-[#00FF9C] text-[11px] transition"
            >
              <Command className="h-3 w-3" />
              <span>⌘K</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
