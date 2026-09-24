import React from 'react';
import { Star, Play, Code2, Info, ExternalLink, Scale, Sliders } from 'lucide-react';
import { ScrapingApiItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface ApiCardProps {
  api: ScrapingApiItem;
  isFav: boolean;
  isCompared?: boolean;
  density?: 'dense' | 'comfortable';
  lang: 'ar' | 'en';
  onToggleFav: (id: string) => void;
  onToggleCompare?: (id: string) => void;
  onLaunch: (api: ScrapingApiItem) => void;
  onQuickRun?: (api: ScrapingApiItem) => void;
  onCode: (api: ScrapingApiItem) => void;
  onInspect: (api: ScrapingApiItem) => void;
}

export const ApiCard = React.memo<ApiCardProps>(({
  api,
  isFav,
  isCompared = false,
  density = 'comfortable',
  lang,
  onToggleFav,
  onToggleCompare,
  onLaunch,
  onQuickRun,
  onCode,
  onInspect
}) => {
  const isDense = density === 'dense';

  return (
    <div className={`group relative flex flex-col justify-between rounded-xl border transition-all duration-150 ${
      isCompared 
        ? 'border-[#00FF9C] bg-[#0A120E] shadow-lg shadow-[#00FF9C]/10' 
        : 'border-[#242424] bg-[#090909] hover:border-[#00FF9C]/40 hover:bg-[#0D0D0D] hover:shadow-xl hover:shadow-black/70'
    } ${isDense ? 'p-3.5 space-y-2' : 'p-4 sm:p-5 space-y-3'}`}>
      <div className={isDense ? 'space-y-2' : 'space-y-3'}>
        {/* Header Badges & Rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="platform" size="xs">
              {api.platform}
            </Badge>
            <Badge variant="neutral" size="xs">
              {api.pricing}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(api.id)}
                className={`p-1 rounded transition text-xs flex items-center gap-1 min-h-[28px] min-w-[28px] justify-center ${
                  isCompared 
                    ? 'text-[#00FF9C] bg-[#00FF9C]/10 border border-[#00FF9C]/30 font-bold' 
                    : 'text-[#808080] hover:text-[#00FF9C]'
                }`}
                title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              >
                <Scale className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() => onToggleFav(api.id)}
              className="text-[#808080] hover:text-[#FFB800] transition p-1 min-h-[28px] min-w-[28px] flex items-center justify-center"
              title={isFav ? 'Remove Favorite' : 'Add to Favorites'}
            >
              <Star className={`h-3.5 w-3.5 ${isFav ? 'fill-[#FFB800] text-[#FFB800]' : ''}`} />
            </button>
            <Badge variant="warning" size="xs" className="font-bold">
              ★ {api.rating}
            </Badge>
          </div>
        </div>

        {/* Title & Actor ID */}
        <div>
          <h3 className={`font-bold text-[#EAEAEA] group-hover:text-[#00FF9C] leading-snug font-sans transition-colors ${
            isDense ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'
          }`}>
            {api.name}
          </h3>
          <div className="mt-0.5 font-mono text-[11px] text-[#808080] truncate">
            {api.actorId}
          </div>
        </div>

        {/* Description (truncated tighter in dense mode) */}
        {!isDense && (
          <p className="text-xs text-[#B0B0B0] line-clamp-2 leading-relaxed">
            {api.description}
          </p>
        )}

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1 font-mono">
          {api.tags.slice(0, isDense ? 2 : 3).map((tag, idx) => (
            <span
              key={idx}
              className="rounded bg-[#050505] px-2 py-0.5 text-[10px] text-[#808080] border border-[#1E1E1E]"
            >
              {tag}
            </span>
          ))}
          {api.tags.length > (isDense ? 2 : 3) && (
            <span className="rounded bg-[#050505] px-1.5 py-0.5 text-[10px] text-[#808080]">
              +{api.tags.length - (isDense ? 2 : 3)}
            </span>
          )}
        </div>

        {/* Performance Telemetry Bar */}
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#050505] p-2 text-center text-[10px] text-[#808080] border border-[#1C1C1C] font-mono">
          <div>
            <div className="font-bold text-[#EAEAEA]">
              {(api.runsCount / 1000).toFixed(1)}k
            </div>
            <div className="text-[#808080] text-[9px]">{lang === 'ar' ? 'تشغيل' : 'Runs'}</div>
          </div>
          <div>
            <div className="font-bold text-[#00FF9C]">
              {api.successRate}%
            </div>
            <div className="text-[#808080] text-[9px]">{lang === 'ar' ? 'نجاح' : 'Success'}</div>
          </div>
          <div>
            <div className="font-bold text-[#FFB800]">
              ~{api.avgRunTimeSec}s
            </div>
            <div className="text-[#808080] text-[9px]">{lang === 'ar' ? 'سرعة' : 'Speed'}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex items-center gap-1.5 border-t border-[#1C1C1C] ${isDense ? 'mt-2.5 pt-2' : 'mt-4 pt-3'}`}>
        {onQuickRun ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onQuickRun(api)}
            leftIcon={<Play className="h-3.5 w-3.5 fill-black" />}
            className="flex-1 font-bold text-xs"
            title={lang === 'ar' ? 'تشغيل سريع ومباشر' : 'Instant Quick Run'}
          >
            {lang === 'ar' ? 'تشغيل سريع' : 'Quick Run'}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onLaunch(api)}
            leftIcon={<Play className="h-3.5 w-3.5 fill-black" />}
            className="flex-1 font-bold text-xs"
          >
            {lang === 'ar' ? 'تشغيل' : 'Launch'}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onLaunch(api)}
          className="px-2"
          title={lang === 'ar' ? 'فتح في الاستوديو' : 'Open in Studio'}
        >
          <Sliders className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onCode(api)}
          className="px-2"
          title={lang === 'ar' ? 'توليد الكود' : 'Generate Code'}
        >
          <Code2 className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onInspect(api)}
          className="px-2"
          title={lang === 'ar' ? 'تفاصيل المعاملات' : 'Inspect Schema'}
        >
          <Info className="h-4 w-4" />
        </Button>

        <a
          href={api.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-[#242424] bg-transparent p-2 text-[#808080] transition hover:border-[#00FF9C]/40 hover:text-[#00FF9C] min-h-[32px] min-w-[32px]"
          title="Apify Actor URL"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.api.id === nextProps.api.id &&
    prevProps.isFav === nextProps.isFav &&
    prevProps.isCompared === nextProps.isCompared &&
    prevProps.density === nextProps.density &&
    prevProps.lang === nextProps.lang
  );
});

ApiCard.displayName = 'ApiCard';
