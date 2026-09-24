import React, { useState } from 'react';
import { 
  Terminal, 
  Layers, 
  Play, 
  Workflow, 
  Sparkles, 
  Code2, 
  BarChart3, 
  Search, 
  Globe2, 
  ShieldCheck, 
  Key, 
  Check, 
  Zap,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { StatusDot } from './ui/StatusDot';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ProxyGatewayModal } from './ProxyGatewayModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  onOpenCommand: () => void;
  apifyToken: string;
  setApifyToken: (token: string) => void;
  totalApisCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenCommand,
  apifyToken,
  setApifyToken,
  totalApisCount
}) => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showProxyModal, setShowProxyModal] = useState(false);
  const [tempToken, setTempToken] = useState(apifyToken);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveToken = () => {
    setApifyToken(tempToken);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowTokenModal(false);
    }, 1200);
  };

  const navItems = [
    {
      id: 'explorer',
      label: lang === 'ar' ? 'دليل الـ APIs' : 'API Hub',
      badge: `${totalApisCount}`,
      icon: Layers
    },
    {
      id: 'playground',
      label: lang === 'ar' ? 'استوديو التشغيل' : 'Playground',
      icon: Play
    },
    {
      id: 'pipelines',
      label: lang === 'ar' ? 'خطوط المعالجة' : 'Pipelines',
      icon: Workflow
    },
    {
      id: 'schema-builder',
      label: lang === 'ar' ? 'مُهندس الـ Schemas' : 'Schema Builder',
      icon: Code2
    },
    {
      id: 'ai-architect',
      label: lang === 'ar' ? 'مهندس الـ AI' : 'AI Architect',
      badge: 'Gemini',
      icon: Sparkles
    },
    {
      id: 'code-studio',
      label: lang === 'ar' ? 'مولّد الأكواد' : 'Code Studio',
      icon: Code2
    },
    {
      id: 'telemetry',
      label: lang === 'ar' ? 'المقاييس والشبكة' : 'Telemetry',
      icon: BarChart3
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242424] bg-[#050505]/95 backdrop-blur-md">
      {/* Top Telemetry Ticker */}
      <div className="border-b border-[#181818] bg-[#080808] px-4 py-1 text-xs text-[#808080] font-mono">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[#00FF9C] font-semibold tracking-wide text-[11px]">
              <StatusDot status="active" size="sm" />
              <span>3,268 SCRAPING NODES ONLINE</span>
            </span>
            <button
              onClick={() => setShowProxyModal(true)}
              className="hidden items-center gap-1.5 sm:inline-flex text-[#808080] text-[11px] hover:text-[#00FF9C] transition cursor-pointer border border-[#222222] bg-[#111111] px-2 py-0.5 rounded"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#00FF9C]" />
              <span>Residential Proxy Shield: Active (14,850 Nodes) ⚡</span>
            </button>
            <span className="hidden items-center gap-1 md:inline-flex text-[#808080] text-[11px]">
              <Zap className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>Latency ~32ms</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTokenModal(true)}
              className="flex items-center gap-1.5 rounded border border-[#242424] bg-[#111111] px-2.5 py-0.5 text-[11px] text-[#B0B0B0] transition hover:border-[#00FF9C]/40 hover:text-white"
            >
              <Key className="h-3 w-3 text-[#FFB800]" />
              <span>
                {apifyToken
                  ? (lang === 'ar' ? 'مفتاح Apify: متصل' : 'Apify Token: Connected')
                  : (lang === 'ar' ? 'مفتاح Apify' : 'Apify Token')}
              </span>
            </button>

            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 rounded border border-[#242424] bg-[#111111] px-2.5 py-0.5 text-[11px] text-[#00FF9C] transition hover:bg-[#181818]"
            >
              <Globe2 className="h-3 w-3" />
              <span className="font-semibold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00FF9C]/40 bg-[#00FF9C]/10 text-[#00FF9C] shadow-sm shadow-[#00FF9C]/10">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                OSIRIS<span className="text-[#00FF9C]">-X</span>
              </span>
              <Badge variant="primary" size="xs">
                v2.6 Enterprise
              </Badge>
            </div>
            <p className="text-[10px] text-[#757575] font-sans">
              {lang === 'ar' 
                ? 'منصة استخراج وأتمتة بيانات التواصل الاجتماعي'
                : 'Social Data Extraction & Intelligence Hub'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 rounded-lg border border-[#202020] bg-[#0A0A0A] p-1 font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/40 font-bold shadow-sm'
                    : 'text-[#888888] hover:bg-[#141414] hover:text-[#EAEAEA] border border-transparent'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#00FF9C]' : 'text-[#666666]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`rounded px-1.5 py-0.2 text-[9px] font-mono ${
                    isActive ? 'bg-[#00FF9C]/20 text-[#00FF9C]' : 'bg-[#181818] text-[#808080]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Search Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-2 rounded-lg border border-[#242424] bg-[#0E0E0E] px-3 py-1.5 text-xs text-[#B0B0B0] transition hover:border-[#00FF9C]/50 hover:text-white"
          >
            <Search className="h-3.5 w-3.5 text-[#808080]" />
            <span className="hidden sm:inline font-mono">{lang === 'ar' ? 'بحث سريع' : 'Quick search'}</span>
            <kbd className="rounded border border-[#262626] bg-[#050505] px-1.5 py-0.5 font-mono text-[10px] text-[#808080]">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-[#1C1C1C] bg-[#080808] px-2 py-1.5 gap-1.5 scrollbar-none font-mono">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/40 font-bold'
                  : 'text-[#808080] hover:text-[#EAEAEA] bg-[#0E0E0E] border border-[#202020]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Apify Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#202020] pb-4">
              <div className="flex items-center gap-2 text-white">
                <Key className="h-5 w-5 text-[#FFB800]" />
                <h3 className="font-bold text-base font-mono">
                  {lang === 'ar' ? 'إعدادات مفتاح Apify API' : 'Apify API Key Configuration'}
                </h3>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-[#808080] hover:text-white text-sm font-mono p-1 rounded hover:bg-[#1A1A1A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 font-sans">
              <p className="text-xs text-[#B0B0B0] leading-relaxed">
                {lang === 'ar'
                  ? 'النظام يعمل بشكل فوري عبر محاكي النبض السحابي التفاعلي. يمكنك أيضاً وضع مفتاح Apify الحقيقي لتنفيذ عمليات السحب المباشرة عبر حسابك الرسمي.'
                  : 'The platform runs instantly out-of-the-box in simulated mode. Add your personal Apify token to dispatch live cloud runs against real target endpoints.'}
              </p>

              <Input
                label={lang === 'ar' ? 'رمز API Token الخاص بك:' : 'Your Apify API Token:'}
                type="password"
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
                placeholder="apify_api_xxxxxxxxxxxxxxxxxxxxxx"
              />

              <div className="rounded-lg border border-[#00FF9C]/20 bg-[#00FF9C]/5 p-3 text-[11px] text-[#00FF9C] font-mono">
                🔒 {lang === 'ar' 
                  ? 'يتم تخزين المفتاح محلياً داخل جلستك ولا يتم مشاركته مع أي طرف خارجي.'
                  : 'Token is kept securely in your local browser session for direct client calls.'}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTokenModal(false)}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveToken}
                  leftIcon={savedSuccess ? <Check className="h-4 w-4" /> : null}
                >
                  {savedSuccess ? (lang === 'ar' ? 'تم الحفظ!' : 'Saved!') : (lang === 'ar' ? 'حفظ المفتاح' : 'Save Token')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proxy Gateway & Anti-Detection Modal */}
      <ProxyGatewayModal
        lang={lang}
        isOpen={showProxyModal}
        onClose={() => setShowProxyModal(false)}
      />
    </header>
  );
};
