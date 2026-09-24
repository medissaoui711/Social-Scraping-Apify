import React from 'react';
import { 
  Scale, 
  X, 
  Check, 
  ExternalLink, 
  Zap, 
  Star, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Play, 
  Code2, 
  Info,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ScrapingApiItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface ApiCompareModalProps {
  apis: ScrapingApiItem[];
  comparedIds: string[];
  onRemoveApi: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  onLaunch: (api: ScrapingApiItem) => void;
  onCode: (api: ScrapingApiItem) => void;
  onInspect: (api: ScrapingApiItem) => void;
  lang: 'ar' | 'en';
}

export const ApiCompareModal: React.FC<ApiCompareModalProps> = ({
  apis,
  comparedIds,
  onRemoveApi,
  onClearAll,
  onClose,
  onLaunch,
  onCode,
  onInspect,
  lang,
}) => {
  const selectedApis = apis.filter((a) => comparedIds.includes(a.id));

  if (selectedApis.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div 
        className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[#262626] bg-[#0A0A0A] shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1E1E1E] px-6 py-4 bg-[#080808]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00FF9C]/30 bg-[#00FF9C]/10 text-[#00FF9C]">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                <span>{lang === 'ar' ? 'مقارنة واجهات الاستخراج المباشرة' : 'Side-by-Side Scraper Comparison'}</span>
                <span className="rounded bg-[#141414] px-2 py-0.5 text-xs text-[#00FF9C] border border-[#242424]">
                  {selectedApis.length} / 3
                </span>
              </h2>
              <p className="text-xs text-[#707070] font-sans">
                {lang === 'ar' 
                  ? 'قارن بين الأداء، معدلات النجاح، سرعة الاستجابة، ونماذج التسعير لاختيار الأداة المثالية.'
                  : 'Evaluate latency, success rates, supported payload inputs, and pricing models side-by-side.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={onClearAll}
              className="text-[#808080] hover:text-rose-400 hover:border-rose-500/40"
            >
              {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg border border-[#222222] bg-[#050505] p-2 text-[#808080] hover:text-white hover:border-[#333333] transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-x-auto overflow-y-auto p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[640px]">
            {selectedApis.map((api) => {
              const runsK = (api.runsCount / 1000).toFixed(1);
              const defaultKeys = Object.keys(api.defaultInput || {});

              return (
                <div
                  key={api.id}
                  className="rounded-xl border border-[#222222] bg-[#050505] p-4 flex flex-col justify-between space-y-4 hover:border-[#00FF9C]/40 transition shadow-lg relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveApi(api.id)}
                    className="absolute top-3 right-3 rtl:left-3 rtl:right-auto text-[#666666] hover:text-rose-400 p-1"
                    title="Remove from comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center gap-1.5">
                      <Badge variant="platform" size="xs">
                        {api.platform}
                      </Badge>
                      <Badge variant="neutral" size="xs">
                        {api.pricing}
                      </Badge>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans line-clamp-1 pr-6 rtl:pl-6 rtl:pr-0">
                        {api.name}
                      </h3>
                      <div className="font-mono text-[11px] text-[#707070] truncate">
                        {api.actorId}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 text-center font-mono">
                      <div className="rounded border border-[#1C1C1C] bg-[#0A0A0A] p-2">
                        <div className="text-[10px] text-[#707070]">{lang === 'ar' ? 'معدل النجاح' : 'Success Rate'}</div>
                        <div className="text-sm font-bold text-[#00FF9C]">{api.successRate}%</div>
                      </div>
                      <div className="rounded border border-[#1C1C1C] bg-[#0A0A0A] p-2">
                        <div className="text-[10px] text-[#707070]">{lang === 'ar' ? 'السرعة المتوقعة' : 'Avg Latency'}</div>
                        <div className="text-sm font-bold text-[#FFB800]">~{api.avgRunTimeSec}s</div>
                      </div>
                      <div className="rounded border border-[#1C1C1C] bg-[#0A0A0A] p-2">
                        <div className="text-[10px] text-[#707070]">{lang === 'ar' ? 'التقييم' : 'Rating'}</div>
                        <div className="text-sm font-bold text-[#EAEAEA]">★ {api.rating}</div>
                      </div>
                      <div className="rounded border border-[#1C1C1C] bg-[#0A0A0A] p-2">
                        <div className="text-[10px] text-[#707070]">{lang === 'ar' ? 'إجمالي التشغيل' : 'Total Runs'}</div>
                        <div className="text-sm font-bold text-[#D1D1D1]">{runsK}k</div>
                      </div>
                    </div>

                    {/* Features & Supported Inputs */}
                    <div className="space-y-2 pt-2 border-t border-[#1C1C1C]">
                      <div className="text-[11px] font-mono font-semibold text-[#808080] uppercase">
                        {lang === 'ar' ? 'المدخلات المدعومة (Parameters):' : 'Supported Parameters:'}
                      </div>
                      <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                        {defaultKeys.length > 0 ? (
                          defaultKeys.map((key) => (
                            <span
                              key={key}
                              className="rounded bg-[#111111] px-1.5 py-0.5 text-[#00FF9C] border border-[#202020]"
                            >
                              {key}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#606060] text-[10px]">Standard Parameters</span>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono font-semibold text-[#808080] uppercase">
                        {lang === 'ar' ? 'الوسوم (Tags):' : 'Tags:'}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {api.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-[#080808] px-1.5 py-0.5 text-[10px] text-[#808080] border border-[#1C1C1C]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#808080] line-clamp-3 leading-relaxed font-sans pt-1">
                      {api.description}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 pt-3 border-t border-[#1C1C1C]">
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => {
                        onLaunch(api);
                        onClose();
                      }}
                      leftIcon={<Play className="h-3 w-3 fill-black" />}
                      className="flex-1 font-bold"
                    >
                      {lang === 'ar' ? 'تشغيل' : 'Launch'}
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        onCode(api);
                        onClose();
                      }}
                      className="px-2"
                      title="Code Studio"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        onInspect(api);
                        onClose();
                      }}
                      className="px-2"
                      title="Inspect Schema"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1E1E1E] bg-[#080808] px-6 py-3 text-xs font-mono text-[#707070]">
          <div>OSIRIS-X Smart Matrix Engine</div>
          <div className="text-[11px] text-[#00FF9C]">
            {lang === 'ar' ? 'تمت المقارنة بالاعتماد على بيانات التيليميتري الحية' : 'Compared against live verified actor telemetry'}
          </div>
        </div>
      </div>
    </div>
  );
};
