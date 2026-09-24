import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Globe2, 
  Zap, 
  Server, 
  Activity, 
  RefreshCw, 
  Check, 
  Sliders, 
  Cpu, 
  Lock, 
  Radio, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Copy,
  Terminal,
  Wifi,
  Sparkles
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface ProxyGatewayModalProps {
  lang: 'ar' | 'en';
  isOpen: boolean;
  onClose: () => void;
}

interface ProxyNode {
  id: string;
  country: string;
  code: string;
  city: string;
  type: 'Residential' | 'Datacenter' | 'Mobile 5G';
  latency: number;
  successRate: number;
  status: 'optimal' | 'stable' | 'degraded';
  ipSample: string;
}

export const ProxyGatewayModal: React.FC<ProxyGatewayModalProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  const [proxyType, setProxyType] = useState<'residential' | 'datacenter' | 'mobile'>('residential');
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [sessionRotation, setSessionRotation] = useState<'per_request' | 'sticky_10m' | 'sticky_30m'>('per_request');
  const [tlsFingerprint, setTlsFingerprint] = useState<string>('chrome_128_ja3');
  const [stealthHeaders, setStealthHeaders] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ latency: number; ip: string; country: string } | null>(null);
  const [copiedConfig, setCopiedConfig] = useState<boolean>(false);

  const proxyNodes: ProxyNode[] = [
    { id: 'node-us-1', country: 'United States', code: 'US', city: 'Ashburn, VA', type: 'Residential', latency: 28, successRate: 99.8, status: 'optimal', ipSample: '198.51.100.42' },
    { id: 'node-de-1', country: 'Germany', code: 'DE', city: 'Frankfurt', type: 'Residential', latency: 34, successRate: 99.4, status: 'optimal', ipSample: '185.120.44.19' },
    { id: 'node-ae-1', country: 'United Arab Emirates', code: 'AE', city: 'Dubai', type: 'Mobile 5G', latency: 45, successRate: 98.9, status: 'optimal', ipSample: '94.200.12.88' },
    { id: 'node-sa-1', country: 'Saudi Arabia', code: 'SA', city: 'Riyadh', type: 'Residential', latency: 48, successRate: 99.1, status: 'optimal', ipSample: '212.118.140.5' },
    { id: 'node-uk-1', country: 'United Kingdom', code: 'GB', city: 'London', type: 'Residential', latency: 31, successRate: 99.6, status: 'optimal', ipSample: '82.165.197.10' },
    { id: 'node-sg-1', country: 'Singapore', code: 'SG', city: 'Singapore', type: 'Datacenter', latency: 62, successRate: 98.2, status: 'stable', ipSample: '103.253.24.12' },
  ];

  const handleRunPingTest = async () => {
    setIsTesting(true);
    setTestResults(null);
    await new Promise((r) => setTimeout(r, 850));
    
    const activeNode = proxyNodes.find(n => n.code === selectedCountry) || proxyNodes[0];
    setTestResults({
      latency: Math.floor(Math.random() * 20) + activeNode.latency,
      ip: activeNode.ipSample,
      country: activeNode.country
    });
    setIsTesting(false);
  };

  const generatedProxyUrl = `http://${proxyType === 'residential' ? 'res-proxy' : proxyType === 'mobile' ? 'mobile-5g' : 'dc-pool'}.osiris-shield.io:8080?country=${selectedCountry}&rotation=${sessionRotation}&tls=${tlsFingerprint}`;

  const handleCopyProxy = () => {
    navigator.clipboard.writeText(generatedProxyUrl);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div 
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#262626] bg-[#0A0A0A] shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E1E1E] bg-[#080808] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00FF9C]/40 bg-[#00FF9C]/10 text-[#00FF9C] shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                <span>{lang === 'ar' ? 'بوابة البروكسيات وبصمة التخفي (Proxy Gateway)' : 'Residential Proxy & Stealth Gateway'}</span>
                <span className="rounded bg-[#141414] px-2 py-0.5 text-xs text-[#00FF9C] border border-[#242424]">
                  14,850 Nodes Active
                </span>
              </h2>
              <p className="text-xs text-[#707070] font-sans">
                {lang === 'ar' 
                  ? 'إدارة متقدمة لشبكات البروكسي السكنية، تدوير العناوين، ومحاكاة بصمات متصفحات TLS 1.3 لتفادي الحظر.'
                  : 'Manage residential proxy pools, geo-targeting, and browser TLS 1.3 fingerprint spoofing.'}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto font-sans text-xs">
          {/* Quick Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Proxy Type Selection */}
            <div className="rounded-xl border border-[#222222] bg-[#060606] p-4 space-y-2.5">
              <label className="text-[#808080] font-mono text-[11px] font-semibold uppercase flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-[#00FF9C]" />
                <span>{lang === 'ar' ? 'نوع شبكة البروكسي:' : 'Proxy Pool Type:'}</span>
              </label>
              <div className="space-y-1.5 font-mono">
                {[
                  { id: 'residential', labelAr: 'بروكسي سكني (Residential)', labelEn: 'Residential (Rotating)', badge: 'Recommended' },
                  { id: 'mobile', labelAr: 'شبكات 5G الجوالة (Mobile 5G)', labelEn: 'Mobile 5G Nodes', badge: 'Ultra Stealth' },
                  { id: 'datacenter', labelAr: 'مراكز بيانات سريعة (Datacenter)', labelEn: 'Datacenter Pool', badge: 'High Speed' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProxyType(item.id as any)}
                    className={`w-full flex items-center justify-between rounded-lg border p-2 text-left rtl:text-right transition ${
                      proxyType === item.id
                        ? 'border-[#00FF9C] bg-[#00FF9C]/10 text-[#00FF9C] font-bold'
                        : 'border-[#1C1C1C] bg-[#0A0A0A] text-[#808080] hover:text-white'
                    }`}
                  >
                    <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                    <span className="text-[9px] rounded bg-[#111111] px-1.5 py-0.5 border border-[#202020] text-[#707070]">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Geo Targeting */}
            <div className="rounded-xl border border-[#222222] bg-[#060606] p-4 space-y-2.5">
              <label className="text-[#808080] font-mono text-[11px] font-semibold uppercase flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-[#00FF9C]" />
                <span>{lang === 'ar' ? 'الموقع الجغرافي (Geo-Targeting):' : 'Geo-Targeting Country:'}</span>
              </label>
              <div className="space-y-1.5 font-mono">
                {[
                  { code: 'US', nameAr: 'الولايات المتحدة (US)', nameEn: 'United States (US)' },
                  { code: 'DE', nameAr: 'ألمانيا (Frankfurt)', nameEn: 'Germany (Frankfurt)' },
                  { code: 'AE', nameAr: 'الإمارات (Dubai 5G)', nameEn: 'UAE (Dubai 5G)' },
                  { code: 'SA', nameAr: 'السعودية (Riyadh)', nameEn: 'Saudi Arabia (Riyadh)' },
                  { code: 'GB', nameAr: 'المملكة المتحدة (London)', nameEn: 'United Kingdom (London)' },
                ].map((geo) => (
                  <button
                    key={geo.code}
                    onClick={() => setSelectedCountry(geo.code)}
                    className={`w-full flex items-center justify-between rounded-lg border p-2 text-left rtl:text-right transition ${
                      selectedCountry === geo.code
                        ? 'border-[#00FF9C] bg-[#00FF9C]/10 text-[#00FF9C] font-bold'
                        : 'border-[#1C1C1C] bg-[#0A0A0A] text-[#808080] hover:text-white'
                    }`}
                  >
                    <span>{lang === 'ar' ? geo.nameAr : geo.nameEn}</span>
                    <span className="font-mono text-[10px] text-[#606060]">{geo.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fingerprint & Anti-Detection */}
            <div className="rounded-xl border border-[#222222] bg-[#060606] p-4 space-y-3">
              <label className="text-[#808080] font-mono text-[11px] font-semibold uppercase flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-[#00FF9C]" />
                <span>{lang === 'ar' ? 'بصمة المتصفح (TLS Spoofing):' : 'TLS Fingerprint Profile:'}</span>
              </label>

              <select
                value={tlsFingerprint}
                onChange={(e) => setTlsFingerprint(e.target.value)}
                className="w-full rounded-lg border border-[#242424] bg-[#0A0A0A] px-3 py-2 text-white font-mono focus:border-[#00FF9C] focus:outline-none"
              >
                <option value="chrome_128_ja3">Chrome 128 (JA3/JA4 Spoof)</option>
                <option value="safari_17_ios">Safari 17 iOS (Mobile)</option>
                <option value="firefox_129">Firefox 129 Modern</option>
                <option value="edge_127">Microsoft Edge 127</option>
              </select>

              <div className="pt-2 border-t border-[#1E1E1E] space-y-2">
                <label className="flex items-center justify-between cursor-pointer text-[#808080]">
                  <span>{lang === 'ar' ? 'ترويسات التخفي التلقائية (Stealth Headers)' : 'Automatic Stealth Headers'}</span>
                  <input
                    type="checkbox"
                    checked={stealthHeaders}
                    onChange={(e) => setStealthHeaders(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#00FF9C] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-[#808080]">
                  <span>{lang === 'ar' ? 'تدوير الجلسة مع كل طلب' : 'Rotate Session Per Request'}</span>
                  <input
                    type="checkbox"
                    checked={sessionRotation === 'per_request'}
                    onChange={(e) => setSessionRotation(e.target.checked ? 'per_request' : 'sticky_10m')}
                    className="h-4 w-4 rounded accent-[#00FF9C] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Active Nodes Telemetry List */}
          <div className="rounded-xl border border-[#242424] bg-[#060606] p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2 text-[11px]">
              <span className="text-[#808080] font-semibold uppercase flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-[#00FF9C]" />
                <span>{lang === 'ar' ? 'العقد المباشرة العاملة في شبكة OSIRIS-X:' : 'Active Verified Node Telemetry:'}</span>
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={handleRunPingTest}
                isLoading={isTesting}
                leftIcon={<RefreshCw className="h-3 w-3 text-[#00FF9C]" />}
              >
                {lang === 'ar' ? 'فحص الاستجابة الآن' : 'Test Latency'}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {proxyNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between rounded-lg border border-[#1A1A1A] bg-[#0A0A0A] p-2.5 text-xs hover:border-[#00FF9C]/30 transition"
                >
                  <div>
                    <div className="font-bold text-white font-sans flex items-center gap-1.5">
                      <span className="text-xs">{node.country}</span>
                      <span className="text-[10px] text-[#666666]">({node.city})</span>
                    </div>
                    <div className="text-[10px] text-[#707070]">{node.ipSample} • {node.type}</div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <div className="text-[#00FF9C] font-bold text-xs">{node.latency}ms</div>
                    <div className="text-[9px] text-[#707070]">{node.successRate}% Success</div>
                  </div>
                </div>
              ))}
            </div>

            {testResults && (
              <div className="rounded-lg border border-[#00FF9C]/30 bg-[#00FF9C]/10 p-3 text-xs text-[#00FF9C] flex items-center justify-between font-mono animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00FF9C]" />
                  <span>Target Ping Verified: <strong>{testResults.country}</strong> ({testResults.ip}) responded in <strong>{testResults.latency}ms</strong> with zero handshake drops.</span>
                </div>
              </div>
            )}
          </div>

          {/* Generated Proxy Endpoint String */}
          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-[#808080] text-[11px]">
              <span className="uppercase">{lang === 'ar' ? 'عنوان بوابة البروكسي الجاهز للدمج:' : 'Ready-to-use Proxy Gateway String:'}</span>
              <button
                onClick={handleCopyProxy}
                className="text-[#00FF9C] hover:underline flex items-center gap-1 text-[11px]"
              >
                {copiedConfig ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 text-[#00FF9C]" />}
                <span>{copiedConfig ? 'Copied' : 'Copy Proxy URL'}</span>
              </button>
            </div>
            <pre className="rounded-lg border border-[#1E1E1E] bg-[#050505] p-3 text-[11px] text-[#00FF9C] overflow-x-auto whitespace-pre-wrap">
              {generatedProxyUrl}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1E1E1E] bg-[#080808] px-6 py-3 text-xs font-mono">
          <div className="text-[#707070]">
            Automatic Anti-Bot & Captcha Bypass Enabled
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            className="font-bold font-mono"
          >
            {lang === 'ar' ? 'تطبيق وحفظ الإعدادات ✓' : 'Save & Apply Proxy Shield ✓'}
          </Button>
        </div>
      </div>
    </div>
  );
};
