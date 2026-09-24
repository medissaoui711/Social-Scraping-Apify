import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Play, 
  Code2, 
  Star, 
  ShieldCheck, 
  Copy, 
  Check, 
  Server, 
  Clock, 
  Terminal,
  FileJson
} from 'lucide-react';
import { ScrapingApiItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface ApiDetailModalProps {
  api: ScrapingApiItem | null;
  onClose: () => void;
  onSelectForPlayground: (api: ScrapingApiItem) => void;
  onSelectForCode: (api: ScrapingApiItem) => void;
  lang: 'ar' | 'en';
}

export const ApiDetailModal: React.FC<ApiDetailModalProps> = ({
  api,
  onClose,
  onSelectForPlayground,
  onSelectForCode,
  lang
}) => {
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!api) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(api.defaultInput, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-[#262626] bg-[#0A0A0A] shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1E1E1E] p-5 bg-[#050505]">
          <div className="space-y-1 pr-6 rtl:pr-0 rtl:pl-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="platform" size="sm">
                {api.platform}
              </Badge>
              <Badge variant="neutral" size="sm">
                {api.pricing}
              </Badge>
              <Badge variant="warning" size="sm" className="font-bold">
                <Star className="h-3 w-3 fill-[#FFB800]" />
                <span>{api.rating}</span>
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-[#EAEAEA] leading-tight mt-1 font-mono">
              {api.name}
            </h2>
            <div className="font-mono text-xs text-[#707070]">
              {api.actorId}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#808080] hover:bg-[#141414] hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2 font-mono">
              {lang === 'ar' ? 'الوصف والتفاصيل التقنية' : 'Description & Scope'}
            </h4>
            <p className="text-xs sm:text-sm text-[#D1D1D1] leading-relaxed bg-[#050505] p-4 rounded-lg border border-[#1E1E1E]">
              {api.description}
            </p>
          </div>

          {/* Performance & Reliability Grid */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2 font-mono">
              {lang === 'ar' ? 'مؤشرات الكفاءة والتشغيل' : 'Performance & Reliability'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-[#707070]">
                  <Terminal className="h-3.5 w-3.5 text-[#00FF9C]" />
                  <span>{lang === 'ar' ? 'مرات التشغيل' : 'Runs'}</span>
                </div>
                <div className="mt-1 text-base font-bold text-white">
                  {api.runsCount.toLocaleString()}
                </div>
              </div>

              <div className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-[#707070]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#00FF9C]" />
                  <span>{lang === 'ar' ? 'نسبة النجاح' : 'Success Rate'}</span>
                </div>
                <div className="mt-1 text-base font-bold text-[#00FF9C]">
                  {api.successRate}%
                </div>
              </div>

              <div className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-[#707070]">
                  <Clock className="h-3.5 w-3.5 text-[#FFB800]" />
                  <span>{lang === 'ar' ? 'متوسط السرعة' : 'Avg Latency'}</span>
                </div>
                <div className="mt-1 text-base font-bold text-[#FFB800]">
                  {api.avgRunTimeSec}s
                </div>
              </div>

              <div className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-[#707070]">
                  <Server className="h-3.5 w-3.5 text-[#00FF9C]" />
                  <span>{lang === 'ar' ? 'نوع البروكسي' : 'Proxy Mode'}</span>
                </div>
                <div className="mt-1 text-xs font-bold text-[#EAEAEA]">
                  Residential Node
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#808080] mb-2 font-mono">
              {lang === 'ar' ? 'القدرات والميزات المدعومة' : 'Capabilities & Features'}
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {api.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="rounded border border-[#1E1E1E] bg-[#050505] px-2.5 py-1 text-xs text-[#909090]"
                >
                  ⚡ {t}
                </span>
              ))}
            </div>
          </div>

          {/* Default Input JSON Schema */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#808080] flex items-center gap-1.5 font-mono">
                <FileJson className="h-3.5 w-3.5 text-[#00FF9C]" />
                <span>{lang === 'ar' ? 'مخطط مدخلات الـ JSON الافتراضي' : 'Default Input JSON Schema'}</span>
              </h4>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleCopySchema}
                leftIcon={copiedSchema ? <Check className="h-3 w-3 text-[#00FF9C]" /> : <Copy className="h-3 w-3" />}
              >
                {copiedSchema ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ المخطط' : 'Copy JSON')}
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-[#1E1E1E] bg-[#050505] p-3.5 text-xs font-mono text-[#00FF9C]">
              {JSON.stringify(api.defaultInput, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1E1E1E] bg-[#050505] p-4 font-mono">
          <a
            href={api.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#808080] hover:text-[#00FF9C] transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'فتح صفحة الأداة الرسمية' : 'Open Actor on Apify Store'}</span>
          </a>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onSelectForCode(api);
                onClose();
              }}
              leftIcon={<Code2 className="h-3.5 w-3.5 text-[#00FF9C]" />}
            >
              {lang === 'ar' ? 'توليد الكود' : 'Generate Code'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onSelectForPlayground(api);
                onClose();
              }}
              leftIcon={<Play className="h-3.5 w-3.5 fill-black" />}
            >
              {lang === 'ar' ? 'تشغيل في الاستوديو' : 'Launch in Playground'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
