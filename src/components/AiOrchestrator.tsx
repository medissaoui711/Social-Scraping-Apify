import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCw, 
  Code2, 
  Play, 
  Layers, 
  Copy, 
  Check, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  Terminal,
  FileCode,
  Lightbulb,
  Zap
} from 'lucide-react';
import { AIRecommendation, ScrapingApiItem } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface AiOrchestratorProps {
  onSelectForPlayground: (api: ScrapingApiItem) => void;
  lang: 'ar' | 'en';
}

export const AiOrchestrator: React.FC<AiOrchestratorProps> = ({
  onSelectForPlayground,
  lang
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const samplePrompts = [
    {
      labelAr: '🎯 جمع إيميلات المديرين في لينكد إن',
      labelEn: '🎯 Scrape LinkedIn Executive Emails',
      text: 'أريد جمع وتأكيد إيميلات المديرين التنفيذيين ورؤساء التقنية (CTOs) لشركات الذكاء الاصطناعي وتصديرها بصيغة جاهزة للـ CRM.'
    },
    {
      labelAr: '🎬 تفريغ نصوص يوتيوب وتحليل التعليقات',
      labelEn: '🎬 YouTube Transcripts & Sentiment',
      text: 'استخراج تفريغ النصوص الكاملة من قنوات اليوتيوب التقنية مع سحب التعليقات وتحليل المشاعر وتحديد أهم المواضيع.'
    },
    {
      labelAr: '🔥 رادار تريندات تيك توك وريلز',
      labelEn: '🔥 TikTok & Reels Viral Radar',
      text: 'مراقبة الهاشتاغات الرائجة ومعدلات التفاعل وسرعة المشاهدات في تيك توك وسحب بيانات صانعي المحتوى بدون علامة مائية.'
    },
    {
      labelAr: '📊 استخراج بيانات المؤثرين بإنستغرام',
      labelEn: '📊 Instagram Influencer Outreach',
      text: 'البحث عن المؤثرين في مجال التقنية واللياقة البدنية واستخراج حساباتهم ومعدل تفاعل الريلز وأرقام الواتساب المتاحة في البايو.'
    }
  ];

  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const queryText = customText || prompt;
    if (!queryText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/recommend-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          language: lang
        })
      });
      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      console.error('AI Recommendation Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!recommendation?.generatedScript?.code) return;
    navigator.clipboard.writeText(recommendation.generatedScript.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 sm:p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00FF9C] font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'أوركسترا الذكاء الاصطناعي مدعوم بنموذج Gemini' : 'AI Scraper Orchestrator powered by Gemini'}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
            {lang === 'ar' ? 'المساعد الذكي لبناء منظومات الاستخراج' : 'AI Scraper Pipeline Architect'}
          </h2>
          <p className="text-xs sm:text-sm text-[#808080] font-sans leading-relaxed">
            {lang === 'ar'
              ? 'صف هدفك أو متطلباتك باللغة الطبيعية (عربي أو إنجليزي)، وسيقوم الذكاء الاصطناعي باختيار أفضل واجهات السحب من بين 3,268 أداة، وبناء خط العمل، وتوليد الكود البرمجي التنفيذي كاملاً.'
              : 'Describe your data extraction goal in natural language. Gemini will analyze the intent, recommend the best scrapers from the 3,268 catalog, compose the workflow, and generate executable scripts.'}
          </p>
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 shadow-xl">
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'اكتب متطلباتك بالتفصيل... (مثال: أريد استخراج جميع منشورات وتعليقات حسابات منافسة على إنستغرام وتحليل الكلمات المفتاحية الأكثر تفاعلاً)'
                  : 'Describe your scraping requirements in detail (e.g. Scrape all competitor posts on Instagram, extract verified emails from bio links, and calculate average engagement)...'
              }
              className="w-full rounded-lg border border-[#242424] bg-[#050505] p-4 text-xs sm:text-sm text-[#EAEAEA] placeholder-[#555555] font-sans focus:border-[#00FF9C] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#808080]">
              <Lightbulb className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>{lang === 'ar' ? 'أو اختر أحد النماذج المقترحة أدناه:' : 'Or choose a sample scenario below:'}</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!prompt.trim()}
              isLoading={isLoading}
              leftIcon={<Send className="h-3.5 w-3.5" />}
              className="font-mono text-xs font-bold shadow-lg"
            >
              {isLoading
                ? (lang === 'ar' ? 'جارِ التحليل المعماري...' : 'Synthesizing Architecture...')
                : (lang === 'ar' ? 'تحليل وبناء المنظومة ⚡' : 'Analyze & Build Scraper ⚡')}
            </Button>
          </div>
        </form>

        {/* Quick Sample Prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-[#1C1C1C]">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p.text);
                handleSubmit(undefined, p.text);
              }}
              className="flex items-center justify-between rounded-lg border border-[#202020] bg-[#050505] p-2.5 text-left rtl:text-right text-xs text-[#D1D1D1] transition hover:border-[#00FF9C]/40 hover:bg-[#111111]"
            >
              <span className="font-medium text-[#EAEAEA] font-sans">
                {lang === 'ar' ? p.labelAr : p.labelEn}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-[#666666] rtl:rotate-180 shrink-0 ml-2 rtl:ml-0 rtl:mr-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Generated Recommendation Results */}
      {recommendation && (
        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
          {/* Architecture Summary */}
          <div className="rounded-xl border border-[#00FF9C]/30 bg-[#00FF9C]/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00FF9C]" />
                <h3 className="text-sm font-bold text-white font-mono">
                  {lang === 'ar' ? 'الخطة المعمارية المقترحة للاستخراج' : 'Proposed Extraction Strategy'}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-[#00FF9C]">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>{recommendation.estimatedCost}</span>
                </span>
                <span className="flex items-center gap-1 text-[#FFB800]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{recommendation.estimatedRuntime}</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#D1D1D1] leading-relaxed font-sans">
              {lang === 'ar' ? recommendation.summaryAr : recommendation.summary}
            </p>
          </div>

          {/* Recommended Actors Grid */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#808080]">
              {lang === 'ar' ? 'الأدوات المقترحة من قاعدة البيانات (3,268 أداة):' : 'Recommended Scrapers from Catalog:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendation.recommendedApis?.map((api) => (
                <div
                  key={api.id}
                  className="flex items-center justify-between rounded-xl border border-[#222222] bg-[#090909] p-4 transition hover:border-[#00FF9C]/40"
                >
                  <div className="space-y-1 pr-3 rtl:pr-0 rtl:pl-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="platform" size="xs">
                        {api.platform}
                      </Badge>
                      <Badge variant="neutral" size="xs">
                        {api.pricing}
                      </Badge>
                    </div>
                    <h5 className="font-bold text-xs text-white line-clamp-1 font-sans">{api.name}</h5>
                    <div className="text-[10px] text-[#707070]">{api.actorId}</div>
                  </div>

                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => onSelectForPlayground(api)}
                    leftIcon={<Play className="h-3 w-3 fill-black" />}
                  >
                    {lang === 'ar' ? 'تشغيل' : 'Launch'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Multi-Stage Workflow Steps */}
          {recommendation.suggestedPipeline?.length > 0 && (
            <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 font-mono">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#808080]">
                {lang === 'ar' ? 'مراحل خط العمل المقترح:' : 'Recommended Workflow Pipeline:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendation.suggestedPipeline.map((step) => (
                  <div
                    key={step.step}
                    className="rounded-lg border border-[#202020] bg-[#050505] p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded border border-[#00FF9C]/30 bg-[#00FF9C]/10 text-[10px] font-bold text-[#00FF9C]">
                        {step.step}
                      </span>
                      <h5 className="font-bold text-xs text-white font-sans">{step.title}</h5>
                    </div>
                    <p className="text-[11px] text-[#808080] font-sans">{step.description}</p>
                    <div className="text-[10px] text-[#00FF9C] pt-1">
                      Actor: {step.actor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Python Script */}
          {recommendation.generatedScript?.code && (
            <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <FileCode className="h-4 w-4 text-[#00FF9C]" />
                  <span>{lang === 'ar' ? 'الشيفرة البرمجية الجاهزة للتنفيذ (Python)' : 'Production Script (Python SDK)'}</span>
                </div>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={handleCopyCode}
                  leftIcon={copiedCode ? <Check className="h-3 w-3 text-[#00FF9C]" /> : <Copy className="h-3 w-3" />}
                >
                  {copiedCode ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكود' : 'Copy Code')}
                </Button>
              </div>

              <pre className="overflow-x-auto rounded-lg border border-[#1E1E1E] bg-[#050505] p-4 text-xs font-mono text-[#00FF9C] leading-relaxed">
                {recommendation.generatedScript.code}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
