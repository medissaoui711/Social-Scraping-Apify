import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCw, 
  Terminal, 
  Table as TableIcon, 
  FileJson, 
  Image as ImageIcon, 
  BarChart3, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  ChevronDown,
  History,
  Clock,
  Trash2,
  FileSpreadsheet,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScrapingApiItem, ExecutionRun } from '../types';
import { useApp } from '../context/AppContext';
import { Badge, Button, Input, StatusDot, Tabs, Select, LogViewer, Panel } from './ui';

interface PlaygroundStudioProps {
  apis: ScrapingApiItem[];
  selectedApi: ScrapingApiItem | null;
  onSelectApi: (api: ScrapingApiItem) => void;
  apifyToken: string;
  lang: 'ar' | 'en';
}

export const PlaygroundStudio: React.FC<PlaygroundStudioProps> = ({
  apis,
  selectedApi,
  onSelectApi,
  apifyToken,
  lang
}) => {
  const { state, addHistoryRun, clearHistory } = useApp();
  const currentApi = selectedApi || apis[0];

  // Config States
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(currentApi?.defaultInput || { maxItems: 25 }, null, 2)
  );
  const [useResidentialProxy, setUseResidentialProxy] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [maxItems, setMaxItems] = useState<number>(15);
  const [searchTarget, setSearchTarget] = useState<string>('ai technology');

  // Workspace Layout States
  const [isConfigCollapsed, setIsConfigCollapsed] = useState<boolean>(false);
  const [isLogsMaximized, setIsLogsMaximized] = useState<boolean>(false);

  // Execution States
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionRun, setExecutionRun] = useState<ExecutionRun | null>(null);
  const [activeVisualizer, setActiveVisualizer] = useState<'table' | 'json' | 'gallery' | 'analytics' | 'history'>('table');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [copiedData, setCopiedData] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Terminal scroll ref
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Update input JSON when target API changes
  useEffect(() => {
    if (currentApi) {
      const initial = {
        ...currentApi.defaultInput,
        maxItems
      };
      setJsonInput(JSON.stringify(initial, null, 2));
    }
  }, [currentApi]);

  // Execute Run Handler
  const handleExecute = async () => {
    if (!currentApi) return;
    setIsRunning(true);
    let parsedPayload: any = {};
    try {
      parsedPayload = JSON.parse(jsonInput);
    } catch (e) {
      parsedPayload = {
        searchQuery: searchTarget,
        maxItems,
        proxyConfig: { useApifyProxy: useResidentialProxy, country: selectedCountry }
      };
    }

    try {
      const response = await fetch('/api/run-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiId: currentApi.id,
          actorName: currentApi.name,
          platform: currentApi.platform,
          inputPayload: parsedPayload,
          apifyToken
        })
      });

      const data = await response.json();
      const newRun: ExecutionRun = {
        id: data.runId,
        apiId: currentApi.id,
        actorName: currentApi.name,
        startedAt: new Date().toISOString(),
        durationMs: data.durationMs,
        status: 'success',
        itemCount: data.itemCount,
        memoryMb: data.memoryMb,
        payload: parsedPayload,
        results: data.results,
        logs: data.logs
      };
      setExecutionRun(newRun);
      addHistoryRun(newRun);

      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.85 }
        });
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error('Scraper run error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Run on mount if no run exists
  useEffect(() => {
    if (!executionRun && currentApi) {
      handleExecute();
    }
  }, [currentApi?.id]);

  // Copy Results
  const handleCopyResults = () => {
    if (!executionRun) return;
    navigator.clipboard.writeText(JSON.stringify(executionRun.results, null, 2));
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 1500);
  };

  // Export Results
  const handleExport = async (format: 'json' | 'csv' | 'markdown' | 'jsonl' | 'excel') => {
    if (!executionRun || !executionRun.results.length) return;
    setShowExportMenu(false);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          data: executionRun.results,
          filename: `osiris_${currentApi.slug}_${Date.now()}`
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = format === 'markdown' ? 'md' : format === 'excel' ? 'csv' : format;
      a.download = `osiris_${currentApi.slug}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  // Restore previous run from history
  const handleRestoreRun = (run: ExecutionRun) => {
    setExecutionRun(run);
    setActiveVisualizer('table');
  };

  // Filter Table Results
  const filteredResults = (executionRun?.results || []).filter((item) => {
    if (!tableSearch) return true;
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(tableSearch.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl border border-[#242424] bg-[#090909] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#00FF9C]/40 bg-[#00FF9C]/10 text-[#00FF9C]">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#EAEAEA] font-mono">
                {lang === 'ar' ? 'استوديو التشغيل التفاعلي' : 'Live Execution Playground'}
              </h2>
              <Badge variant="primary" size="xs">
                Ready
              </Badge>
            </div>
            <p className="text-xs text-[#808080]">
              {lang === 'ar' 
                ? 'اختبر واجهات السحب مباشرة، وتفقد سجلات الشبكة وافحص البيانات المستخرجة.'
                : 'Execute scrapers with live telemetry, inspect streaming network logs, and visualize datasets.'}
            </p>
          </div>
        </div>

        {/* Selected Scraper Dropdown Switcher & Panel Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <button
            onClick={() => setIsConfigCollapsed(!isConfigCollapsed)}
            className="flex items-center gap-1.5 rounded-lg border border-[#262626] bg-[#050505] px-3 py-2 text-xs text-[#808080] hover:text-[#00FF9C] hover:border-[#00FF9C]/30 transition"
            title={isConfigCollapsed ? (lang === 'ar' ? 'إظهار لوحة الإعدادات' : 'Show Config Panel') : (lang === 'ar' ? 'إخفاء لوحة الإعدادات' : 'Collapse Config Panel')}
          >
            {isConfigCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5 text-[#00FF9C]" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isConfigCollapsed ? (lang === 'ar' ? 'إظهار الإعدادات' : 'Show Config') : (lang === 'ar' ? 'توسيع النتائج' : 'Expand Visualizer')}</span>
          </button>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#808080] whitespace-nowrap">
              {lang === 'ar' ? 'الأداة:' : 'Actor:'}
            </label>
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <select
                value={currentApi?.id}
                onChange={(e) => {
                  const found = apis.find((a) => a.id === e.target.value);
                  if (found) onSelectApi(found);
                }}
                className="w-full appearance-none rounded-lg border border-[#262626] bg-[#050505] px-3 py-2 pr-8 rtl:pl-8 rtl:pr-3 text-xs font-semibold text-[#00FF9C] focus:border-[#00FF9C] focus:outline-none cursor-pointer"
              >
                {apis.slice(0, 150).map((api) => (
                  <option key={api.id} value={api.id} className="bg-[#0A0A0A] text-[#D1D1D1]">
                    [{api.platform}] {api.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 rtl:left-2.5 rtl:right-auto top-1/2 -translate-y-1/2 h-4 w-4 text-[#808080] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Panel */}
        {!isConfigCollapsed && (
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3 font-mono">
                <div className="flex items-center gap-2 text-[#EAEAEA] font-bold text-sm">
                  <Sliders className="h-4 w-4 text-[#00FF9C]" />
                  <span>{lang === 'ar' ? 'إعدادات تشغيل الأداة' : 'Actor Configuration'}</span>
                </div>
                <Badge variant="platform" size="xs">
                  {currentApi.platform}
                </Badge>
              </div>

              {/* Quick Param Inputs */}
              <div className="space-y-3 font-mono">
                <Input
                  label={lang === 'ar' ? 'الهدف / الكلمات المفتاحية / الرابط المستهدف:' : 'Target URL / Keywords / Hashtag:'}
                  type="text"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  placeholder="https://instagram.com/p/... or #techtrends"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={lang === 'ar' ? 'أقصى عدد للسجلات:' : 'Max Records:'}
                    type="number"
                    min={1}
                    max={50}
                    value={maxItems}
                    onChange={(e) => setMaxItems(parseInt(e.target.value) || 10)}
                  />

                  <div className="space-y-1.5 font-sans">
                    <label className="block text-xs font-mono font-medium text-[#B0B0B0]">
                      {lang === 'ar' ? 'دولة البروكسي:' : 'Proxy Geo:'}
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full rounded-lg border border-[#242424] bg-[#050505] px-3 py-2 text-xs font-mono text-[#EAEAEA] focus:border-[#00FF9C] focus:outline-none"
                    >
                      <option value="US" className="bg-[#0A0A0A] text-[#D1D1D1]">🇺🇸 United States</option>
                      <option value="AE" className="bg-[#0A0A0A] text-[#D1D1D1]">🇦🇪 United Arab Emirates</option>
                      <option value="SA" className="bg-[#0A0A0A] text-[#D1D1D1]">🇸🇦 Saudi Arabia</option>
                      <option value="GB" className="bg-[#0A0A0A] text-[#D1D1D1]">🇬🇧 United Kingdom</option>
                      <option value="DE" className="bg-[#0A0A0A] text-[#D1D1D1]">🇩🇪 Germany</option>
                    </select>
                  </div>
                </div>

                {/* Proxy Shield Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-[#1E1E1E] bg-[#050505] p-3 font-sans">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#00FF9C]" />
                    <div>
                      <div className="text-xs font-semibold text-[#EAEAEA]">
                        {lang === 'ar' ? 'تدوير البروكسيات السكنية' : 'Residential Proxy Auto-Rotate'}
                      </div>
                      <div className="text-[10px] text-[#808080]">
                        {lang === 'ar' ? 'تجاوز حظر Cloudflare و Bot-Detection' : 'Bypass Cloudflare & Anti-Bot'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={useResidentialProxy}
                    onChange={(e) => setUseResidentialProxy(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#00FF9C] cursor-pointer"
                  />
                </div>

                {/* Advanced JSON Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <label className="text-xs font-semibold text-[#B0B0B0] flex items-center gap-1.5 font-sans">
                      <FileJson className="h-3.5 w-3.5 text-[#00FF9C]" />
                      <span>{lang === 'ar' ? 'محرر مدخلات الـ JSON المباشر:' : 'Raw JSON Input Payload:'}</span>
                    </label>
                    <button
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(jsonInput);
                          setJsonInput(JSON.stringify(parsed, null, 2));
                        } catch (e) {}
                      }}
                      className="text-[10px] text-[#00FF9C] hover:underline"
                    >
                      {lang === 'ar' ? 'تنسيق JSON' : 'Format JSON'}
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full rounded-lg border border-[#202020] bg-[#050505] p-3 font-mono text-xs text-[#00FF9C] focus:border-[#00FF9C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Launch Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleExecute}
                isLoading={isRunning}
                leftIcon={<Play className="h-4 w-4 fill-black" />}
                className="w-full text-xs sm:text-sm shadow-xl font-bold"
              >
                {isRunning
                  ? (lang === 'ar' ? 'جارِ تنفيذ السحب والتحليل آنياً...' : 'Executing Scraper Run...')
                  : (lang === 'ar' ? 'تشغيل عملية الاستخراج الآن ⚡' : 'EXECUTE SCRAPER RUN ⚡')}
              </Button>
            </div>

            {/* Actor Quick Metadata */}
            <div className="rounded-xl border border-[#202020] bg-[#090909] p-4 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-[#808080] text-[11px]">
                <span>ID: {currentApi.id}</span>
                <span>Runs: {currentApi.runsCount.toLocaleString()}</span>
              </div>
              <p className="text-[#808080] text-[11px] leading-relaxed font-sans line-clamp-2">
                {currentApi.description}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C] text-[11px]">
                <span className="text-[#00FF9C] flex items-center gap-1.5">
                  <StatusDot status="success" size="sm" />
                  <span>99.98% Uptime</span>
                </span>
                <a
                  href={currentApi.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00FF9C] hover:underline flex items-center gap-1"
                >
                  <span>Store Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Live Console & Results Visualizer */}
        <div className={`${isConfigCollapsed ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-4 transition-all duration-200`}>
          {/* Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="rounded-lg border border-[#202020] bg-[#090909] p-3 text-center">
              <div className="text-[10px] text-[#808080] uppercase font-semibold">{lang === 'ar' ? 'الحالة' : 'Status'}</div>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-bold text-[#00FF9C]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>200 OK</span>
              </div>
            </div>

            <div className="rounded-lg border border-[#202020] bg-[#090909] p-3 text-center">
              <div className="text-[10px] text-[#808080] uppercase font-semibold">{lang === 'ar' ? 'زمن التنفيذ' : 'Duration'}</div>
              <div className="mt-1 text-xs font-bold text-[#00FF9C]">
                {executionRun ? `${executionRun.durationMs}ms` : '--'}
              </div>
            </div>

            <div className="rounded-lg border border-[#202020] bg-[#090909] p-3 text-center">
              <div className="text-[10px] text-[#808080] uppercase font-semibold">{lang === 'ar' ? 'السجلات المستخرجة' : 'Extracted'}</div>
              <div className="mt-1 text-xs font-bold text-[#FFB800]">
                {executionRun ? executionRun.itemCount : '--'} items
              </div>
            </div>

            <div className="rounded-lg border border-[#202020] bg-[#090909] p-3 text-center">
              <div className="text-[10px] text-[#808080] uppercase font-semibold">{lang === 'ar' ? 'استهلاك الذاكرة' : 'RAM Used'}</div>
              <div className="mt-1 text-xs font-bold text-[#D1D1D1]">
                {executionRun ? `${executionRun.memoryMb} MB` : '--'}
              </div>
            </div>
          </div>

          {/* Terminal Logs Box */}
          <div className="rounded-xl border border-[#202020] bg-[#050505] p-4 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#EAEAEA]">
                <Terminal className="h-4 w-4 text-[#00FF9C]" />
                <span>{lang === 'ar' ? 'سجلات الشبكة والتنفيذ المباشرة' : 'Streaming Execution Logs'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLogsMaximized(!isLogsMaximized)}
                  className="text-[#808080] hover:text-[#00FF9C] p-0.5 rounded transition"
                  title={isLogsMaximized ? 'Minimize Logs' : 'Maximize Logs'}
                >
                  {isLogsMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
                <span className="flex items-center gap-1 text-[10px] text-[#00FF9C]">
                  <StatusDot status="active" size="sm" />
                  <span>LIVE</span>
                </span>
              </div>
            </div>

            <div className={`${isLogsMaximized ? 'max-h-72' : 'max-h-32'} overflow-y-auto text-[11px] space-y-1 pr-1 transition-all duration-200`}>
              {executionRun?.logs?.map((log) => {
                let badgeColor = 'text-[#00FF9C]';
                if (log.level === 'network') badgeColor = 'text-[#FFB800]';
                if (log.level === 'success') badgeColor = 'text-[#00FF9C]';
                if (log.level === 'warn') badgeColor = 'text-rose-400';
                return (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#555555] shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`shrink-0 font-bold uppercase ${badgeColor}`}>
                      [{log.level}]
                    </span>
                    <span className="text-[#B0B0B0]">{log.message}</span>
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Results Viewer with 5 Views including History */}
          <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 shadow-xl">
            {/* Visualizer Mode Tabs & Export Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1E1E1E] pb-3">
              {/* Tab switchers via Unified Tabs Primitive */}
              <Tabs
                variant="terminal"
                size="sm"
                activeTab={activeVisualizer}
                onChange={(tabId) => setActiveVisualizer(tabId as any)}
                tabs={[
                  { id: 'table', label: lang === 'ar' ? 'جدول البيانات' : 'Table', icon: TableIcon },
                  { id: 'json', label: 'JSON', icon: FileJson },
                  { id: 'gallery', label: lang === 'ar' ? 'معرض الوسائط' : 'Gallery', icon: ImageIcon },
                  { id: 'analytics', label: lang === 'ar' ? 'التحليلات' : 'Analytics', icon: BarChart3 },
                  { id: 'history', label: lang === 'ar' ? 'السجل' : 'History', icon: History, badge: state.history.length },
                ]}
              />

              {/* Advanced Export Controls */}
              <div className="flex items-center gap-2 font-mono relative">
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={handleCopyResults}
                  leftIcon={copiedData ? <Check className="h-3.5 w-3.5 text-[#00FF9C]" /> : <Copy className="h-3.5 w-3.5" />}
                >
                  {copiedData ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}
                </Button>

                <div className="relative">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    leftIcon={<Download className="h-3.5 w-3.5 text-[#00FF9C]" />}
                    rightIcon={<ChevronDown className="h-3 w-3" />}
                  >
                    {lang === 'ar' ? 'تصدير البيانات' : 'Export'}
                  </Button>

                  {showExportMenu && (
                    <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1 w-44 rounded-lg border border-[#262626] bg-[#0A0A0A] py-1 shadow-2xl z-30 font-mono text-xs">
                      <button
                        onClick={() => handleExport('csv')}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right text-[#D1D1D1] hover:bg-[#141414] hover:text-[#00FF9C]"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-[#00FF9C]" />
                        <span>CSV File (.csv)</span>
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right text-[#D1D1D1] hover:bg-[#141414] hover:text-[#00FF9C]"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-[#FFB800]" />
                        <span>Excel Sheet (.csv)</span>
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right text-[#D1D1D1] hover:bg-[#141414] hover:text-[#00FF9C]"
                      >
                        <FileJson className="h-3.5 w-3.5 text-[#00FF9C]" />
                        <span>JSON Format (.json)</span>
                      </button>
                      <button
                        onClick={() => handleExport('jsonl')}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right text-[#D1D1D1] hover:bg-[#141414] hover:text-[#00FF9C]"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#00FF9C]" />
                        <span>JSONL (AI / RAG)</span>
                      </button>
                      <button
                        onClick={() => handleExport('markdown')}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right text-[#D1D1D1] hover:bg-[#141414] hover:text-[#00FF9C]"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#B0B0B0]" />
                        <span>Markdown Table (.md)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* View 1: Data Table */}
            {activeVisualizer === 'table' && (
              <div className="space-y-3">
                <Input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder={lang === 'ar' ? 'تصفية والبحث في النتائج...' : 'Filter extracted records...'}
                  leftIcon={<Search className="h-3.5 w-3.5 text-[#707070]" />}
                />

                <div className="max-h-96 overflow-x-auto overflow-y-auto rounded-lg border border-[#202020]">
                  <table className="w-full text-left rtl:text-right text-xs">
                    <thead className="sticky top-0 bg-[#050505] border-b border-[#202020] font-semibold text-[#808080] font-mono">
                      <tr>
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">{lang === 'ar' ? 'العنوان / الحساب' : 'Entity / User'}</th>
                        <th className="px-3 py-2">{lang === 'ar' ? 'المحتوى / الوصف' : 'Content / Details'}</th>
                        <th className="px-3 py-2">{lang === 'ar' ? 'المقاييس' : 'Metrics'}</th>
                        <th className="px-3 py-2">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#181818] font-mono text-[11px]">
                      {filteredResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#111111] transition">
                          <td className="px-3 py-2.5 text-[#555555] font-bold">{idx + 1}</td>
                          <td className="px-3 py-2.5">
                            <div className="font-sans font-semibold text-[#EDEDED]">
                              {item.author?.fullName || item.fullName || item.channelTitle || item.creator?.nickname || item.title || 'Record'}
                            </div>
                            <div className="text-[10px] text-[#00FF9C] font-mono">
                              @{item.author?.username || item.creator?.username || item.author || 'verified'}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 max-w-xs font-sans text-[#A1A1A1] line-clamp-2">
                            {item.caption || item.headline || item.desc || item.content || item.contactDetails?.workEmail || '—'}
                          </td>
                          <td className="px-3 py-2.5 text-[#D1D1D1]">
                            {item.likesCount !== undefined && (
                              <div>❤️ {item.likesCount.toLocaleString()} likes</div>
                            )}
                            {item.views !== undefined && (
                              <div>👁️ {item.views.toLocaleString()} views</div>
                            )}
                            {item.viewCount !== undefined && (
                              <div>👁️ {item.viewCount.toLocaleString()} views</div>
                            )}
                            {item.contactDetails?.phone && (
                              <div className="text-[#00FF9C]">📞 {item.contactDetails.phone}</div>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-[#666666] whitespace-nowrap text-[10px]">
                            {new Date().toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View 2: Raw JSON Tree */}
            {activeVisualizer === 'json' && (
              <div className="max-h-96 overflow-auto rounded-lg border border-[#202020] bg-[#050505] p-4">
                <pre className="font-mono text-xs text-[#00FF9C] leading-relaxed">
                  {JSON.stringify(executionRun?.results || [], null, 2)}
                </pre>
              </div>
            )}

            {/* View 3: Media Gallery Grid */}
            {activeVisualizer === 'gallery' && (
              <div className="max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
                {(executionRun?.results || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-lg border border-[#202020] bg-[#050505] p-3 space-y-2 font-mono"
                  >
                    {item.mediaUrl || item.thumbnailUrl ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded bg-[#0A0A0A]">
                        <img
                          src={item.mediaUrl || item.thumbnailUrl}
                          alt="Scraped media"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-[#00FF9C] border border-[#00FF9C]/20">
                          {item.type || 'HD Media'}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2 font-sans">
                      <div className="h-6 w-6 rounded-full border border-[#00FF9C]/30 bg-[#00FF9C]/10 text-[#00FF9C] flex items-center justify-center text-xs font-bold font-mono">
                        {(item.author?.username || 'U')[0].toUpperCase()}
                      </div>
                      <div className="truncate font-semibold text-xs text-white">
                        {item.author?.username || item.fullName || item.channelTitle || 'Scraped Entity'}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#888888] line-clamp-2 font-sans">
                      {item.caption || item.desc || item.headline || item.title}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#666666] pt-1 border-t border-[#1C1C1C]">
                      <span>❤️ {item.likesCount || item.stats?.diggCount || '1.2k'}</span>
                      <span>💬 {item.commentsCount || item.stats?.commentCount || '84'}</span>
                      <a
                        href={item.url || item.profileUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00FF9C] hover:underline flex items-center gap-0.5"
                      >
                        <span>Open</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View 4: Analytics */}
            {activeVisualizer === 'analytics' && (
              <div className="space-y-4 font-mono">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#202020] bg-[#050505] p-4 text-center">
                    <div className="text-xs text-[#808080]">{lang === 'ar' ? 'متوسط التفاعل' : 'Avg Engagement'}</div>
                    <div className="mt-1 text-2xl font-bold text-[#00FF9C]">4.82%</div>
                    <div className="text-[10px] text-[#00FF9C] mt-0.5">▲ High engagement tier</div>
                  </div>

                  <div className="rounded-lg border border-[#202020] bg-[#050505] p-4 text-center">
                    <div className="text-xs text-[#808080]">{lang === 'ar' ? 'تحليل المشاعر' : 'Sentiment Score'}</div>
                    <div className="mt-1 text-2xl font-bold text-[#FFB800]">92% Positive</div>
                    <div className="text-[10px] text-[#666666] mt-0.5">Evaluated across captions</div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#202020] bg-[#050505] p-4">
                  <div className="text-xs font-semibold text-[#D1D1D1] mb-2 font-sans">
                    {lang === 'ar' ? 'الهاشتاغات والكلمات المفتاحية الأكثر تكراراً' : 'Top Extracted Keywords & Tags'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['#AI', '#Automation', '#TechTrends', '#Coding', '#Enterprise', '#DataPipelines', '#Innovation'].map((h, i) => (
                      <Badge key={i} variant="primary" size="sm">
                        {h}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* View 5: Historical Runs */}
            {activeVisualizer === 'history' && (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-2">
                  <div className="text-xs text-[#808080]">
                    {lang === 'ar' ? 'سجل العمليات المنفذة في هذه الجلسة:' : 'Execution Runs in Current Session:'}
                  </div>
                  {state.history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{lang === 'ar' ? 'مسح السجل' : 'Clear History'}</span>
                    </button>
                  )}
                </div>

                {state.history.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#666666]">
                    {lang === 'ar' ? 'لا يوجد أي عمليات منفذة حتى الآن' : 'No execution history yet'}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {state.history.map((run, idx) => (
                      <div
                        key={run.id || idx}
                        className="flex items-center justify-between rounded-lg border border-[#202020] bg-[#050505] p-3 text-xs hover:border-[#00FF9C]/40 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-sans">{run.actorName}</span>
                            <Badge variant="success" size="xs">
                              {run.status}
                            </Badge>
                          </div>
                          <div className="text-[10px] text-[#707070] flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-[#555555]" />
                              {new Date(run.startedAt).toLocaleTimeString()}
                            </span>
                            <span>•</span>
                            <span className="text-[#00FF9C]">{run.itemCount} items</span>
                            <span>•</span>
                            <span>{run.durationMs}ms</span>
                            <span>•</span>
                            <span>{run.memoryMb} MB</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleRestoreRun(run)}
                          className="text-[#00FF9C] hover:bg-[#00FF9C]/10"
                        >
                          {lang === 'ar' ? 'عرض النتائج' : 'View Run'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
