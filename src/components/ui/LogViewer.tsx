import React, { useState } from 'react';
import { Terminal, Copy, Check, Filter, Trash2, Search } from 'lucide-react';
import { Button } from './Button';

export interface LogEntry {
  id?: string;
  time: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'success' | 'network';
  message: string;
}

export interface LogViewerProps {
  logs: LogEntry[];
  title?: string;
  onClear?: () => void;
  lang?: 'ar' | 'en';
  maxHeight?: string;
  className?: string;
}

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  title = 'Live Execution Logs',
  onClear,
  lang = 'en',
  maxHeight = 'max-h-64',
  className = '',
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredLogs = logs.filter((l) => {
    const matchesLevel = filterLevel === 'ALL' || l.level.toLowerCase() === filterLevel.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || l.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs.map((l) => `[${l.time}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
      case 'warn':
        return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';
      case 'success':
        return 'text-[#00FF9C] bg-[#00FF9C]/10 border-[#00FF9C]/20';
      case 'network':
        return 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20';
      case 'debug':
        return 'text-[#757575] bg-[#141414] border-[#242424]';
      default:
        return 'text-[#EAEAEA] bg-[#141414] border-[#242424]';
    }
  };

  return (
    <div
      className={`flex flex-col rounded-xl border border-[#242424] bg-[#050505] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1C1C1C] bg-[#090909] px-3.5 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#EAEAEA]">
          <Terminal className="h-4 w-4 text-[#00FF9C]" />
          <span>{title}</span>
          <span className="rounded bg-[#141414] px-1.5 py-0.2 text-[10px] text-[#757575] border border-[#222222]">
            {filteredLogs.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث...' : 'Filter...'}
              className="rounded-lg border border-[#222222] bg-[#050505] px-2 py-0.5 text-[10px] text-[#EAEAEA] focus:border-[#00FF9C] focus:outline-none w-20 sm:w-28"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-0.5 rounded bg-[#050505] p-0.5 border border-[#222222] text-[10px]">
            {['ALL', 'INFO', 'WARN', 'ERROR', 'NETWORK'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`rounded px-1.5 py-0.5 transition ${
                  filterLevel === lvl
                    ? 'bg-[#181818] text-[#00FF9C] font-bold'
                    : 'text-[#757575] hover:text-[#B0B0B0]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopyLogs}
            leftIcon={copied ? <Check className="h-3 w-3 text-[#00FF9C]" /> : <Copy className="h-3 w-3" />}
          >
            {copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}
          </Button>

          {onClear && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onClear}
              className="text-[#757575] hover:text-[#EF4444]"
              leftIcon={<Trash2 className="h-3 w-3" />}
            >
              {lang === 'ar' ? 'مسح' : 'Clear'}
            </Button>
          )}
        </div>
      </div>

      {/* Stream Area */}
      <div className={`${maxHeight} overflow-y-auto p-3 font-mono text-[11px] leading-relaxed space-y-1.5 select-text`}>
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-[#757575] italic">
            {lang === 'ar' ? 'لا توجد سجلات مطابقة...' : 'No matching logs found...'}
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 hover:bg-[#0E0E0E] px-1.5 py-0.5 rounded">
              <span className="shrink-0 text-[#757575]">[{log.time}]</span>
              <span
                className={`shrink-0 uppercase px-1.5 py-0.2 rounded border text-[9px] font-bold ${getLevelBadge(
                  log.level
                )}`}
              >
                {log.level}
              </span>
              <span className="text-[#EAEAEA] break-all flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
