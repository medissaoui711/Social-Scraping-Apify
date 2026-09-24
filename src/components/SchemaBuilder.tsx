import React, { useState } from 'react';
import { 
  FileCode2, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  Sparkles, 
  Layers, 
  Sliders, 
  Code, 
  Save, 
  HelpCircle,
  FolderDown,
  RotateCw
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';

interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  title: string;
  description: string;
  defaultVal: any;
  required: boolean;
}

interface SchemaBuilderProps {
  lang: 'ar' | 'en';
  onApplySchemaToPlayground?: (schemaJson: string) => void;
}

export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({
  lang,
  onApplySchemaToPlayground
}) => {
  const [actorName, setActorName] = useState<string>('Custom Social Scraper Actor');
  const [fields, setFields] = useState<SchemaField[]>([
    {
      id: 'f-1',
      name: 'startUrls',
      type: 'array',
      title: 'Target URLs / Profiles',
      description: 'List of target profile or post URLs to extract data from',
      defaultVal: '["https://instagram.com/techinsider"]',
      required: true
    },
    {
      id: 'f-2',
      name: 'maxItems',
      type: 'number',
      title: 'Max Items to Scrape',
      description: 'Cap the total count of posts or profiles collected',
      defaultVal: '50',
      required: false
    },
    {
      id: 'f-3',
      name: 'proxyConfig',
      type: 'object',
      title: 'Proxy Configuration',
      description: 'Residential proxy and anti-bot bypass settings',
      defaultVal: '{\n  "useApifyProxy": true,\n  "apifyProxyGroups": ["RESIDENTIAL"],\n  "apifyProxyCountry": "US"\n}',
      required: true
    },
    {
      id: 'f-4',
      name: 'extendOutputFunction',
      type: 'string',
      title: 'Custom Evaluation Code',
      description: 'JavaScript transformer function executed on each scraped page',
      defaultVal: '($) => { return { scrapedAt: new Date().toISOString() }; }',
      required: false
    }
  ]);

  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  const addField = () => {
    const newField: SchemaField = {
      id: `f-${Date.now()}`,
      name: `field_${fields.length + 1}`,
      type: 'string',
      title: `Field ${fields.length + 1}`,
      description: 'Field description here',
      defaultVal: '',
      required: false
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  // Generate Official Apify / JSON Schema Specification
  const generateFullSchema = () => {
    const properties: Record<string, any> = {};
    const requiredList: string[] = [];

    fields.forEach(f => {
      let parsedDef: any = f.defaultVal;
      if (f.type === 'number') parsedDef = Number(f.defaultVal) || 0;
      if (f.type === 'boolean') parsedDef = f.defaultVal === 'true' || f.defaultVal === true;
      if (f.type === 'array' || f.type === 'object') {
        try {
          parsedDef = JSON.parse(f.defaultVal);
        } catch (e) {
          parsedDef = f.defaultVal;
        }
      }

      properties[f.name] = {
        title: f.title,
        type: f.type === 'array' ? 'array' : f.type === 'object' ? 'object' : f.type,
        description: f.description,
        default: parsedDef,
        editor: f.type === 'string' ? 'textfield' : f.type === 'number' ? 'number' : f.type === 'boolean' ? 'checkbox' : 'json'
      };

      if (f.required) {
        requiredList.push(f.name);
      }
    });

    const schemaObj = {
      title: actorName,
      type: 'object',
      schemaVersion: 1,
      properties,
      required: requiredList
    };

    return JSON.stringify(schemaObj, null, 2);
  };

  // Generate Sample Runtime Input JSON
  const generateSampleInput = () => {
    const inputObj: Record<string, any> = {};
    fields.forEach(f => {
      let val: any = f.defaultVal;
      if (f.type === 'number') val = Number(f.defaultVal) || 0;
      if (f.type === 'boolean') val = f.defaultVal === 'true' || f.defaultVal === true;
      if (f.type === 'array' || f.type === 'object') {
        try {
          val = JSON.parse(f.defaultVal);
        } catch (e) {
          val = f.defaultVal;
        }
      }
      inputObj[f.name] = val;
    });
    return JSON.stringify(inputObj, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFullSchema());
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 1500);
  };

  const handleApplyToPlayground = () => {
    if (onApplySchemaToPlayground) {
      onApplySchemaToPlayground(generateSampleInput());
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#242424] bg-[#090909] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#00FF9C]/40 bg-[#00FF9C]/10 text-[#00FF9C]">
            <FileCode2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-mono">
                {lang === 'ar' ? 'مُهندس مخططات الـ Schemas ومُدخلات الـ Actors' : 'Custom Actor Input Schema Builder'}
              </h2>
              <Badge variant="primary" size="xs">
                Specification v1.0
              </Badge>
            </div>
            <p className="text-xs text-[#808080]">
              {lang === 'ar'
                ? 'قم بإنشاء وتعديل مدخلات الـ JSON ومواصفات Actor Input Schema المعتمدة مع التحقق الفوري.'
                : 'Construct, edit, and validate official Apify JSON Schema specifications and runtime input payloads.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <Button
            variant="outline"
            size="sm"
            onClick={addField}
            leftIcon={<Plus className="h-3.5 w-3.5 text-[#00FF9C]" />}
          >
            {lang === 'ar' ? 'إضافة حقل جديد' : 'Add Property'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopy}
            leftIcon={copiedSchema ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          >
            {copiedSchema ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الـ Schema' : 'Copy Schema')}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Schema Fields Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
              <div className="font-mono text-xs font-bold text-[#EAEAEA] flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#00FF9C]" />
                <span>{lang === 'ar' ? 'إعدادات الحقول والخصائص' : 'Properties & Validation Rules'}</span>
              </div>
              <span className="font-mono text-[11px] text-[#707070]">{fields.length} Defined Fields</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[#808080]">{lang === 'ar' ? 'اسم الـ Actor المخصص:' : 'Custom Actor Name:'}</label>
              <input
                type="text"
                value={actorName}
                onChange={(e) => setActorName(e.target.value)}
                className="w-full rounded-lg border border-[#242424] bg-[#050505] px-3 py-2 text-xs font-mono text-white focus:border-[#00FF9C] focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-[#202020] bg-[#050505] p-4 space-y-3 font-mono text-xs hover:border-[#00FF9C]/30 transition"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#181818] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-[#111111] border border-[#262626] flex items-center justify-center text-[10px] text-[#00FF9C] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white">{field.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-[11px] text-[#808080] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="rounded accent-[#00FF9C] cursor-pointer"
                        />
                        <span>{lang === 'ar' ? 'إلزامي' : 'Required'}</span>
                      </label>
                      <button
                        onClick={() => removeField(field.id)}
                        className="text-[#666666] hover:text-rose-400 p-1 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#707070]">{lang === 'ar' ? 'اسم المتغير (Key):' : 'Key Name:'}</label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        className="w-full rounded border border-[#242424] bg-[#0A0A0A] px-2 py-1 text-xs text-[#00FF9C] focus:border-[#00FF9C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#707070]">{lang === 'ar' ? 'النوع (Type):' : 'Data Type:'}</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                        className="w-full rounded border border-[#242424] bg-[#0A0A0A] px-2 py-1 text-xs text-white focus:border-[#00FF9C] focus:outline-none"
                      >
                        <option value="string">string (Text)</option>
                        <option value="number">number (Integer/Float)</option>
                        <option value="boolean">boolean (True/False)</option>
                        <option value="array">array (List)</option>
                        <option value="object">object (JSON Map)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#707070]">{lang === 'ar' ? 'العنوان المعروض:' : 'Display Title:'}</label>
                      <input
                        type="text"
                        value={field.title}
                        onChange={(e) => updateField(field.id, { title: e.target.value })}
                        className="w-full rounded border border-[#242424] bg-[#0A0A0A] px-2 py-1 text-xs text-white focus:border-[#00FF9C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#707070]">{lang === 'ar' ? 'الوصف التوضيحي:' : 'Description:'}</label>
                    <input
                      type="text"
                      value={field.description}
                      onChange={(e) => updateField(field.id, { description: e.target.value })}
                      className="w-full rounded border border-[#242424] bg-[#0A0A0A] px-2 py-1 text-xs text-[#B0B0B0] focus:border-[#00FF9C] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#707070]">{lang === 'ar' ? 'القيمة الافتراضية:' : 'Default Value:'}</label>
                    {field.type === 'object' || field.type === 'array' ? (
                      <textarea
                        rows={2}
                        value={field.defaultVal}
                        onChange={(e) => updateField(field.id, { defaultVal: e.target.value })}
                        className="w-full rounded border border-[#242424] bg-[#0A0A0A] px-2 py-1 text-xs text-[#00FF9C] font-mono focus:border-[#00FF9C] focus:outline-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={field.defaultVal}
                        onChange={(e) => updateField(field.id, { defaultVal: e.target.value })}
                        className="w-full rounded border border-[#242424] bg-[#0A0A0A] px-2 py-1 text-xs text-white focus:border-[#00FF9C] focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Compiled Schema JSON output (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-[#242424] bg-[#090909] p-5 space-y-3 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#EAEAEA]">
                <Code className="h-4 w-4 text-[#00FF9C]" />
                <span>INPUT_SCHEMA.json</span>
              </div>
              <Badge variant="success" size="xs">
                Valid JSON
              </Badge>
            </div>

            <div className="max-h-96 overflow-y-auto rounded-lg border border-[#202020] bg-[#050505] p-3 text-[11px] text-[#00FF9C] leading-relaxed">
              <pre>{generateFullSchema()}</pre>
            </div>

            <div className="pt-2 border-t border-[#1C1C1C] flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                leftIcon={<Copy className="h-3.5 w-3.5 text-[#00FF9C]" />}
                className="w-full"
              >
                {lang === 'ar' ? 'نسخ مواصفات Schema' : 'Copy Schema Definition'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
