import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Play, 
  Layers, 
  Workflow, 
  Sparkles, 
  Code2, 
  ArrowRight,
  ExternalLink,
  Activity,
  Command,
  Star
} from 'lucide-react';
import { ScrapingApiItem } from '../types';
import { useApp } from '../context/AppContext';
import { Badge } from './ui/Badge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  apis: ScrapingApiItem[];
  onSelectApi: (api: ScrapingApiItem) => void;
  onNavigateTab: (tabId: string) => void;
  lang: 'ar' | 'en';
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  apis,
  onSelectApi,
  onNavigateTab,
  lang
}) => {
  const { searchIndex } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickTabs = [
    { id: 'dashboard', label: lang === 'ar' ? 'لوحة النظام المركزية' : 'System Hub & NOC', icon: Activity },
    { id: 'explorer', label: lang === 'ar' ? 'استعراض 3,268 API' : 'Explore 3,268 APIs', icon: Layers },
    { id: 'playground', label: lang === 'ar' ? 'استوديو التشغيل المباشر' : 'Launch Live Playground', icon: Play },
    { id: 'pipelines', label: lang === 'ar' ? 'مُنشئ خطوط المعالجة الآلية' : 'Open Pipeline Automator', icon: Workflow },
    { id: 'schema-builder', label: lang === 'ar' ? 'مُهندس مخططات الـ Schemas' : 'Actor Schema Builder', icon: Code2 },
    { id: 'ai-architect', label: lang === 'ar' ? 'مهندس الذكاء الاصطناعي' : 'Ask AI Scraper Architect', icon: Sparkles },
    { id: 'code-studio', label: lang === 'ar' ? 'توليد أكواد SDKs و cURL' : 'Generate Code & SDKs', icon: Code2 },
    { id: 'telemetry', label: lang === 'ar' ? 'مؤشرات الأداء وعقد البروكسي' : 'Node Cluster & Telemetry', icon: Activity }
  ];

  const filteredApis = query.trim()
    ? searchIndex.search(query).slice(0, 8)
    : apis.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 p-4 pt-16 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#262626] bg-[#0A0A0A] shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center border-b border-[#1E1E1E] px-4 py-3.5 bg-[#080808]">
          <Search className="h-4 w-4 text-[#00FF9C] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              lang === 'ar'
                ? 'ابحث في 3,268 أداة سحب، أو اكتب اسم منصة (Instagram, YouTube, TikTok)...'
                : 'Search 3,268 scrapers, platforms, keywords (Instagram, LinkedIn, YouTube)...'
            }
            className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#EAEAEA] placeholder-[#555555] font-mono focus:outline-none"
          />
          <kbd className="rounded border border-[#242424] bg-[#050505] px-2 py-0.5 font-mono text-[10px] text-[#808080] select-none">
            ESC
          </kbd>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Navigation Sections */}
          {!query && (
            <div>
              <div className="px-2 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#707070]">
                {lang === 'ar' ? 'التنقل السريع للأقسام' : 'Quick Navigation'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {quickTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onNavigateTab(tab.id);
                        onClose();
                      }}
                      className="flex items-center gap-2.5 rounded-lg border border-transparent p-2 text-left rtl:text-right text-xs text-[#D1D1D1] transition hover:border-[#222222] hover:bg-[#141414] hover:text-[#00FF9C]"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#050505] border border-[#242424] text-[#808080]">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold font-sans">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scraping APIs Results */}
          <div>
            <div className="px-2 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#707070]">
              {lang === 'ar' ? 'واجهات وأدوات الاستخراج المقترحة' : 'Scraper Actors'} ({filteredApis.length})
            </div>
            <div className="space-y-1">
              {filteredApis.map((api, idx) => (
                <div
                  key={api.id}
                  onClick={() => {
                    onSelectApi(api);
                    onClose();
                  }}
                  className="group flex cursor-pointer items-center justify-between rounded-lg border border-[#181818] bg-[#050505] p-2.5 transition hover:border-[#00FF9C]/40 hover:bg-[#111111]"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Badge variant="platform" size="xs">
                      {api.platform}
                    </Badge>
                    <div className="truncate">
                      <div className="truncate text-xs font-bold text-[#EAEAEA] group-hover:text-[#00FF9C] font-sans">
                        {api.name}
                      </div>
                      <div className="truncate font-mono text-[10px] text-[#707070]">
                        {api.actorId} • {api.pricing} • ★ {api.rating}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-[#808080]">
                    <span className="hidden sm:inline text-[11px] text-[#00FF9C] font-bold">
                      {api.successRate}%
                    </span>
                    <div className="rounded bg-[#141414] p-1 text-[#707070] group-hover:text-[#00FF9C]">
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between border-t border-[#1E1E1E] bg-[#050505] px-4 py-2 text-[10px] font-mono text-[#707070]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-[#111] px-1.5 py-0.5 border border-[#222]">↑</kbd>{' '}
              <kbd className="rounded bg-[#111] px-1.5 py-0.5 border border-[#222]">↓</kbd>{' '}
              {lang === 'ar' ? 'للتنقل' : 'to navigate'}
            </span>
            <span>
              <kbd className="rounded bg-[#111] px-1.5 py-0.5 border border-[#222]">ENTER</kbd>{' '}
              {lang === 'ar' ? 'للاختيار' : 'to select'}
            </span>
          </div>
          <div>OSIRIS-X Search Index v2.6</div>
        </div>
      </div>
    </div>
  );
};
