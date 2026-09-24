import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Globe, 
  Server, 
  CheckCircle2, 
  Play, 
  Star,
  TrendingUp,
  Layers,
  Cpu,
  Radio,
  Wifi,
  HardDrive
} from 'lucide-react';
import { ScrapingApiItem } from '../types';
import { PLATFORM_CATEGORIES } from '../data/categories';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { StatusDot } from './ui/StatusDot';

interface TelemetryDashboardProps {
  apis: ScrapingApiItem[];
  onSelectForPlayground: (api: ScrapingApiItem) => void;
  lang: 'ar' | 'en';
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  apis,
  onSelectForPlayground,
  lang
}) => {
  const topActors = [...apis]
    .sort((a, b) => (b.runsCount || 0) - (a.runsCount || 0))
    .slice(0, 6);

  const totalRuns = apis.reduce((acc, curr) => acc + (curr.runsCount || 0), 0);

  const proxyNodes = [
    { region: 'North America (US East & West)', ipCount: '6,420 IPs', latency: '24ms', load: '38%', status: 'Healthy' },
    { region: 'Middle East & GCC (UAE & KSA)', ipCount: '3,180 IPs', latency: '32ms', load: '44%', status: 'Healthy' },
    { region: 'Europe (Frankfurt & London)', ipCount: '3,890 IPs', latency: '28ms', load: '29%', status: 'Healthy' },
    { region: 'Asia Pacific (Tokyo & Singapore)', ipCount: '2,360 IPs', latency: '45ms', load: '52%', status: 'Healthy' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner / Hero */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00FF9C] font-mono">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>{lang === 'ar' ? 'المقاييس الحية وغرفة عمليات الشبكة (NOC)' : 'Real-Time NOC Telemetry & Node Health'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
              {lang === 'ar' ? 'مؤشرات الأداء ومصفوفة البروكسيات العالمية' : 'Platform Telemetry & Global Proxy Mesh'}
            </h2>
            <p className="text-xs text-[#808080] font-sans leading-relaxed max-w-2xl">
              {lang === 'ar'
                ? 'مراقبة حية لمعدلات النجاح، واستجابة السيرفرات، وتوزيع واجهات الاستخراج الـ 3,268 عبر جميع المنصات الاجتماعية.'
                : 'Real-time telemetry monitoring 3,268 active scraping actors, success rates, latency distributions, and proxy health.'}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div className="rounded-lg border border-[#242424] bg-[#050505] p-3 text-center min-w-[110px]">
              <div className="text-[10px] text-[#808080] uppercase">{lang === 'ar' ? 'معدل النجاح الإجمالي' : 'Global Success'}</div>
              <div className="text-base sm:text-lg font-bold text-[#00FF9C] mt-0.5">98.4%</div>
            </div>
            <div className="rounded-lg border border-[#242424] bg-[#050505] p-3 text-center min-w-[110px]">
              <div className="text-[10px] text-[#808080] uppercase">{lang === 'ar' ? 'نسبة الجاهزية' : 'SLA Uptime'}</div>
              <div className="text-base sm:text-lg font-bold text-[#EAEAEA] mt-0.5">99.98%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="rounded-xl border border-[#242424] bg-[#090909] p-4 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-[#808080]">
            <span className="text-xs font-sans">{lang === 'ar' ? 'إجمالي الواجهات المفهرسة' : 'Indexed Scrapers'}</span>
            <Layers className="h-4 w-4 text-[#00FF9C]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">3,268</div>
          <div className="text-[10px] text-[#00FF9C]">14 Major Social Platforms</div>
        </div>

        <div className="rounded-xl border border-[#242424] bg-[#090909] p-4 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-[#808080]">
            <span className="text-xs font-sans">{lang === 'ar' ? 'إجمالي عمليات الاستخراج' : 'Cumulative Executions'}</span>
            <TrendingUp className="h-4 w-4 text-[#00FF9C]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#00FF9C]">
            {(totalRuns / 1000000).toFixed(2)}M+
          </div>
          <div className="text-[10px] text-[#808080]">Across all production nodes</div>
        </div>

        <div className="rounded-xl border border-[#242424] bg-[#090909] p-4 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-[#808080]">
            <span className="text-xs font-sans">{lang === 'ar' ? 'عناوين IP السكنية النشطة' : 'Active Residential IPs'}</span>
            <Globe className="h-4 w-4 text-[#00FF9C]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">14,850+</div>
          <div className="text-[10px] text-[#00FF9C]">Zero-block rotating pool</div>
        </div>

        <div className="rounded-xl border border-[#242424] bg-[#090909] p-4 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-[#808080]">
            <span className="text-xs font-sans">{lang === 'ar' ? 'متوسط سرعة الاستجابة' : 'Average Latency'}</span>
            <Zap className="h-4 w-4 text-[#FFB800]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#FFB800]">0.82s</div>
          <div className="text-[10px] text-[#808080]">High concurrency optimized</div>
        </div>
      </div>

      {/* Main Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Platform Breakdown (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm font-mono">
              <BarChart3 className="h-4 w-4 text-[#00FF9C]" />
              <span>{lang === 'ar' ? 'توزيع واجهات الاستخراج حسب المنصة' : 'Platform Scraping APIs Distribution'}</span>
            </div>
            <Badge variant="neutral" size="xs">
              3,268 Total
            </Badge>
          </div>

          <div className="space-y-3">
            {PLATFORM_CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => {
              const percent = ((cat.count / 3268) * 100).toFixed(1);
              return (
                <div key={cat.id} className="space-y-1 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#EAEAEA] font-sans">
                      {lang === 'ar' ? cat.nameAr : cat.name}
                    </span>
                    <div className="text-[#808080]">
                      <span className="text-white font-bold">{cat.count}</span> ({percent}%)
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded bg-[#181818]">
                    <div
                      className="h-full rounded transition-all duration-500 bg-[#00FF9C]"
                      style={{
                        width: `${percent}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Proxy Mesh Health (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 shadow-xl font-mono">
          <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Server className="h-4 w-4 text-[#00FF9C]" />
              <span>{lang === 'ar' ? 'حالة مصفوفة البروكسيات العالمية' : 'Global Proxy Clusters'}</span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-[#00FF9C]">
              <StatusDot status="active" size="sm" />
              <span>All Active</span>
            </span>
          </div>

          <div className="space-y-3">
            {proxyNodes.map((node, i) => (
              <div
                key={i}
                className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-3.5 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white font-sans flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#00FF9C] inline-block" />
                    <span>{node.region}</span>
                  </div>
                  <div className="text-[11px] text-[#808080]">{node.ipCount} • Load: {node.load}</div>
                </div>
                <div className="text-right rtl:text-left space-y-1">
                  <Badge variant="success" size="xs">
                    {node.status}
                  </Badge>
                  <div className="text-[10px] text-[#808080]">{node.latency}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-[#00FF9C]/5 border border-[#00FF9C]/20 p-3 text-[11px] text-[#B0B0B0] font-sans">
            🛡️ {lang === 'ar' 
              ? 'تتم معالجة الطلبات عبر بروتوكول TLS 1.3 وحماية مضادة لبصمات المتصفح لضمان عدم التعرض للحظر بنسبة 99.9%.'
              : 'Fingerprint spoofing and TLS 1.3 evasion headers are automatically injected to prevent IP blocking.'}
          </div>
        </div>
      </div>

      {/* Top Popular Actors Leaderboard */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm font-mono">
            <Star className="h-4 w-4 text-[#FFB800]" />
            <span>{lang === 'ar' ? 'الواجهات الأكثر تشغيلاً في المنظومة' : 'Top Performing Scraper Actors'}</span>
          </div>
          <span className="text-xs text-[#808080] font-sans">{lang === 'ar' ? 'مرتبة حسب مرات الاستدعاء' : 'Ranked by cumulative calls'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topActors.map((actor) => (
            <div
              key={actor.id}
              className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-3.5 flex flex-col justify-between space-y-2 hover:border-[#00FF9C]/40 transition duration-150"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <Badge variant="platform" size="xs">
                    {actor.platform}
                  </Badge>
                  <span className="text-[#00FF9C] font-bold">
                    {(actor.runsCount / 1000).toFixed(1)}k runs
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white line-clamp-1 font-sans">{actor.name}</h4>
                <div className="font-mono text-[10px] text-[#808080]">{actor.actorId}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C] font-mono">
                <div className="flex items-center gap-1 text-[11px] text-[#FFB800] font-bold">
                  <Star className="h-3 w-3 fill-[#FFB800]" />
                  <span>{actor.rating}</span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onSelectForPlayground(actor)}
                  className="text-[#00FF9C] hover:text-white"
                  leftIcon={<Play className="h-3 w-3" />}
                >
                  {lang === 'ar' ? 'تشغيل' : 'Launch'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

