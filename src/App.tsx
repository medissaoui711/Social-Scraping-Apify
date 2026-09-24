import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { ModernTopBar } from './components/ModernTopBar';
import { SystemDashboard } from './components/SystemDashboard';
import { CommandPalette } from './components/CommandPalette';
import { ApiExplorer } from './components/ApiExplorer';
import { ApiDetailModal } from './components/ApiDetailModal';
import { PlaygroundStudio } from './components/PlaygroundStudio';
import { PipelineBuilder } from './components/PipelineBuilder';
import { SchemaBuilder } from './components/SchemaBuilder';
import { AiOrchestrator } from './components/AiOrchestrator';
import { CodeStudio } from './components/CodeStudio';
import { TelemetryDashboard } from './components/TelemetryDashboard';
import { ScrapingApiItem } from './types';
import { 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Workflow, 
  Play, 
  Code2, 
  Globe2,
  Cpu,
  Github,
  Heart
} from 'lucide-react';

function AppContent() {
  const {
    state,
    setLang,
    setActiveTab,
    setSelectedApi,
    setInspectedApi,
    setIsCommandOpen,
    setApifyToken,
    selectForPlayground,
    selectForCode,
  } = useApp();

  const { apis, activeTab, selectedApi, inspectedApi, isCommandOpen, lang, apifyToken } = state;

  return (
    <div className="min-h-screen bg-[#050505] text-[#D1D1D1] flex flex-col md:flex-row font-sans selection:bg-[#00FF9C]/20 selection:text-[#00FF9C]">
      {/* Modern Collapsible Sidebar / Icon Rail */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenCommand={() => setIsCommandOpen(true)}
        totalApisCount={apis.length}
      />

      {/* Main Content Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        {/* Sticky Modern Top Bar / Command Header */}
        <ModernTopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          onOpenCommand={() => setIsCommandOpen(true)}
          apifyToken={apifyToken}
          setApifyToken={setApifyToken}
          totalApisCount={apis.length}
        />

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <SystemDashboard
              apis={apis}
              onNavigateTab={setActiveTab}
              onSelectApiForPlayground={selectForPlayground}
              onSelectApiForCode={selectForCode}
              lang={lang}
            />
          )}

          {activeTab === 'explorer' && (
            <ApiExplorer
              apis={apis}
              onSelectApiForPlayground={selectForPlayground}
              onSelectApiForCode={selectForCode}
              onInspectApi={(api) => setInspectedApi(api)}
              lang={lang}
            />
          )}

          {activeTab === 'playground' && (
            <PlaygroundStudio
              apis={apis}
              selectedApi={selectedApi}
              onSelectApi={setSelectedApi}
              apifyToken={apifyToken}
              lang={lang}
            />
          )}

          {activeTab === 'pipelines' && (
            <PipelineBuilder
              apis={apis}
              onSelectForPlayground={selectForPlayground}
              lang={lang}
            />
          )}

          {activeTab === 'schema-builder' && (
            <SchemaBuilder
              lang={lang}
              onApplySchemaToPlayground={(sampleJson) => {
                setActiveTab('playground');
              }}
            />
          )}

          {activeTab === 'ai-architect' && (
            <AiOrchestrator
              onSelectForPlayground={selectForPlayground}
              lang={lang}
            />
          )}

          {activeTab === 'code-studio' && (
            <CodeStudio
              apis={apis}
              selectedApi={selectedApi}
              onSelectApi={setSelectedApi}
              apifyToken={apifyToken}
              lang={lang}
            />
          )}

          {activeTab === 'telemetry' && (
            <TelemetryDashboard
              apis={apis}
              onSelectForPlayground={selectForPlayground}
              lang={lang}
            />
          )}
        </main>

        {/* Technical Terminal Status Footer */}
        <footer className="border-t border-[#1C1C1C] bg-[#070707] text-xs text-[#808080] py-6 px-4 font-mono">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#00FF9C]/30 bg-[#00FF9C]/10 text-[#00FF9C]">
                <Terminal className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-bold text-[#EAEAEA] font-sans text-xs tracking-tight">
                  OSIRIS-X — <span className="text-[#00FF9C]">v2.6 Enterprise System</span>
                </div>
                <div className="text-[10px] text-[#666666]">
                  Index: 3,268 Production Actors | TLS 1.3 Anti-Fingerprint | Residential Mesh
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-[#00FF9C] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] animate-ping" />
                <span>14,850 NODES</span>
              </span>
              <span className="text-[#333333]">|</span>
              <span className="text-[#A0A0A0]">ENGINE: GEMINI 3.7</span>
              <span className="text-[#333333]">|</span>
              <span className="text-[#808080]">SLA: 99.98%</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Inspector */}
      {inspectedApi && (
        <ApiDetailModal
          api={inspectedApi}
          onClose={() => setInspectedApi(null)}
          onSelectForPlayground={selectForPlayground}
          onSelectForCode={selectForCode}
          lang={lang}
        />
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        apis={apis}
        onSelectApi={(api) => selectForPlayground(api)}
        onNavigateTab={setActiveTab}
        lang={lang}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
