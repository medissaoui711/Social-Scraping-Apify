import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  Layers, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  Tag,
  Grid3X3,
  Table as TableIcon,
  Star,
  RotateCcw,
  Zap,
  TrendingUp,
  Globe,
  Filter,
  Scale,
  Rows3,
  LayoutGrid
} from 'lucide-react';
import { ScrapingApiItem } from '../types';
import { PLATFORM_CATEGORIES, POPULAR_TAGS } from '../data/categories';
import { useApp } from '../context/AppContext';
import { ApiCard } from './ApiCard';
import { ApiTableRow } from './ApiTableRow';
import { ApiCompareModal } from './ApiCompareModal';
import { QuickRunModal } from './QuickRunModal';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { EmptyState } from './ui/EmptyState';

interface ApiExplorerProps {
  apis?: ScrapingApiItem[];
  onSelectApiForPlayground?: (api: ScrapingApiItem) => void;
  onSelectApiForCode?: (api: ScrapingApiItem) => void;
  onInspectApi?: (api: ScrapingApiItem) => void;
  lang?: 'ar' | 'en';
}

export const ApiExplorer: React.FC<ApiExplorerProps> = (props) => {
  const { 
    state, 
    searchIndex, 
    selectForPlayground, 
    selectForCode, 
    setInspectedApi, 
    toggleFavorite 
  } = useApp();

  const lang = props.lang || state.lang;
  const onSelectApiForPlayground = props.onSelectApiForPlayground || selectForPlayground;
  const onSelectApiForCode = props.onSelectApiForCode || selectForCode;
  const onInspectApi = props.onInspectApi || setInspectedApi;

  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'speed' | 'success' | 'name'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [density, setDensity] = useState<'comfortable' | 'dense'>('comfortable');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = density === 'dense' ? 36 : 24;

  // Compare Mode State
  const [comparedApiIds, setComparedApiIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Quick Run Modal State
  const [quickRunApi, setQuickRunApi] = useState<ScrapingApiItem | null>(null);
  const [selectedSolutionPack, setSelectedSolutionPack] = useState<string>('all');

  // Debounce search query to keep input ultra responsive
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput);
      setCurrentPage(1);
    }, 120);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fast filtered search results using the In-Memory Search Index
  const filteredApis = useMemo(() => {
    let list = searchIndex.search(debouncedQuery, selectedPlatform, selectedTag, sortBy);
    if (showFavoritesOnly) {
      list = list.filter((item) => state.favorites.includes(item.id));
    }

    if (selectedSolutionPack === 'leads') {
      list = list.filter((item) => 
        item.platform === 'LinkedIn' || 
        item.tags.some(t => /lead|contact|email|profile/i.test(t)) ||
        /lead|contact|email|outreach/i.test(item.description)
      );
    } else if (selectedSolutionPack === 'viral') {
      list = list.filter((item) => 
        ['TikTok', 'Instagram', 'YouTube'].includes(item.platform) &&
        (item.tags.some(t => /reel|short|video|viral|download/i.test(t)) || /video|reel|short/i.test(item.description))
      );
    } else if (selectedSolutionPack === 'reputation') {
      list = list.filter((item) => 
        ['Twitter / X', 'Reddit', 'Threads'].includes(item.platform) ||
        item.tags.some(t => /comment|sentiment|mention|listen/i.test(t))
      );
    } else if (selectedSolutionPack === 'ecommerce') {
      list = list.filter((item) => 
        item.tags.some(t => /ecommerce|shop|price|product|review|store/i.test(t)) ||
        /price|product|amazon|shop/i.test(item.name)
      );
    } else if (selectedSolutionPack === 'cookieless') {
      list = list.filter((item) => 
        item.tags.some(t => /cookie-less|proxy|speed|fast/i.test(t)) || item.avgRunTimeSec < 2.0
      );
    }

    return list;
  }, [searchIndex, debouncedQuery, selectedPlatform, selectedTag, sortBy, showFavoritesOnly, state.favorites, selectedSolutionPack]);

  // Stable callbacks for memoized children
  const handleToggleFav = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const handleToggleCompare = useCallback((id: string) => {
    setComparedApiIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], id];
      }
      return [...prev, id];
    });
  }, []);

  const handleLaunch = useCallback((api: ScrapingApiItem) => {
    onSelectApiForPlayground(api);
  }, [onSelectApiForPlayground]);

  const handleCode = useCallback((api: ScrapingApiItem) => {
    onSelectApiForCode(api);
  }, [onSelectApiForCode]);

  const handleInspect = useCallback((api: ScrapingApiItem) => {
    onInspectApi(api);
  }, [onInspectApi]);

  const handleQuickRun = useCallback((api: ScrapingApiItem) => {
    setQuickRunApi(api);
  }, []);

  // Reset page when filter changes
  const handlePlatformChange = (p: string) => {
    setSelectedPlatform(p);
    setSelectedSolutionPack('all');
    setCurrentPage(1);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? '' : tag));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedPlatform('ALL');
    setSelectedTag('');
    setSearchInput('');
    setShowFavoritesOnly(false);
    setSelectedSolutionPack('all');
    setSortBy('popular');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredApis.length / itemsPerPage) || 1;
  const paginatedApis = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApis.slice(start, start + itemsPerPage);
  }, [filteredApis, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Top Hero / Stats Banner */}
      <div className="relative overflow-hidden rounded-xl border border-[#242424] bg-[#090909] p-5 sm:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-[#00FF9C]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {lang === 'ar' 
                  ? 'المكتبة الشاملة: 3,268 أداة سحب اجتماعية مفهرسة ومحسنة الأداء' 
                  : 'Production Hub: 3,268 Indexed Social Media Scraping APIs'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
              {lang === 'ar' ? 'مستكشف واجهات برمجة الاستخراج' : 'Social Data Scraping Hub'}
            </h1>
            <p className="max-w-2xl text-xs text-[#808080] sm:text-sm leading-relaxed font-sans">
              {lang === 'ar'
                ? 'استكشف وشغّل أكثر من 3,268 واجهة استخراج متخصصة لإنستغرام، يوتيوب، تيك توك، لينكد إن، فيسبوك وتويتر. تدوير ذكي للبروكسيات، وتوليد فوري للشيفرات البرمجية.'
                : 'Discover and execute 3,268+ specialized scraper actors for Instagram, YouTube, TikTok, LinkedIn, Facebook, Twitter and more with residential proxy shields.'}
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="rounded-lg border border-[#222222] bg-[#050505] p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-[#00FF9C]">3,268</div>
              <div className="text-[10px] text-[#707070]">{lang === 'ar' ? 'واجهة جاهزة' : 'Active Actors'}</div>
            </div>
            <div className="rounded-lg border border-[#222222] bg-[#050505] p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-[#00FF9C]">98.4%</div>
              <div className="text-[10px] text-[#707070]">{lang === 'ar' ? 'معدل النجاح' : 'Success Rate'}</div>
            </div>
            <div className="rounded-lg border border-[#222222] bg-[#050505] p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-[#FFB800]">0.8s</div>
              <div className="text-[10px] text-[#707070]">{lang === 'ar' ? 'متوسط السرعة' : 'Avg Latency'}</div>
            </div>
            <div className="rounded-lg border border-[#222222] bg-[#050505] p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-[#EAEAEA]">14,850+</div>
              <div className="text-[10px] text-[#707070]">{lang === 'ar' ? 'بروكسي سكني' : 'Residential IPs'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Category Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#808080] px-1 font-mono">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#00FF9C]" />
            <span>{lang === 'ar' ? 'تصفية حسب المنصة' : 'Filter by Platform'}</span>
          </span>
          <div className="flex items-center gap-2">
            {comparedApiIds.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition border border-[#00FF9C] bg-[#00FF9C]/15 text-[#00FF9C] font-bold animate-pulse"
              >
                <Scale className="h-3.5 w-3.5" />
                <span>{lang === 'ar' ? `مقارنة (${comparedApiIds.length})` : `Compare (${comparedApiIds.length})`}</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition ${
                showFavoritesOnly
                  ? 'border border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] font-bold'
                  : 'border border-[#222222] bg-[#050505] text-[#808080] hover:text-[#EAEAEA]'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${showFavoritesOnly ? 'fill-[#FFB800] text-[#FFB800]' : ''}`} />
              <span>{lang === 'ar' ? `المفضلة (${state.favorites.length})` : `Starred (${state.favorites.length})`}</span>
            </button>
            <span className="text-[#606060]">
              {filteredApis.length} {lang === 'ar' ? 'أداة متاحة' : 'actors found'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PLATFORM_CATEGORIES.map((cat) => {
            const isSelected = selectedPlatform === cat.id && !showFavoritesOnly;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setShowFavoritesOnly(false);
                  handlePlatformChange(cat.id);
                }}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? 'border border-[#00FF9C] bg-[#00FF9C] text-black font-bold shadow-sm'
                    : 'border border-[#222222] bg-[#090909] text-[#D1D1D1] hover:border-[#333333] hover:bg-[#111111]'
                }`}
              >
                <span>{lang === 'ar' ? cat.nameAr : cat.name}</span>
                <span className={`rounded px-1.5 py-0.2 font-mono text-[10px] ${
                  isSelected ? 'bg-black/20 text-black font-bold' : 'bg-[#181818] text-[#808080]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Curated Strategic Solution Packs */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#808080] mb-2 uppercase tracking-wider">
            <Zap className="h-3 w-3 text-[#00FF9C]" />
            <span>{lang === 'ar' ? 'حزم الحلول المتخصصة الجاهزة' : 'Curated Intelligence Solution Packs'}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'all', nameEn: 'All Actors', nameAr: 'جميع الأدوات', icon: '🌐' },
              { id: 'leads', nameEn: 'B2B Lead Gen', nameAr: 'استخراج العملاء B2B', icon: '💼' },
              { id: 'viral', nameEn: 'Viral Media & Reels', nameAr: 'المحتوى الفيروسي والريلز', icon: '🔥' },
              { id: 'reputation', nameEn: 'Brand Sentiment', nameAr: 'المشاعر وسمعة العلامات', icon: '💬' },
              { id: 'ecommerce', nameEn: 'E-commerce Intel', nameAr: 'التجارة وتحليل الأسعار', icon: '🛍️' },
              { id: 'cookieless', nameEn: 'Cookie-less Fast', nameAr: 'سحب سريع بدون كوكيز', icon: '⚡' }
            ].map(pack => {
              const active = selectedSolutionPack === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => {
                    setSelectedSolutionPack(pack.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition text-left rtl:text-right ${
                    active
                      ? 'border-[#00FF9C] bg-[#00FF9C]/15 text-[#00FF9C] font-bold shadow-sm'
                      : 'border-[#222222] bg-[#070707] text-[#909090] hover:border-[#333333] hover:text-[#EAEAEA]'
                  }`}
                >
                  <span>{pack.icon}</span>
                  <span className="truncate">{lang === 'ar' ? pack.nameAr : pack.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-4 space-y-3 shadow-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-[#707070]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث بالاسم، الوصف، الكلمات المفتاحية (مثل: reels, comments, email, leads, transcripts)...'
                  : 'Search by name, description, tags (e.g. reels, comments, email, leads, transcripts)...'
              }
              className="w-full rounded-lg border border-[#242424] bg-[#050505] pl-10 pr-8 rtl:pr-10 rtl:pl-8 py-2 text-xs sm:text-sm text-[#EAEAEA] placeholder-[#555555] font-mono focus:border-[#00FF9C] focus:outline-none transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-xs text-[#707070] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-[#242424] bg-[#050505] px-3 py-2 text-xs font-mono">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#00FF9C]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#D1D1D1] focus:outline-none cursor-pointer"
              >
                <option value="popular" className="bg-[#0A0A0A] text-[#D1D1D1]">{lang === 'ar' ? 'الأكثر استخداماً' : 'Most Popular'}</option>
                <option value="rating" className="bg-[#0A0A0A] text-[#D1D1D1]">{lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
                <option value="speed" className="bg-[#0A0A0A] text-[#D1D1D1]">{lang === 'ar' ? 'الأسرع زمناً' : 'Fastest Speed'}</option>
                <option value="success" className="bg-[#0A0A0A] text-[#D1D1D1]">{lang === 'ar' ? 'أعلى دقة نجاح' : 'Success Rate'}</option>
                <option value="name" className="bg-[#0A0A0A] text-[#D1D1D1]">{lang === 'ar' ? 'أبجدياً' : 'Name (A-Z)'}</option>
              </select>
            </div>

            {/* View Mode & Density Toggle */}
            <div className="flex items-center gap-1.5">
              {/* Density Toggle */}
              <div className="flex items-center rounded-lg border border-[#242424] bg-[#050505] p-1">
                <button
                  onClick={() => setDensity('comfortable')}
                  className={`rounded p-1.5 text-xs transition ${
                    density === 'comfortable' ? 'bg-[#00FF9C]/10 text-[#00FF9C]' : 'text-[#707070] hover:text-[#D1D1D1]'
                  }`}
                  title={lang === 'ar' ? 'عرض مريح' : 'Comfortable Density'}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDensity('dense')}
                  className={`rounded p-1.5 text-xs transition ${
                    density === 'dense' ? 'bg-[#00FF9C]/10 text-[#00FF9C]' : 'text-[#707070] hover:text-[#D1D1D1]'
                  }`}
                  title={lang === 'ar' ? 'عرض مدمج ومكثف' : 'Dense Density'}
                >
                  <Rows3 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg border border-[#242424] bg-[#050505] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded p-1.5 text-xs transition ${
                    viewMode === 'grid' ? 'bg-[#00FF9C]/10 text-[#00FF9C]' : 'text-[#707070] hover:text-[#D1D1D1]'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`rounded p-1.5 text-xs transition ${
                    viewMode === 'table' ? 'bg-[#00FF9C]/10 text-[#00FF9C]' : 'text-[#707070] hover:text-[#D1D1D1]'
                  }`}
                  title="Table View"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Tags Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1C1C1C]">
          <span className="text-[11px] text-[#707070] flex items-center gap-1 font-mono">
            <Tag className="h-3 w-3 text-[#00FF9C]" />
            <span>{lang === 'ar' ? 'الوسوم الشائعة:' : 'Popular Tags:'}</span>
          </span>
          {POPULAR_TAGS.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`rounded-md px-2.5 py-0.5 text-[11px] font-mono transition duration-150 ${
                  active
                    ? 'border border-[#00FF9C] bg-[#00FF9C] text-black font-bold'
                    : 'bg-[#050505] text-[#808080] hover:bg-[#141414] hover:text-[#EAEAEA] border border-[#1E1E1E]'
                }`}
              >
                {tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag('')}
              className="text-[11px] text-rose-400 hover:underline px-1 font-mono"
            >
              {lang === 'ar' ? 'إلغاء الوسم ✕' : 'Clear tag ✕'}
            </button>
          )}
        </div>
      </div>

      {/* Floating Compare Action Bar if items selected */}
      {comparedApiIds.length > 0 && (
        <div className="sticky top-20 z-30 flex items-center justify-between rounded-xl border border-[#00FF9C]/40 bg-[#0A0A0A]/95 p-3.5 shadow-2xl backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white">
                {lang === 'ar' ? `تم تحديد ${comparedApiIds.length} من أصل 3 واجهات للمقارنة` : `${comparedApiIds.length} of 3 scrapers selected for comparison`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => setComparedApiIds([])}
              className="text-[#808080]"
            >
              {lang === 'ar' ? 'إلغاء' : 'Clear'}
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => setIsCompareModalOpen(true)}
              leftIcon={<Scale className="h-3.5 w-3.5 fill-black" />}
              className="font-bold"
            >
              {lang === 'ar' ? 'فتح المقارنة الفورية ⚖️' : 'Compare Side-by-Side ⚖️'}
            </Button>
          </div>
        </div>
      )}

      {/* Memoized Grid View */}
      {viewMode === 'grid' && filteredApis.length > 0 && (
        <div className={`grid gap-4 ${
          density === 'dense' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {paginatedApis.map((api) => (
            <ApiCard
              key={api.id}
              api={api}
              isFav={state.favorites.includes(api.id)}
              isCompared={comparedApiIds.includes(api.id)}
              density={density}
              lang={lang}
              onToggleFav={handleToggleFav}
              onToggleCompare={handleToggleCompare}
              onLaunch={handleLaunch}
              onQuickRun={handleQuickRun}
              onCode={handleCode}
              onInspect={handleInspect}
            />
          ))}
        </div>
      )}

      {/* Memoized Table View */}
      {viewMode === 'table' && filteredApis.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[#242424] bg-[#090909] shadow-xl">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="border-b border-[#1E1E1E] bg-[#050505] text-[#808080] font-mono">
              <tr>
                <th className="px-4 py-3 font-semibold">{lang === 'ar' ? 'الواجهة / الأداة' : 'Scraper Actor'}</th>
                <th className="px-4 py-3 font-semibold">{lang === 'ar' ? 'المنصة' : 'Platform'}</th>
                <th className="px-4 py-3 font-semibold">{lang === 'ar' ? 'السعر' : 'Pricing'}</th>
                <th className="px-4 py-3 font-semibold">{lang === 'ar' ? 'التقييم' : 'Rating'}</th>
                <th className="px-4 py-3 font-semibold">{lang === 'ar' ? 'النجاح' : 'Success'}</th>
                <th className="px-4 py-3 font-semibold">{lang === 'ar' ? 'السرعة' : 'Speed'}</th>
                <th className="px-4 py-3 text-right rtl:text-left font-semibold">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {paginatedApis.map((api) => (
                <ApiTableRow
                  key={api.id}
                  api={api}
                  isFav={state.favorites.includes(api.id)}
                  lang={lang}
                  onToggleFav={handleToggleFav}
                  onLaunch={handleLaunch}
                  onQuickRun={handleQuickRun}
                  onCode={handleCode}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredApis.length === 0 && (
        <div className="rounded-xl border border-[#242424] bg-[#090909] py-16 px-4 text-center space-y-4 shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#262626] bg-[#050505] text-[#808080]">
            <Search className="h-6 w-6 text-[#707070]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-white font-mono">
              {lang === 'ar' ? 'لم نجد أي واجهة مطابقة لمعايير بحثك' : 'No matching scrapers found'}
            </h3>
            <p className="text-xs text-[#808080] max-w-sm mx-auto font-sans leading-relaxed">
              {lang === 'ar' 
                ? 'جرّب كتابة كلمات بحث مختلفة أو إلغاء بعض شروط التصفية والوسوم المحددة.'
                : 'Try searching with different keywords or clearing active tag and platform filters.'}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleResetFilters}
            leftIcon={<RotateCcw className="h-3.5 w-3.5 fill-black" />}
            className="font-mono text-xs font-bold"
          >
            {lang === 'ar' ? 'إعادة ضبط كل الفلاتر' : 'Reset all filters'}
          </Button>
        </div>
      )}

      {/* Pagination Bar */}
      {filteredApis.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#242424] bg-[#090909] px-4 py-3 text-xs text-[#808080] font-mono shadow-lg">
          <div>
            {lang === 'ar' ? (
              <>
                عرض <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> إلى{' '}
                <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filteredApis.length)}</span> من أصل{' '}
                <span className="font-bold text-[#00FF9C]">{filteredApis.length}</span> أداة
              </>
            ) : (
              <>
                Showing <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filteredApis.length)}</span> of{' '}
                <span className="font-bold text-[#00FF9C]">{filteredApis.length}</span> scrapers
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-[#242424] bg-[#050505] px-3 py-1.5 text-xs text-[#D1D1D1] disabled:opacity-30 hover:bg-[#141414] transition"
            >
              <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
              <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
            </button>

            <span className="px-3 text-[#EAEAEA] font-bold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg border border-[#242424] bg-[#050505] px-3 py-1.5 text-xs text-[#D1D1D1] disabled:opacity-30 hover:bg-[#141414] transition"
            >
              <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Compare Modal */}
      {isCompareModalOpen && (
        <ApiCompareModal
          apis={state.apis}
          comparedIds={comparedApiIds}
          onRemoveApi={(id) => setComparedApiIds((prev) => prev.filter((x) => x !== id))}
          onClearAll={() => setComparedApiIds([])}
          onClose={() => setIsCompareModalOpen(false)}
          onLaunch={handleLaunch}
          onCode={handleCode}
          onInspect={handleInspect}
          lang={lang}
        />
      )}

      {/* Quick Run Instant Runner Modal */}
      {quickRunApi && (
        <QuickRunModal
          api={quickRunApi}
          isOpen={Boolean(quickRunApi)}
          onClose={() => setQuickRunApi(null)}
          onOpenFullPlayground={(api) => {
            setQuickRunApi(null);
            handleLaunch(api);
          }}
          onOpenCodeStudio={(api) => {
            setQuickRunApi(null);
            handleCode(api);
          }}
          lang={lang}
        />
      )}
    </div>
  );
};
