import React, { useState, useEffect } from 'react';
import { ArchitectureSimulation, TraceStep } from '../types';
import { architectureSimulations } from '../data/initialData';
import {
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  Server,
  Shield,
  Database,
  Globe,
  Radio,
  Zap,
  Cpu,
  Lock,
  ArrowRight,
  Terminal,
  Activity,
} from 'lucide-react';

interface ArchitectureExplorerProps {
  initialTraceQuery?: string | null;
}

export const ArchitectureExplorer: React.FC<ArchitectureExplorerProps> = ({
  initialTraceQuery,
}) => {
  const [selectedSim, setSelectedSim] = useState<ArchitectureSimulation>(architectureSimulations[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [highlightedLayer, setHighlightedLayer] = useState<string | null>(null);

  // Auto-step simulation timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      if (activeStepIndex < selectedSim.steps.length - 1) {
        timer = setTimeout(() => {
          setActiveStepIndex((prev) => prev + 1);
        }, 750);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeStepIndex, selectedSim]);

  const handleStartSimulation = (sim: ArchitectureSimulation) => {
    setSelectedSim(sim);
    setActiveStepIndex(0);
    setIsPlaying(true);
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    setActiveStepIndex(-1);
    setHighlightedLayer(null);
  };

  // Determine current active step's layer
  const currentStep = activeStepIndex >= 0 ? selectedSim.steps[activeStepIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DDE5F0]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#6FE0B0] bg-[#12234B] px-3 py-1 rounded-full font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-[#6FE0B0]" />
            <span>High-Level Cloud Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12234B]">Layered Cloud-Native Infrastructure</h2>
          <p className="text-sm text-[#5B6478]">
            Interactive system topology mapping citizen portals, microservices, zero-trust common services, distributed data stores, and external integrations.
          </p>
        </div>

        {/* Live Simulator Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStartSimulation(selectedSim)}
            disabled={isPlaying}
            className="px-4 py-2 bg-[#12234B] hover:bg-[#0A1730] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#6FE0B0]" />
            <span>Simulate Request Trace</span>
          </button>
          <button
            onClick={handleResetSimulation}
            className="p-2 bg-white hover:bg-[#EBF1F9] text-[#5B6478] hover:text-[#12234B] border border-[#CBD6E6] rounded-lg transition-colors cursor-pointer shadow-xs"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulation Scenario Selector */}
      <div className="bg-white border border-[#DDE5F0] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <span className="text-xs font-mono-code uppercase tracking-wider text-[#12234B] font-bold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#D97F1F]" />
            <span>Select Transaction Scenario to Trace:</span>
          </span>
          <span className="text-xs text-[#5B6478]">
            {activeStepIndex >= 0 ? `Step ${activeStepIndex + 1} of ${selectedSim.steps.length}` : 'Ready'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {architectureSimulations.map((sim) => (
            <button
              key={sim.id}
              onClick={() => {
                setSelectedSim(sim);
                setActiveStepIndex(-1);
                setIsPlaying(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedSim.id === sim.id
                  ? 'bg-[#12234B] text-white border-[#12234B] shadow-xs'
                  : 'bg-[#F3F7FC] text-[#1B2233] border-[#DDE5F0] hover:border-[#12234B]/40'
              }`}
            >
              <div className="text-xs font-bold truncate mb-0.5">{sim.name}</div>
              <div className={`text-[11px] truncate ${selectedSim.id === sim.id ? 'text-[#9FB3D9]' : 'text-[#5B6478]'}`}>
                {sim.userType}
              </div>
            </button>
          ))}
        </div>

        {/* Live Step Progress / Terminal Output */}
        {activeStepIndex >= 0 && currentStep && (
          <div className="mt-4 p-4 rounded-xl bg-[#0A1730] border border-[#2A4A8C] text-white font-mono-code text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6FE0B0] animate-pulse" />
                <span className="text-[#6FE0B0] font-bold">PACKET AT LAYER: {currentStep.layer.toUpperCase()}</span>
              </div>
              <span className="text-[#B7C4DE] text-[11px]">+{currentStep.latencyMs}ms (Total: {selectedSim.steps.slice(0, activeStepIndex + 1).reduce((a, b) => a + b.latencyMs, 0)}ms)</span>
            </div>
            <div className="text-[#E2EAF4]">
              <span className="text-[#9FB3D9] font-bold">Service:</span> {currentStep.service}
            </div>
            <div className="text-xs text-[#CBD6E6]">{currentStep.description}</div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#6FE0B0]">
              <span>Status: {currentStep.status}</span>
              {activeStepIndex === selectedSim.steps.length - 1 && (
                <span className="text-[#6FE0B0] font-bold">✓ Transaction Complete ({selectedSim.totalLatency}ms)</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5-LAYER INTERACTIVE ARCHITECTURE CANVAS */}
      <div className="bg-[#0A1730] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[#1E356A] shadow-xl">
        <div className="absolute inset-0 bg-dark-grid opacity-75 pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* LAYER 1: USER ACCESS LAYER & EXTERNAL INTEGRATIONS (TOP SPLIT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: User Access Layer (3 Cols) */}
            <div
              onMouseEnter={() => setHighlightedLayer('User Access')}
              onMouseLeave={() => setHighlightedLayer(null)}
              className={`lg:col-span-3 rounded-2xl p-4 border transition-all ${
                currentStep?.layer === 'User Access' || highlightedLayer === 'User Access'
                  ? 'bg-[#12234B] border-[#6FE0B0] ring-2 ring-[#6FE0B0]/40'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#9FB3D9] font-semibold mb-3 flex items-center justify-between">
                <span>User Access Layer</span>
                <Radio className="w-3.5 h-3.5 text-[#6FE0B0]" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#6FE0B0]" />
                  <div>
                    <div className="font-semibold text-white">Web Portal (SPA)</div>
                    <div className="text-[10px] text-[#9FB3D9]">React / Vite / Tailwind</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Radio className="w-4 h-4 text-[#6FE0B0]" />
                  <div>
                    <div className="font-semibold text-white">Mobile App (PWA)</div>
                    <div className="text-[10px] text-[#9FB3D9]">Android / iOS Biometrics</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#6FE0B0]" />
                  <div>
                    <div className="font-semibold text-white">Citizens & Dependents</div>
                    <div className="text-[10px] text-[#9FB3D9]">Multi-tenant access</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Application Layer - Cloud Services (6 Cols) */}
            <div
              onMouseEnter={() => setHighlightedLayer('Microservices')}
              onMouseLeave={() => setHighlightedLayer(null)}
              className={`lg:col-span-6 rounded-2xl p-5 border transition-all ${
                currentStep?.layer === 'Microservices' || currentStep?.layer === 'Common Services' || highlightedLayer === 'Microservices'
                  ? 'bg-[#12234B] border-[#6FE0B0] ring-2 ring-[#6FE0B0]/40'
                  : 'bg-white/5 border-white/15'
              }`}
            >
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#9FB3D9] font-semibold mb-4 text-center">
                Application Layer — Cloud Microservices
              </div>

              {/* 4 Core Module Containers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                
                {/* Mod 1: Personal */}
                <div className="p-3.5 rounded-xl bg-[#1E7D5C]/15 border border-[#1E7D5C]/40 text-xs">
                  <div className="font-semibold text-[#6FE0B0] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1E7D5C]" />
                    <span>Personal Management</span>
                  </div>
                  <ul className="text-[11px] text-white/80 space-y-0.5">
                    <li>• Profile & Sovereign Identity</li>
                    <li>• Family & Dependent Linkage</li>
                    <li>• Contact & Preferences</li>
                  </ul>
                </div>

                {/* Mod 2: Healthcare */}
                <div className="p-3.5 rounded-xl bg-[#C6404A]/15 border border-[#C6404A]/40 text-xs">
                  <div className="font-semibold text-[#F0949B] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C6404A]" />
                    <span>Healthcare Management</span>
                  </div>
                  <ul className="text-[11px] text-white/80 space-y-0.5">
                    <li>• EHR Health Records (FHIR)</li>
                    <li>• Vaccine Passports & Appointments</li>
                    <li>• Active Prescriptions & Vitals</li>
                  </ul>
                </div>

                {/* Mod 3: Educational */}
                <div className="p-3.5 rounded-xl bg-[#D97F1F]/15 border border-[#D97F1F]/40 text-xs">
                  <div className="font-semibold text-[#F5B96A] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D97F1F]" />
                    <span>Educational Management</span>
                  </div>
                  <ul className="text-[11px] text-white/80 space-y-0.5">
                    <li>• Academic Records & Degrees</li>
                    <li>• Verified Certificates (OpenBadges)</li>
                    <li>• Lifelong Learning CEU Credits</li>
                  </ul>
                </div>

                {/* Mod 4: Digital Document Vault */}
                <div className="p-3.5 rounded-xl bg-[#6D4AA8]/15 border border-[#6D4AA8]/40 text-xs">
                  <div className="font-semibold text-[#C6A9F0] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6D4AA8]" />
                    <span>Digital Document Vault</span>
                  </div>
                  <ul className="text-[11px] text-white/80 space-y-0.5">
                    <li>• AES-256 Encrypted Storage</li>
                    <li>• e-Sign & SHA-256 Verification</li>
                    <li>• Expiring Links & Version History</li>
                  </ul>
                </div>

              </div>

              {/* Common Services Ribbon */}
              <div className="border-t border-white/10 pt-3">
                <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#9FB3D9] text-center mb-2">
                  Zero-Trust Common Services
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center text-[10px] font-mono-code text-[#E2EAF4]">
                  <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    🛡️ OAuth2 / OIDC Auth
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    👤 Granular RBAC Engine
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    🔔 Notification Dispatcher
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    📊 Analytics & Audit Stream
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    🔍 Semantic Search Index
                  </span>
                </div>
              </div>
            </div>

            {/* Right: External Integrations (3 Cols) */}
            <div
              onMouseEnter={() => setHighlightedLayer('External APIs')}
              onMouseLeave={() => setHighlightedLayer(null)}
              className={`lg:col-span-3 rounded-2xl p-4 border transition-all ${
                currentStep?.layer === 'External APIs' || highlightedLayer === 'External APIs'
                  ? 'bg-[#12234B] border-[#6FE0B0] ring-2 ring-[#6FE0B0]/40'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#9FB3D9] font-semibold mb-3 flex items-center justify-between">
                <span>External Integrations</span>
                <Radio className="w-3.5 h-3.5 text-[#6D4AA8]" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-white">
                  <span>🏛️</span>
                  <span>Government Services (APIs)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-white">
                  <span>🏥</span>
                  <span>Healthcare Providers (HL7/FHIR)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-white">
                  <span>🎓</span>
                  <span>Educational Institutions</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-white">
                  <span>✉️</span>
                  <span>Email / SMS & Push Gateway</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-white">
                  <span>🔏</span>
                  <span>e-KYC & Digital Signatures</span>
                </div>
              </div>
            </div>

          </div>

          {/* INTER-LAYER FLOW ARROW */}
          <div className="flex items-center justify-center gap-3 text-[#5C6E93] text-xs font-mono-code">
            <span className="h-px bg-white/15 flex-1" />
            <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Zap className="w-3 h-3 text-[#6FE0B0]" />
              <span>TLS 1.3 mTLS Encrypted Network Bus</span>
            </span>
            <span className="h-px bg-white/15 flex-1" />
          </div>

          {/* LAYER 3: PLATFORM SERVICES LAYER */}
          <div
            onMouseEnter={() => setHighlightedLayer('API Gateway')}
            onMouseLeave={() => setHighlightedLayer(null)}
            className={`rounded-2xl p-5 border transition-all ${
              currentStep?.layer === 'API Gateway' || currentStep?.layer === 'Platform Services' || highlightedLayer === 'API Gateway'
                ? 'bg-[#12234B] border-[#6FE0B0] ring-2 ring-[#6FE0B0]/40'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#9FB3D9] font-semibold mb-3 text-center">
              Platform Services Layer
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Globe className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">API Gateway</span>
                <span className="text-[10px] text-[#9FB3D9]">WAF & Rate Limits</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Cpu className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">Orchestration</span>
                <span className="text-[10px] text-[#9FB3D9]">Kubernetes / gRPC</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Activity className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">Workflow Engine</span>
                <span className="text-[10px] text-[#9FB3D9]">State Machine</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Zap className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">Serverless Ops</span>
                <span className="text-[10px] text-[#9FB3D9]">Cloud Functions</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Server className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">Redis Cache</span>
                <span className="text-[10px] text-[#9FB3D9]">In-Memory Session</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Lock className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">KMS Encryption</span>
                <span className="text-[10px] text-[#9FB3D9]">HSM Hardware Keys</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center col-span-2 sm:col-span-1">
                <Shield className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">Disaster Recovery</span>
                <span className="text-[10px] text-[#9FB3D9]">Multi-Region Sync</span>
              </div>
            </div>
          </div>

          {/* INTER-LAYER FLOW ARROW */}
          <div className="flex items-center justify-center gap-3 text-[#5C6E93] text-xs font-mono-code">
            <span className="h-px bg-white/15 flex-1" />
            <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Database className="w-3 h-3 text-[#6FE0B0]" />
              <span>AES-256 Storage Volumes</span>
            </span>
            <span className="h-px bg-white/15 flex-1" />
          </div>

          {/* LAYER 4: DATA LAYER (CLOUD STORAGE) */}
          <div
            onMouseEnter={() => setHighlightedLayer('Data Layer')}
            onMouseLeave={() => setHighlightedLayer(null)}
            className={`rounded-2xl p-5 border transition-all ${
              currentStep?.layer === 'Data Layer' || highlightedLayer === 'Data Layer'
                ? 'bg-[#12234B] border-[#6FE0B0] ring-2 ring-[#6FE0B0]/40'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="text-xs font-mono-code uppercase tracking-wider text-[#9FB3D9] font-semibold mb-3 text-center">
              Data Layer — Sovereign Cloud Storage
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Database className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">User Relational DB</span>
                <span className="text-[10px] text-[#9FB3D9]">PostgreSQL Cluster</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Database className="w-4 h-4 text-[#F0949B] mb-1.5" />
                <span className="font-semibold text-white">Health Records DB</span>
                <span className="text-[10px] text-[#9FB3D9]">FHIR Document Store</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Database className="w-4 h-4 text-[#F5B96A] mb-1.5" />
                <span className="font-semibold text-white">Education Records DB</span>
                <span className="text-[10px] text-[#9FB3D9]">Academic Registry</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Database className="w-4 h-4 text-[#C6A9F0] mb-1.5" />
                <span className="font-semibold text-white">Object Vault</span>
                <span className="text-[10px] text-[#9FB3D9]">S3-Compatible Store</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Database className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">Audit Logs DB</span>
                <span className="text-[10px] text-[#9FB3D9]">Append-Only Ledger</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <Database className="w-4 h-4 text-[#6FE0B0] mb-1.5" />
                <span className="font-semibold text-white">Backup Cold Storage</span>
                <span className="text-[10px] text-[#9FB3D9]">Immutable Glacier</span>
              </div>
            </div>
          </div>

          {/* Architecture Legend */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#9FB3D9]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 bg-[#2A4A8C] rounded" />
                <span>User Interaction</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 bg-[#1E7D5C] rounded" />
                <span>Data Flow</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 bg-[#6D4AA8] rounded" />
                <span>External Integration</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 bg-[#6FE0B0] rounded" />
                <span>Internal Microservices Bus</span>
              </span>
            </div>

            <div className="font-mono-code text-[11px] text-[#6FE0B0]">
              Cloud Engine Status: 99.99% UPTIME · MULTI-REGION
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
