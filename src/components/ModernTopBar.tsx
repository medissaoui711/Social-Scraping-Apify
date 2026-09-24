import React, { useState } from 'react';
import { 
  Command, 
  Key, 
  Activity, 
  Sparkles, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  Search,
  Zap,
  Globe2,
  Menu,
  X
} from 'lucide-react';
import { Button, Badge } from './ui';

interface ModernTopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  onOpenCommand: () => void;
  apifyToken: string;
  setApifyToken: (token: string) => void;
  totalApisCount: number;
}

export const ModernTopBar: React.FC<ModernTopBarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenCommand,
  apifyToken,
  setApifyToken,
  totalApisCount,
}) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tempToken, setTempToken] = useState(apifyToken);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getScreenTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return { en: 'System Hub & Realtime Health', ar: 'لوحة النظام والمراقبة الحية' };
      case 'explorer':
        return { en: 'API Catalog & Directory', ar: 'مستكشف الواجهات ومحرك البحث' };
      case 'playground':
        return { en: 'Interactive Payload Studio', ar: 'استوديو التشغيل وتجربة الحمولات' };
      case 'pipelines':
        return { en: 'Automation Pipelines', ar: 'خطوط العمل وسلاسل الأتمتة' };
      case 'schema-builder':
        return { en: 'JSON Schema Generator', ar: 'منشئ المخططات ومستخرج الحقول' };
      case 'ai-architect':
        return { en: 'AI Workflow Orchestrator', ar: 'المهندس الذكي وتوليد السلاسل' };
      case 'code-studio':
        return { en: 'Multi-Language SDKs', ar: 'استوديو الأكواد والـ Webhooks' };
      case 'telemetry':
        return { en: 'NOC Proxy Mesh & Telemetry', ar: 'شبكة البروكسيات والمراقبة الحية' };
      default:
        return { en: 'Enterprise Platform', ar: 'المنصة المؤسسية' };
    }
  };

  const handleSaveToken = () => {
    setApifyToken(tempToken.trim());
    setIsTokenModalOpen(false);
  };

  const title = getScreenTitle(activeTab);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#242424] bg-[#070707]/90 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Breadcrumb & Screen Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[#262626] bg-[#0E0E0E] text-[#B0B0B0] hover:text-[#00FF9C]"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-[#757575]">
          <span className="hidden sm:inline text-[#A0A0A0]">OSIRIS-X</span>
          <span className="hidden sm:inline">/</span>
          <span className="font-sans font-bold text-sm text-[#EAEAEA]">
            {lang === 'ar' ? title.ar : title.en}
          </span>
        </div>

        <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-[#00FF9C]/10 border border-[#00FF9C]/30 px-2.5 py-0.5 text-[11px] font-mono text-[#00FF9C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] animate-pulse" />
          <span>PROD ACTIVE</span>
        </span>
      </div>

      {/* Center: Interactive Search Trigger */}
      <div className="hidden md:flex items-center justify-center max-w-md w-full px-4">
        <button
          type="button"
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#242424] bg-[#050505] px-3.5 py-1.5 text-xs text-[#757575] hover:border-[#00FF9C]/40 hover:text-[#EAEAEA] transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-[#00FF9C]" />
            <span className="font-sans">
              {lang === 'ar' ? 'بحث في 3,268 واجهة أو أمر سريع...' : 'Search 3,268 APIs or press...'}
            </span>
          </div>
          <kbd className="rounded border border-[#2A2A2A] bg-[#141414] px-1.5 py-0.5 text-[10px] font-mono text-[#A0A0A0]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Mesh Status & Token Config */}
      <div className="flex items-center gap-2.5 font-mono text-xs">
        {/* Token Authentication Trigger */}
        <button
          type="button"
          onClick={() => {
            setTempToken(apifyToken);
            setIsTokenModalOpen(true);
          }}
          className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono transition-all ${
            apifyToken
              ? 'border-[#00FF9C]/30 bg-[#00FF9C]/10 text-[#00FF9C] shadow-sm'
              : 'border-[#2A2A2A] bg-[#0E0E0E] text-[#808080] hover:text-[#EAEAEA] hover:border-[#00FF9C]/30'
          }`}
        >
          <Key className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {apifyToken
              ? `API KEY: ••••${apifyToken.slice(-4)}`
              : lang === 'ar'
              ? 'ربط API Token'
              : 'Connect Token'}
          </span>
          {apifyToken && <span className="h-1.5 w-1.5 rounded-full bg-[#00FF9C]" />}
        </button>

        {/* Global Action: Trigger AI Orchestrator */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setActiveTab('ai-architect')}
          leftIcon={<Sparkles className="h-3.5 w-3.5" />}
          className="hidden sm:inline-flex"
        >
          {lang === 'ar' ? 'المهندس الذكي' : 'AI Architect'}
        </Button>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 border-b border-[#242424] bg-[#090909] p-4 shadow-2xl space-y-2 z-50">
          {[
            { id: 'dashboard', label: lang === 'ar' ? 'لوحة النظام' : 'System Hub' },
            { id: 'explorer', label: lang === 'ar' ? 'مستكشف الواجهات' : 'API Explorer' },
            { id: 'playground', label: lang === 'ar' ? 'استوديو التشغيل' : 'Live Playground' },
            { id: 'pipelines', label: lang === 'ar' ? 'خطوط العمل' : 'Pipelines' },
            { id: 'schema-builder', label: lang === 'ar' ? 'منشئ المخططات' : 'Schema Builder' },
            { id: 'ai-architect', label: lang === 'ar' ? 'المهندس الذكي' : 'AI Orchestrator' },
            { id: 'code-studio', label: lang === 'ar' ? 'استوديو الأكواد' : 'Code Studio' },
            { id: 'telemetry', label: lang === 'ar' ? 'المراقبة الحية' : 'NOC & Telemetry' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-start px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-[#00FF9C]/10 text-[#00FF9C] font-bold border border-[#00FF9C]/30'
                  : 'text-[#999999] hover:bg-[#141414]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* API Token Configuration Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#2A2A2A] bg-[#0B0B0B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-[#1E1E1E] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FF9C]/10 border border-[#00FF9C]/30 text-[#00FF9C]">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans text-base font-bold text-[#EAEAEA]">
                  {lang === 'ar' ? 'إعداد مفتاح الـ API للتشغيل الحي' : 'Configure Live API Token'}
                </h3>
                <p className="text-xs text-[#757575]">
                  {lang === 'ar'
                    ? 'لتنفيذ وتشغيل الـ 3,268 واجهة مباشرة على السحابة'
                    : 'To execute 3,268 production scrapers in the cloud'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#B0B0B0]">
                {lang === 'ar' ? 'مفتاح Apify API Token (apify_api_...):' : 'Apify API Token (apify_api_...):'}
              </label>
              <input
                type="password"
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
                placeholder="apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full rounded-xl border border-[#262626] bg-[#050505] px-3.5 py-2.5 text-xs font-mono text-[#00FF9C] focus:border-[#00FF9C] focus:outline-none"
              />
              <p className="text-[11px] text-[#707070]">
                {lang === 'ar'
                  ? 'يتم حفظ المفتاح بأمان محلياً في متصفحك ولا يتم إرساله لأي خوادم وسيطة.'
                  : 'Token is stored locally in your browser session for direct client calls.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C1C1C]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTokenModalOpen(false)}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveToken}
                leftIcon={<Check className="h-4 w-4" />}
              >
                {lang === 'ar' ? 'حفظ وتفعيل' : 'Save & Activate'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
