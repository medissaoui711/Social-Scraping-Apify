import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  Zap, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  BellRing
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface CronScheduleModalProps {
  workflowTitle: string;
  workflowId: string;
  lang: 'ar' | 'en';
  onClose: () => void;
}

export const CronScheduleModal: React.FC<CronScheduleModalProps> = ({
  workflowTitle,
  workflowId,
  lang,
  onClose,
}) => {
  const [frequency, setFrequency] = useState<'hourly' | 'daily' | 'weekly' | 'custom'>('daily');
  const [timeHour, setTimeHour] = useState<string>('09:00');
  const [customCron, setCustomCron] = useState<string>('0 9 * * *');
  const [webhookUrl, setWebhookUrl] = useState<string>('https://api.yourdomain.com/webhooks/osiris-leads');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Derive cron expression
  const getComputedCron = () => {
    if (frequency === 'hourly') return '0 * * * *';
    if (frequency === 'daily') {
      const [h, m] = timeHour.split(':');
      return `${parseInt(m, 10) || 0} ${parseInt(h, 10) || 9} * * *`;
    }
    if (frequency === 'weekly') {
      const [h, m] = timeHour.split(':');
      return `${parseInt(m, 10) || 0} ${parseInt(h, 10) || 9} * * 1`;
    }
    return customCron;
  };

  const activeCron = getComputedCron();

  // Generate Curl trigger snippet
  const generatedCurl = `curl -X POST "https://api.apify.com/v2/actor-tasks/${workflowId}/runs" \\
  -H "Authorization: Bearer YOUR_APIFY_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "schedule": "${activeCron}",
    "webhookUrl": "${webhookUrl}"
  }'`;

  // Generate Python Celery / APScheduler snippet
  const generatedPython = `from apscheduler.schedulers.blocking import BlockingScheduler
import requests

scheduler = BlockingScheduler()

@scheduler.scheduled_job('cron', hour=${timeHour.split(':')[0] || 9}, minute=${timeHour.split(':')[1] || 0})
def run_osiris_pipeline():
    res = requests.post(
        "https://api.apify.com/v2/actor-tasks/${workflowId}/runs",
        headers={"Authorization": "Bearer YOUR_APIFY_TOKEN"},
        json={"webhook": "${webhookUrl}"}
    )
    print(f"Triggered workflow: {res.status_code}")

scheduler.start()`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleSaveSchedule = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#262626] bg-[#0A0A0A] shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E1E1E] bg-[#080808] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00FF9C]/30 bg-[#00FF9C]/10 text-[#00FF9C]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                {lang === 'ar' ? 'جدولة التشغيل التلقائي (Cron Scheduler)' : 'Automated Cron & Webhook Dispatcher'}
              </h2>
              <p className="text-xs text-[#707070] font-sans">
                {workflowTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-[#222222] bg-[#050505] p-2 text-[#808080] hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto font-mono text-xs">
          {/* Frequency Selector */}
          <div className="space-y-2">
            <label className="text-[#808080] font-semibold uppercase text-[11px] block">
              {lang === 'ar' ? 'تكرار التشغيل الدوري:' : 'Execution Frequency:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'hourly', labelAr: 'كل ساعة', labelEn: 'Hourly' },
                { id: 'daily', labelAr: 'يومياً', labelEn: 'Daily' },
                { id: 'weekly', labelAr: 'أسبوعياً', labelEn: 'Weekly' },
                { id: 'custom', labelAr: 'مخصص (Cron)', labelEn: 'Custom Cron' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFrequency(item.id as any)}
                  className={`rounded-lg border p-2.5 text-center transition font-sans text-xs ${
                    frequency === item.id
                      ? 'border-[#00FF9C] bg-[#00FF9C]/10 text-[#00FF9C] font-bold'
                      : 'border-[#222222] bg-[#050505] text-[#808080] hover:border-[#333333] hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? item.labelAr : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker or Custom Input */}
          {frequency !== 'custom' && frequency !== 'hourly' && (
            <div className="space-y-1.5">
              <label className="text-[#808080] text-[11px] block">
                {lang === 'ar' ? 'وقت التشغيل (توقيت الخادم UTC):' : 'Execution Time (UTC):'}
              </label>
              <input
                type="time"
                value={timeHour}
                onChange={(e) => setTimeHour(e.target.value)}
                className="rounded-lg border border-[#242424] bg-[#050505] px-3 py-2 text-white font-mono focus:border-[#00FF9C] focus:outline-none"
              />
            </div>
          )}

          {frequency === 'custom' && (
            <div className="space-y-1.5">
              <label className="text-[#808080] text-[11px] block">
                {lang === 'ar' ? 'تعبير Cron المخصص (5 حقول):' : 'Custom 5-field Cron Expression:'}
              </label>
              <input
                type="text"
                value={customCron}
                onChange={(e) => setCustomCron(e.target.value)}
                placeholder="*/30 * * * *"
                className="w-full rounded-lg border border-[#242424] bg-[#050505] px-3 py-2 text-[#00FF9C] font-mono focus:border-[#00FF9C] focus:outline-none"
              />
            </div>
          )}

          {/* Calculated Cron Box */}
          <div className="flex items-center justify-between rounded-lg border border-[#1C1C1C] bg-[#050505] p-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Terminal className="h-4 w-4 text-[#00FF9C]" />
              <span>Cron Expression:</span>
              <span className="rounded bg-[#111111] px-2 py-0.5 text-[#00FF9C] border border-[#242424]">
                {activeCron}
              </span>
            </div>
            <button
              onClick={() => handleCopy(activeCron, 'cron')}
              className="text-[#808080] hover:text-white"
            >
              {copiedCode === 'cron' ? <Check className="h-4 w-4 text-[#00FF9C]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {/* Webhook notification endpoint */}
          <div className="space-y-1.5">
            <label className="text-[#808080] text-[11px] block flex items-center justify-between">
              <span>{lang === 'ar' ? 'رابط الـ Webhook لتلقي النتائج فور الانتهاء:' : 'Webhook Destination URL (POST payload):'}</span>
              <span className="text-[#00FF9C] text-[10px]">Auto-Trigger Ready</span>
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full rounded-lg border border-[#242424] bg-[#050505] px-3 py-2 text-[#EAEAEA] font-mono focus:border-[#00FF9C] focus:outline-none text-xs"
            />
          </div>

          {/* Generated cURL code trigger */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#808080] text-[11px] uppercase">{lang === 'ar' ? 'أمر التشغيل البرمجي عبر cURL:' : 'Instant Trigger Command (cURL):'}</span>
              <button
                onClick={() => handleCopy(generatedCurl, 'curl')}
                className="text-[#00FF9C] hover:underline flex items-center gap-1 text-[11px]"
              >
                {copiedCode === 'curl' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode === 'curl' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-3 text-[11px] text-[#00FF9C] overflow-x-auto whitespace-pre-wrap font-mono">
              {generatedCurl}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1E1E1E] bg-[#080808] px-6 py-4">
          <div className="text-[11px] text-[#707070] font-mono flex items-center gap-1.5">
            <BellRing className="h-3.5 w-3.5 text-[#00FF9C]" />
            <span>{lang === 'ar' ? 'الجدولة متوافقة مع Apify Schedules و Kubernetes CronJobs' : 'Compatible with Apify Schedules & Cloud Cron'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="font-mono text-xs"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveSchedule}
              leftIcon={isSaved ? <CheckCircle2 className="h-4 w-4 fill-black" /> : <Zap className="h-4 w-4 fill-black" />}
              className="font-mono text-xs font-bold"
            >
              {isSaved
                ? (lang === 'ar' ? 'تم الحفظ والجدولة!' : 'Schedule Activated!')
                : (lang === 'ar' ? 'تفعيل الجدولة الذكية ⚡' : 'Activate Schedule ⚡')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
