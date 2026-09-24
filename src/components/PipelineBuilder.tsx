import React, { useState } from 'react';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  RotateCw, 
  Plus, 
  Trash2, 
  ArrowDown, 
  Download, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  Sliders,
  ExternalLink,
  ChevronRight,
  Database,
  Mail,
  FileSpreadsheet,
  Copy,
  Check,
  Zap,
  Sparkles,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PipelineWorkflow, PipelineStep, ScrapingApiItem } from '../types';
import { PREBUILT_RECIPES } from '../data/recipes';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StatusDot } from './ui/StatusDot';
import { CronScheduleModal } from './CronScheduleModal';

interface PipelineBuilderProps {
  apis: ScrapingApiItem[];
  onSelectForPlayground: (api: ScrapingApiItem) => void;
  lang: 'ar' | 'en';
}

export const PipelineBuilder: React.FC<PipelineBuilderProps> = ({
  apis,
  onSelectForPlayground,
  lang
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<PipelineWorkflow>(PREBUILT_RECIPES[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<number>(0);
  const [pipelineOutput, setPipelineOutput] = useState<any[] | null>(null);
  const [copiedRecipe, setCopiedRecipe] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);

  const handleSelectRecipe = (recipe: PipelineWorkflow) => {
    setSelectedWorkflow(recipe);
    setActiveStepIndex(-1);
    setPipelineOutput(null);
    setPipelineProgress(0);
  };

  const handleToggleStep = (stepId: string) => {
    setSelectedWorkflow((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === stepId ? { ...s, isEnabled: !s.isEnabled } : s))
    }));
  };

  const handleCopyRecipeJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedWorkflow, null, 2));
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 1500);
  };

  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    setPipelineProgress(10);
    setActiveStepIndex(0);

    const steps = selectedWorkflow.steps.filter((s) => s.isEnabled);

    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i);
      setPipelineProgress(Math.round(((i + 1) / steps.length) * 90));
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setPipelineProgress(100);
    setActiveStepIndex(steps.length);
    setIsRunningPipeline(false);

    // Consolidated mock pipeline outputs
    const sampleResults = [
      {
        id: 'pipe_res_1',
        entity: 'Dr. Tariq Al-Husseini',
        role: 'Head of AI & Robotics @ TechNova',
        verifiedEmail: 'tariq.h@technova.ai',
        phone: '+971 50 842 1920',
        sentimentScore: '0.94 (Highly Positive)',
        summary: 'Identified as key decision maker for enterprise cloud automation. Direct contact verified.'
      },
      {
        id: 'pipe_res_2',
        entity: 'Noura Mansour',
        role: 'VP Marketing & Growth @ RetailNext',
        verifiedEmail: 'noura@retailnext.io',
        phone: '+966 55 410 8832',
        sentimentScore: '0.88 (Positive)',
        summary: 'Targeted campaign match. High viral engagement on recent product launch videos.'
      },
      {
        id: 'pipe_res_3',
        entity: 'Karim Zaidan',
        role: 'Chief Product Officer @ FinCore',
        verifiedEmail: 'k.zaidan@fincore.net',
        phone: '+971 52 900 4411',
        sentimentScore: '0.91 (Positive)',
        summary: 'Verified contact. Actively hiring engineering leads and testing automated workflows.'
      }
    ];

    setPipelineOutput(sampleResults);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 }
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00FF9C] font-mono">
              <Workflow className="h-3.5 w-3.5" />
              <span>{lang === 'ar' ? 'أتمتة خطوط المعالجة متعددة المراحل' : 'Multi-Stage Scraping & Pipeline Automator'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
              {lang === 'ar' ? 'مُنشئ ومنفّذ خطوط الاستخراج المؤتمتة' : 'Scraper Pipeline Automator'}
            </h2>
            <p className="text-xs text-[#808080] max-w-2xl font-sans leading-relaxed">
              {lang === 'ar'
                ? 'اربط واجهات الاستخراج مع أدوات تنقية الإيميلات، وفحص أرقام الواتساب، والتحليل الدلالي بالذكاء الاصطناعي في خط عمل واحد متكامل مع جدولة تلقائية.'
                : 'Chain multiple scraper actors, contact enrichers, and Gemini AI sentiment analyzers into unified high-speed workflows with automated cron dispatching.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsScheduleModalOpen(true)}
              leftIcon={<Clock className="h-4 w-4 text-[#00FF9C]" />}
              className="text-xs sm:text-sm font-bold border-[#282828] hover:border-[#00FF9C]/40"
            >
              {lang === 'ar' ? 'جدولة دورية (Cron) ⏱️' : 'Schedule (Cron) ⏱️'}
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleRunPipeline}
              isLoading={isRunningPipeline}
              leftIcon={<Play className="h-4 w-4 fill-black" />}
              className="text-xs sm:text-sm font-bold shadow-xl"
            >
              {isRunningPipeline
                ? (lang === 'ar' ? 'جارِ تنفيذ خط العمل...' : 'Executing Pipeline...')
                : (lang === 'ar' ? 'تشغيل خط العمل بالكامل ⚡' : 'RUN ENTIRE PIPELINE ⚡')}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunningPipeline && (
          <div className="mt-4 space-y-1.5 font-mono">
            <div className="flex justify-between text-xs text-[#00FF9C]">
              <span className="flex items-center gap-1.5">
                <StatusDot status="active" size="sm" />
                <span>{lang === 'ar' ? 'المرحلة النشطة:' : 'Active Phase:'} Step {activeStepIndex + 1}</span>
              </span>
              <span>{pipelineProgress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#181818]">
              <div
                className="h-full bg-[#00FF9C] transition-all duration-300"
                style={{ width: `${pipelineProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Prebuilt Recipes Selection Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#808080] flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#00FF9C]" />
            <span>{lang === 'ar' ? 'اختر وصفة أتمتة جاهزة للاستخدام:' : 'Pre-Engineered Automation Recipes:'}</span>
          </h3>
          <span className="text-[11px] text-[#606060]">
            {PREBUILT_RECIPES.length} {lang === 'ar' ? 'وصفات متوفرة' : 'Recipes Available'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PREBUILT_RECIPES.map((recipe) => {
            const isSelected = selectedWorkflow.id === recipe.id;
            return (
              <div
                key={recipe.id}
                onClick={() => handleSelectRecipe(recipe)}
                className={`flex flex-col justify-between rounded-xl border p-4 text-left rtl:text-right transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-lg shadow-[#00FF9C]/10'
                    : 'border-[#222222] bg-[#090909] hover:border-[#333333] hover:bg-[#0D0D0D]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <Badge variant="primary" size="xs">
                      {recipe.category}
                    </Badge>
                    <span className="text-[10px] text-[#707070] font-mono">
                      {recipe.steps.length} {lang === 'ar' ? 'مراحل' : 'steps'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 font-sans">
                    {lang === 'ar' ? recipe.titleAr : recipe.title}
                  </h4>
                  <p className="text-[11px] text-[#808080] line-clamp-2 leading-relaxed">
                    {lang === 'ar' ? recipe.descriptionAr : recipe.description}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1 pt-2.5 border-t border-[#1C1C1C] font-mono">
                  {recipe.tags.map((t, idx) => (
                    <span key={idx} className="rounded bg-[#050505] px-1.5 py-0.5 text-[10px] text-[#808080] border border-[#1E1E1E]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Step Pipeline Visualizer */}
      <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 sm:p-6 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E1E1E] pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                {lang === 'ar' ? selectedWorkflow.titleAr : selectedWorkflow.title}
              </h3>
              <Badge variant="platform" size="xs">
                {selectedWorkflow.category}
              </Badge>
            </div>
            <p className="text-xs text-[#808080] font-sans">
              {lang === 'ar' ? selectedWorkflow.descriptionAr : selectedWorkflow.description}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[#242424] bg-[#050505] px-3 py-1.5 text-xs text-[#00FF9C] hover:bg-[#141414] transition"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{lang === 'ar' ? 'جدولة التشغيل' : 'Schedule Pipeline'}</span>
            </button>
            <button
              onClick={handleCopyRecipeJson}
              className="flex items-center gap-1.5 rounded-lg border border-[#242424] bg-[#050505] px-3 py-1.5 text-xs text-[#D1D1D1] hover:bg-[#141414] transition"
            >
              {copiedRecipe ? <Check className="h-3.5 w-3.5 text-[#00FF9C]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedRecipe ? 'Copied' : 'Export Blueprint'}</span>
            </button>
          </div>
        </div>

        {/* Steps Pipeline Flow */}
        <div className="space-y-3">
          {selectedWorkflow.steps.map((step, index) => {
            const isCurrentActive = activeStepIndex === index;
            const isCompleted = activeStepIndex > index;

            return (
              <div key={step.id} className="group relative">
                <div
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isCurrentActive
                      ? 'border-[#00FF9C] bg-[#00FF9C]/10 shadow-lg shadow-[#00FF9C]/10'
                      : isCompleted
                      ? 'border-[#00FF9C]/40 bg-[#060D09]'
                      : step.isEnabled
                      ? 'border-[#222222] bg-[#050505] hover:border-[#333333]'
                      : 'border-[#1C1C1C]/40 bg-[#050505]/40 opacity-40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                          isCompleted
                            ? 'bg-[#00FF9C] text-black font-bold'
                            : isCurrentActive
                            ? 'bg-[#00FF9C] text-black animate-pulse font-bold'
                            : 'bg-[#141414] text-[#808080] border border-[#242424]'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-[#EAEAEA] font-sans">
                            {step.title}
                          </h4>
                          <Badge variant="platform" size="xs">
                            {step.platform}
                          </Badge>
                        </div>
                        <div className="font-mono text-[11px] text-[#707070] mt-0.5">
                          {step.actorName} <span className="text-[#555555]">({step.actorId})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center font-mono">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#808080]">
                        <span>{step.isEnabled ? (lang === 'ar' ? 'مُفعّل' : 'Active') : (lang === 'ar' ? 'معطّل' : 'Disabled')}</span>
                        <input
                          type="checkbox"
                          checked={step.isEnabled}
                          onChange={() => handleToggleStep(step.id)}
                          className="h-4 w-4 rounded accent-[#00FF9C] cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Step Payload Spec */}
                  <div className="mt-3 rounded-lg bg-[#080808] p-3 text-[11px] font-mono text-[#00FF9C] border border-[#1C1C1C]">
                    <div className="text-[#707070] mb-1 font-sans font-semibold text-[10px] uppercase">
                      {lang === 'ar' ? 'معاملات التشغيل' : 'Payload Parameters'}:
                    </div>
                    <div className="break-all">{JSON.stringify(step.customInput)}</div>
                  </div>
                </div>

                {/* Pipeline Flow Connector */}
                {index < selectedWorkflow.steps.length - 1 && (
                  <div className="flex flex-col items-center py-2 relative">
                    <div className="h-6 w-0.5 border-l-2 border-dashed border-[#00FF9C]/30 my-0.5" />
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#050505] border border-[#00FF9C]/40 text-[#00FF9C] shadow-sm">
                      <ArrowDown className="h-3 w-3" />
                    </div>
                    <div className="h-6 w-0.5 border-l-2 border-dashed border-[#00FF9C]/30 my-0.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Aggregated Pipeline Results */}
        {pipelineOutput && (
          <div className="mt-6 rounded-xl border border-[#00FF9C]/40 bg-[#00FF9C]/5 p-5 space-y-4 font-sans animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#00FF9C]/20 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#00FF9C]" />
                <h4 className="text-sm font-bold text-white font-mono">
                  {lang === 'ar' ? 'مخرجات خط العمل المؤتمت' : 'Consolidated Pipeline Output'}
                </h4>
              </div>
              <Badge variant="success" size="sm" className="font-mono">
                {pipelineOutput.length} {lang === 'ar' ? 'سجلات مؤكدة مستخرجة' : 'Verified Leads Generated'}
              </Badge>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#00FF9C]/20 bg-[#050505]">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="border-b border-[#1E1E1E] bg-[#090909] text-[#808080] font-mono">
                  <tr>
                    <th className="px-3.5 py-2.5 font-semibold">{lang === 'ar' ? 'الاسم والمنصب' : 'Name & Role'}</th>
                    <th className="px-3.5 py-2.5 font-semibold">{lang === 'ar' ? 'البريد المؤكد' : 'Verified Email'}</th>
                    <th className="px-3.5 py-2.5 font-semibold">{lang === 'ar' ? 'الهاتف' : 'Direct Phone'}</th>
                    <th className="px-3.5 py-2.5 font-semibold">{lang === 'ar' ? 'التحليل الذكي' : 'AI Summary'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181818] font-mono text-[11px]">
                  {pipelineOutput.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#0E0E0E] transition">
                      <td className="px-3.5 py-2.5 font-sans font-bold text-[#EAEAEA]">{item.entity}</td>
                      <td className="px-3.5 py-2.5 text-[#00FF9C]">{item.verifiedEmail}</td>
                      <td className="px-3.5 py-2.5 text-[#FFB800]">{item.phone}</td>
                      <td className="px-3.5 py-2.5 font-sans text-[#B0B0B0]">{item.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cron Scheduler Modal */}
      {isScheduleModalOpen && (
        <CronScheduleModal
          workflowTitle={lang === 'ar' ? selectedWorkflow.titleAr : selectedWorkflow.title}
          workflowId={selectedWorkflow.id}
          lang={lang}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </div>
  );
};
