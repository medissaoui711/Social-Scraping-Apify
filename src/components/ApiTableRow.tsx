import React from 'react';
import { Star, Code2, Play } from 'lucide-react';
import { ScrapingApiItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface ApiTableRowProps {
  api: ScrapingApiItem;
  isFav: boolean;
  lang: 'ar' | 'en';
  onToggleFav: (id: string) => void;
  onLaunch: (api: ScrapingApiItem) => void;
  onQuickRun?: (api: ScrapingApiItem) => void;
  onCode: (api: ScrapingApiItem) => void;
}

export const ApiTableRow = React.memo<ApiTableRowProps>(({
  api,
  isFav,
  lang,
  onToggleFav,
  onLaunch,
  onQuickRun,
  onCode
}) => {
  return (
    <tr className="hover:bg-[#0E0E0E] transition-colors border-b border-[#181818]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleFav(api.id)}
            className="text-[#606060] hover:text-[#FFB800] transition"
            title={isFav ? 'Remove Favorite' : 'Add to Favorites'}
          >
            <Star className={`h-3.5 w-3.5 ${isFav ? 'fill-[#FFB800] text-[#FFB800]' : ''}`} />
          </button>
          <div>
            <div className="font-semibold text-[#EAEAEA] hover:text-[#00FF9C] transition-colors cursor-pointer" onClick={() => onLaunch(api)}>
              {api.name}
            </div>
            <div className="font-mono text-[10px] text-[#707070]">{api.actorId}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="platform" size="xs">
          {api.platform}
        </Badge>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-[#B0B0B0]">{api.pricing}</td>
      <td className="px-4 py-3 font-mono text-xs font-bold text-[#FFB800]">★ {api.rating}</td>
      <td className="px-4 py-3 font-mono text-xs text-[#00FF9C]">{api.successRate}%</td>
      <td className="px-4 py-3 font-mono text-xs text-[#808080]">~{api.avgRunTimeSec}s</td>
      <td className="px-4 py-3 text-right rtl:text-left">
        <div className="inline-flex items-center gap-1.5">
          {onQuickRun && (
            <Button
              variant="primary"
              size="xs"
              onClick={() => onQuickRun(api)}
              leftIcon={<Play className="h-3 w-3 fill-black" />}
            >
              {lang === 'ar' ? 'تشغيل سريع' : 'Quick Run'}
            </Button>
          )}
          <Button
            variant="outline"
            size="xs"
            onClick={() => onLaunch(api)}
            className="p-1"
            title={lang === 'ar' ? 'فتح في الاستوديو' : 'Studio'}
          >
            <Play className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onCode(api)}
            className="p-1"
            title="Code"
          >
            <Code2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}, (prev, next) => {
  return (
    prev.api.id === next.api.id &&
    prev.isFav === next.isFav &&
    prev.lang === next.lang
  );
});

ApiTableRow.displayName = 'ApiTableRow';
