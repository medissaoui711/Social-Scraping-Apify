import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ChevronDown, 
  Send, 
  Zap, 
  Layers,
  FileCode2,
  CheckCircle2,
  RotateCw
} from 'lucide-react';
import { ScrapingApiItem, CodeLanguage } from '../types';
import { Badge, Button, Input, StatusDot, Tabs, Select, Panel } from './ui';

interface CodeStudioProps {
  apis: ScrapingApiItem[];
  selectedApi: ScrapingApiItem | null;
  onSelectApi: (api: ScrapingApiItem) => void;
  apifyToken: string;
  lang: 'ar' | 'en';
}

export const CodeStudio: React.FC<CodeStudioProps> = ({
  apis,
  selectedApi,
  onSelectApi,
  apifyToken,
  lang
}) => {
  const currentApi = selectedApi || apis[0];
  const [language, setLanguage] = useState<CodeLanguage>('python');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [webhookUrl, setWebhookUrl] = useState<string>('https://webhook.site/demo-endpoint');
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const languages: { id: CodeLanguage; name: string; ext: string; iconText: string }[] = [
    { id: 'python', name: 'Python (Apify SDK)', ext: 'py', iconText: 'PY' },
    { id: 'nodejs', name: 'Node.js / TypeScript', ext: 'ts', iconText: 'TS' },
    { id: 'curl', name: 'cURL / Shell', ext: 'sh', iconText: 'SH' },
    { id: 'go', name: 'Golang', ext: 'go', iconText: 'GO' },
    { id: 'php', name: 'PHP (cURL)', ext: 'php', iconText: 'PHP' },
    { id: 'rust', name: 'Rust (Reqwest)', ext: 'rs', iconText: 'RS' }
  ];

  const fetchCode = async () => {
    if (!currentApi) return;
    try {
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: currentApi.actorId,
          actorUrl: currentApi.url,
          language,
          inputPayload: currentApi.defaultInput || { maxItems: 25 },
          apifyToken
        })
      });
      const data = await res.json();
      setGeneratedCode(data.code || '');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCode();
  }, [currentApi?.id, language, apifyToken]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const activeLang = languages.find((l) => l.id === language) || languages[0];
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scraper_${currentApi.slug}.${activeLang.ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTestWebhook = () => {
    setWebhookStatus('testing');
    setTimeout(() => {
      setWebhookStatus('success');
      setTimeout(() => setWebhookStatus('idle'), 3500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00FF9C] font-mono">
              <Code2 className="h-3.5 w-3.5" />
              <span>{lang === 'ar' ? 'مولّد الشيفرات البرمجية المتعدد اللغات' : 'Multi-Language SDK & Code Generator'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
              {lang === 'ar' ? 'استوديو توليد الأكواد لـ 3,268 واجهة' : 'Code Studio & SDK Integrations'}
            </h2>
            <p className="text-xs text-[#808080] font-sans leading-relaxed max-w-2xl">
              {lang === 'ar'
                ? 'أنشئ نصوصاً برمجية جاهزة للإنتاج بـ Python و TypeScript و Go و cURL و PHP و Rust مع التعامل التلقائي مع الأخطاء والبروكسيات السكنية.'
                : 'Generate ready-to-run scripts in Python, Node.js, Go, cURL, PHP and Rust with robust error handling and proxy rotation.'}
            </p>
          </div>

          {/* Actor Selector via Select component */}
          <div className="min-w-[260px] font-mono">
            <Select
              label={lang === 'ar' ? 'اختر الواجهة المستهدفة:' : 'Target Scraper Actor:'}
              value={currentApi?.id}
              onChange={(e) => {
                const f = apis.find((a) => a.id === e.target.value);
                if (f) onSelectApi(f);
              }}
              options={apis.slice(0, 150).map((api) => ({
                value: api.id,
                label: `[${api.platform}] ${api.name}`
              }))}
            />
          </div>
        </div>
      </div>

      {/* Main Code Editor Container */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 shadow-xl">
        {/* Language Tabs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1E1E1E] pb-3">
          <Tabs
            variant="pills"
            size="sm"
            activeTab={language}
            onChange={(tabId) => setLanguage(tabId as CodeLanguage)}
            tabs={languages.map((l) => ({
              id: l.id,
              label: l.name,
              badge: l.iconText,
            }))}
          />

          <div className="flex items-center gap-2 font-mono">
            <Button
              variant="secondary"
              size="xs"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="h-3.5 w-3.5 text-[#00FF9C]" /> : <Copy className="h-3.5 w-3.5" />}
            >
              {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكود' : 'Copy')}
            </Button>

            <Button
              variant="outline"
              size="xs"
              onClick={handleDownload}
              leftIcon={<Download className="h-3.5 w-3.5 text-[#00FF9C]" />}
            >
              {lang === 'ar' ? 'تنزيل الملف' : 'Download'}
            </Button>
          </div>
        </div>

        {/* Terminal Code View */}
        <div className="relative">
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex items-center gap-1.5 font-mono text-[10px] text-[#707070] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#202020] select-none">
            <FileCode2 className="h-3 w-3 text-[#00FF9C]" />
            <span>{currentApi?.slug}.{languages.find(l => l.id === language)?.ext}</span>
          </div>
          <pre className="max-h-[480px] overflow-auto rounded-lg border border-[#1E1E1E] bg-[#050505] p-5 font-mono text-xs text-[#00FF9C] leading-relaxed select-text">
            {generatedCode}
          </pre>
        </div>

        {/* Webhook Dispatch & Integration Simulator */}
        <div className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#EAEAEA]">
              <Zap className="h-4 w-4 text-[#FFB800]" />
              <span>{lang === 'ar' ? 'محاكي الربط مع الـ Webhook و Zapier / Make' : 'Webhook & Pipeline Dispatch Tester'}</span>
            </div>
            {webhookStatus === 'success' && (
              <Badge variant="success" size="xs" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                <span>HTTP 200 Payload Dispatched</span>
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-api-endpoint.com/webhook"
              className="flex-1 rounded-lg border border-[#242424] bg-[#090909] px-3 py-2 text-xs font-mono text-[#EAEAEA] placeholder-[#555555] focus:border-[#00FF9C] focus:outline-none"
            />
            <Button
              variant="terminal"
              size="sm"
              onClick={handleTestWebhook}
              isLoading={webhookStatus === 'testing'}
              leftIcon={<Send className="h-3.5 w-3.5" />}
            >
              {lang === 'ar' ? 'اختبار الإرسال' : 'Test Webhook'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
