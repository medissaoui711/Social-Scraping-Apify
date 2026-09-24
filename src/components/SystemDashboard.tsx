import React from 'react';
import { 
  Activity, 
  Layers, 
  Play, 
  Workflow, 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  Globe2, 
  Server, 
  Clock, 
  Database,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Cpu,
  BarChart2,
  Compass
} from 'lucide-react';
import { ScrapingApiItem } from '../types';
import { Button, Badge, Card, Panel } from './ui';

interface SystemDashboardProps {
  apis: ScrapingApiItem[];
  onNavigateTab: (tab: string) => void;
  onSelectApiForPlayground: (api: ScrapingApiItem) => void;
  onSelectApiForCode: (api: ScrapingApiItem) => void;
  lang: 'ar' | 'en';
}

export const SystemDashboard: React.FC<SystemDashboardProps> = ({
  apis,
  onNavigateTab,
  onSelectApiForPlayground,
  onSelectApiForCode,
  lang,
}) => {
  // Top platforms matrix
  const platformMatrix = [
    { name: 'X / Twitter', actors: 412, successRate: '98.8%', status: 'optimal', latency: '28ms', bypass: '100% Anti-Bot' },
    { name: 'LinkedIn', actors: 385, successRate: '97.6%', status: 'optimal', latency: '35ms', bypass: 'TLS Fingerprint' },
    { name: 'Instagram', actors: 490, successRate: '98.2%', status: 'optimal', latency: '31ms', bypass: 'Session Rotator' },
    { name: 'TikTok', actors: 310, successRate: '99.1%', status: 'optimal', latency: '22ms', bypass: 'Signature Bypass' },
    { name: 'Google Maps', actors: 280, successRate: '99.5%', status: 'optimal', latency: '19ms', bypass: 'Direct Proxy' },
    { name: 'Amazon', actors: 420, successRate: '98.4%', status: 'optimal', latency: '34ms', bypass: 'CAPTCHA Solver' },
    { name: 'YouTube', actors: 260, successRate: '99.4%', status: 'optimal', latency: '21ms', bypass: 'Residential IP' },
    { name: 'Reddit', actors: 195, successRate: '99.0%', status: 'optimal', latency: '25ms', bypass: 'OAuth Token' },
  ];

  // Quick Launchpad Items
  const launchpad = [
    {
      id: 'explorer',
      title: lang === 'ar' ? 'مستكشف الواجهات' : 'API Catalog',
      desc: lang === 'ar' ? 'تصفح وفلترة 3,268 واجهة استخراج وإنتاج جاهزة' : 'Explore and filter 3,268 production scraping actors',
      icon: Layers,
      color: 'text-[#00FF9C]',
      bg: 'bg-[#00FF9C]/10',
      actionText: lang === 'ar' ? 'فتح المستكشف' : 'Explore APIs',
    },
    {
      id: 'playground',
      title: lang === 'ar' ? 'استوديو التشغيل الحي' : 'Live Playground',
      desc: lang === 'ar' ? 'اختبر الحمولات مباشرة وافحص البيانات والـ JSON فورياً' : 'Execute actors live and inspect JSON, tables, and media',
      icon: Play,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      actionText: lang === 'ar' ? 'تشغيل حمولة' : 'Launch Run',
    },
    {
      id: 'pipelines',
      title: lang === 'ar' ? 'سلاسل الأتمتة' : 'Pipelines Builder',
      desc: lang === 'ar' ? 'اربط عدة كاشطات في تدفق تسلسلي مع تصدير وجدولة' : 'Chain multiple scrapers into automated workflows',
      icon: Workflow,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      actionText: lang === 'ar' ? 'بناء خط عمل' : 'Build Pipeline',
    },
    {
      id: 'ai-architect',
      title: lang === 'ar' ? 'المهندس الذكي (AI)' : 'AI Orchestrator',
      desc: lang === 'ar' ? 'صِف طلبك باللغة الطبيعية ليقوم Gemini 3.7 بتوليد التدفق' : 'Describe your extraction goal to generate custom pipelines',
      icon: Sparkles,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      actionText: lang === 'ar' ? 'توليد بالذكاء' : 'Synthesize AI',
    },
  ];

  const featuredApis = apis.slice(0, 4);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Hero / Executive System Status */}
      <div className="rounded-2xl border border-[#242424] bg-gradient-to-br from-[#0B0B0B] via-[#080808] to-[#050505] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-[#00FF9C]/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#00FF9C] animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00FF9C]">
                OSIRIS-X ENTERPRISE SYSTEM HUB
              </span>
            </div>
            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#EAEAEA] tracking-tight">
              {lang === 'ar'
                ? 'مركز التحكم الموحد وشبكة استخراج البيانات السحابية'
                : 'Central Command & Cloud Extraction Mesh'}
            </h1>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              {lang === 'ar'
                ? 'منصة سحابية متقدمة تدير 3,268 واجهة استخراج، ومصفوفة بروكسيات سكنية تضم أكثر من 14,850 عقدة تجاوز حظر نشطة مع محرك أتمتة متعدد المراحل.'
                : 'Advanced cloud platform managing 3,268 scraping actors, a 14,850+ residential node proxy mesh with anti-bot bypass, and multi-stage pipelines.'}
            </p>
          </div>

          {/* Quick Metrics Pod */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 font-mono">
            <div className="rounded-xl border border-[#222222] bg-[#050505] p-3.5 sm:p-4">
              <div className="text-[11px] text-[#707070] mb-1">TOTAL ACTORS</div>
              <div className="text-xl sm:text-2xl font-bold text-[#00FF9C]">3,268</div>
              <div className="text-[10px] text-[#A0A0A0] mt-1">100% Production Ready</div>
            </div>

            <div className="rounded-xl border border-[#222222] bg-[#050505] p-3.5 sm:p-4">
              <div className="text-[11px] text-[#707070] mb-1">GLOBAL SUCCESS</div>
              <div className="text-xl sm:text-2xl font-bold text-[#00FF9C]">98.4%</div>
              <div className="text-[10px] text-[#A0A0A0] mt-1">1.2M+ Ingested/day</div>
            </div>

            <div className="rounded-xl border border-[#222222] bg-[#050505] p-3.5 sm:p-4">
              <div className="text-[11px] text-[#707070] mb-1">PROXY MESH</div>
              <div className="text-xl sm:text-2xl font-bold text-[#EAEAEA]">14,850</div>
              <div className="text-[10px] text-[#00FF9C] mt-1 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF9C]" />
                Low Latency: 24ms
              </div>
            </div>

            <div className="rounded-xl border border-[#222222] bg-[#050505] p-3.5 sm:p-4">
              <div className="text-[11px] text-[#707070] mb-1">SYSTEM SLA</div>
              <div className="text-xl sm:text-2xl font-bold text-[#EAEAEA]">99.98%</div>
              <div className="text-[10px] text-[#A0A0A0] mt-1">Zero Downtime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Launchpad Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-sans font-bold text-base sm:text-lg text-[#EAEAEA] flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#00FF9C]" />
            <span>{lang === 'ar' ? 'محطة الإطلاق السريع' : 'Quick Launchpad'}</span>
          </h2>
          <span className="font-mono text-xs text-[#707070]">
            {lang === 'ar' ? 'انتقل لأي أداة بنقرة واحدة' : 'Direct modular jump'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {launchpad.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                className="group relative rounded-xl border border-[#222222] bg-[#090909] p-5 hover:border-[#00FF9C]/40 hover:bg-[#0D0D0D] transition-all duration-150 cursor-pointer shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color} border border-white/5`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#666666] group-hover:text-[#00FF9C] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm sm:text-base text-[#EAEAEA] group-hover:text-[#00FF9C] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#808080] line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs font-mono text-[#00FF9C]">
                  <span>{item.actionText}</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Health Matrix & Top Scrapers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Platform Health Matrix */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-base text-[#EAEAEA] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#00FF9C]" />
              <span>{lang === 'ar' ? 'مصفوفة حيوية المنصات وتجاوز الحظر' : 'Platform Health & Anti-Bot Bypass Matrix'}</span>
            </h2>
            <Badge variant="primary" size="sm">
              {lang === 'ar' ? 'تحديث فوري' : 'Live Sync'}
            </Badge>
          </div>

          <div className="rounded-xl border border-[#222222] bg-[#090909] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-start">
                <thead>
                  <tr className="border-b border-[#1C1C1C] bg-[#050505] text-[#707070]">
                    <th className="px-4 py-3 text-start font-medium">{lang === 'ar' ? 'المنصة' : 'Platform'}</th>
                    <th className="px-4 py-3 text-start font-medium">{lang === 'ar' ? 'الواجهات' : 'Actors'}</th>
                    <th className="px-4 py-3 text-start font-medium">{lang === 'ar' ? 'نسبة النجاح' : 'Success'}</th>
                    <th className="px-4 py-3 text-start font-medium">{lang === 'ar' ? 'الاستجابة' : 'Latency'}</th>
                    <th className="px-4 py-3 text-start font-medium">{lang === 'ar' ? 'نظام الحماية' : 'Bypass Tech'}</th>
                    <th className="px-4 py-3 text-end font-medium">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181818]">
                  {platformMatrix.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#0E0E0E] transition-colors">
                      <td className="px-4 py-3 font-sans font-bold text-[#EAEAEA]">{p.name}</td>
                      <td className="px-4 py-3 text-[#A0A0A0]">{p.actors}</td>
                      <td className="px-4 py-3 text-[#00FF9C] font-bold">{p.successRate}</td>
                      <td className="px-4 py-3 text-[#A0A0A0]">{p.latency}</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-[#141414] border border-[#262626] px-2 py-0.5 text-[10px] text-[#A0A0A0]">
                          {p.bypass}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <span className="inline-flex items-center gap-1 text-[#00FF9C] text-[11px] font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>OPTIMAL</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Featured Production Actors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-base text-[#EAEAEA] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#00FF9C]" />
              <span>{lang === 'ar' ? 'أشهر الواجهات استخداماً' : 'Trending Scrapers'}</span>
            </h2>
            <button
              onClick={() => onNavigateTab('explorer')}
              className="text-xs font-mono text-[#00FF9C] hover:underline"
            >
              {lang === 'ar' ? 'عرض الكل' : 'View all'}
            </button>
          </div>

          <div className="space-y-3">
            {featuredApis.map((api) => (
              <div
                key={api.id}
                className="rounded-xl border border-[#222222] bg-[#090909] p-4 hover:border-[#00FF9C]/40 transition-all space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded bg-[#141414] border border-[#262626] px-1.5 py-0.2 text-[10px] font-mono text-[#00FF9C]">
                      {api.platform}
                    </span>
                    <h4 className="font-sans font-bold text-sm text-[#EAEAEA] mt-1">
                      {api.name}
                    </h4>
                  </div>
                  <Badge variant="success" size="xs">
                    {api.successRate}%
                  </Badge>
                </div>

                <p className="text-xs text-[#808080] line-clamp-2 leading-relaxed">
                  {api.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#181818] font-mono text-[11px]">
                  <span className="text-[#666666]">{api.runsCount.toLocaleString()} runs</span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onSelectApiForCode(api)}
                    >
                      {lang === 'ar' ? 'الكود' : 'SDK'}
                    </Button>
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => onSelectApiForPlayground(api)}
                      leftIcon={<Play className="h-3 w-3" />}
                    >
                      {lang === 'ar' ? 'تشغيل' : 'Run'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
