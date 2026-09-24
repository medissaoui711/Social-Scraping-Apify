export interface ScrapingApiItem {
  id: string;
  name: string;
  slug: string;
  author: string;
  actorId: string;
  url: string;
  description: string;
  platform: string;
  icon: string;
  tags: string[];
  pricing: string;
  rating: number;
  runsCount: number;
  successRate: number;
  avgRunTimeSec: number;
  defaultInput: Record<string, any>;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'network';
  message: string;
  data?: any;
}

export interface ExecutionRun {
  id: string;
  apiId: string;
  actorName: string;
  startedAt: string;
  durationMs: number;
  status: 'idle' | 'running' | 'success' | 'failed';
  itemCount: number;
  memoryMb: number;
  payload: Record<string, any>;
  results: any[];
  logs: ExecutionLog[];
}

export interface PipelineStep {
  id: string;
  title: string;
  actorId: string;
  actorName: string;
  platform: string;
  actionType: 'scrape' | 'enrich' | 'filter' | 'ai_analyze' | 'export';
  customInput: Record<string, any>;
  isEnabled: boolean;
}

export interface PipelineWorkflow {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  steps: PipelineStep[];
  tags: string[];
  runsCount: number;
  category: string;
}

export type CodeLanguage = 'curl' | 'python' | 'nodejs' | 'go' | 'php' | 'rust';

export interface AIRecommendation {
  query: string;
  summary: string;
  summaryAr: string;
  recommendedApis: ScrapingApiItem[];
  suggestedPipeline: {
    step: number;
    title: string;
    description: string;
    actor: string;
  }[];
  generatedScript: {
    language: string;
    code: string;
  };
  estimatedCost: string;
  estimatedRuntime: string;
}
