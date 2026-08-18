import React, { useState } from 'react';
import {
  UserPlus,
  FileUp,
  HardDrive,
  FolderTree,
  BellRing,
  Smartphone,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ModuleType } from '../types';

interface WorkflowSectionProps {
  onNavigate: (module: ModuleType) => void;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'User Registration',
      subtitle: 'Secure Account Creation & FIDO2 Authentication',
      icon: UserPlus,
      color: '#1E7D5C',
      module: 'personal' as ModuleType,
      details: [
        'Multi-factor identity verification and sovereign key generation.',
        'Tokenized biometric binding (facial and fingerprint templates).',
        'Issuance of unique Digital Citizen ID (e.g. CIT-2026-98412).',
      ],
    },
    {
      num: '02',
      title: 'Data Collection',
      subtitle: 'Upload Healthcare, Education & Civic Documents',
      icon: FileUp,
      color: '#C6404A',
      module: 'documents' as ModuleType,
      details: [
        'Ingestion of EHR summaries, lab reports, and doctor prescriptions.',
        'Academic transcripts, diplomas, and industry certifications.',
        'Passports, property deeds, tax statements, and driver licenses.',
      ],
    },
    {
      num: '03',
      title: 'Cloud Storage',
      subtitle: 'Zero-Knowledge Encrypted Cloud Repositories',
      icon: HardDrive,
      color: '#D97F1F',
      module: 'architecture' as ModuleType,
      details: [
        'AES-256-GCM envelope encryption using Hardware Security Modules (HSMs).',
        'Decentralized immutable object stores with cross-region replication.',
        'Full compliance with HIPAA, GDPR, and UNCITRAL digital standards.',
      ],
    },
    {
      num: '04',
      title: 'Data Management',
      subtitle: 'Organize by Category, Enable Search & Retrieval',
      icon: FolderTree,
      color: '#6D4AA8',
      module: 'documents' as ModuleType,
      details: [
        'Automated metadata extraction and cryptographic integrity hashing.',
        'Semantic index for instantaneous sub-100ms record lookup.',
        'Granular role-based access control (RBAC) and privacy consent rules.',
      ],
    },
    {
      num: '05',
      title: 'Smart Services',
      subtitle: 'Proactive Notifications & Expiry Alerts',
      icon: BellRing,
      color: '#12234B',
      module: 'healthcare' as ModuleType,
      details: [
        'Automated alerts 90 days prior to passport or driver license expiry.',
        'Health appointment reminders and vaccination booster alerts.',
        'Prescription refill warnings and unauthorized access notifications.',
      ],
    },
    {
      num: '06',
      title: 'Access & Monitoring',
      subtitle: 'Real-Time Web & Mobile Interaction',
      icon: Smartphone,
      color: '#1E7D5C',
      module: 'overview' as ModuleType,
      details: [
        '24/7 web and mobile app access across iOS, Android, and modern browsers.',
        'Live append-only audit trail logging every decryption event.',
        'Time-expiring token sharing with QR code verification passes.',
      ],
    },
  ];

  return (
    <section id="workflow" className="py-16 bg-white border-b border-[#DDE5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#5B6478] font-semibold mb-2">
            <span className="w-4 h-px bg-[#5B6478]" />
            <span>Process & Lifecycle</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#12234B] tracking-tight mb-3">
            How the Smart Citizen Cloud Works
          </h2>
          <p className="text-sm sm:text-base text-[#5B6478]">
            From biometric registration to real-time mobile access — six structured steps migrate scattered physical records into one secure, governed cloud platform.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeStep === idx;
            return (
              <div
                key={step.num}
                onMouseEnter={() => setActiveStep(idx)}
                className={`bg-[#F3F7FC] border rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between ${
                  isHovered
                    ? 'border-[#12234B] shadow-md -translate-y-1'
                    : 'border-[#DDE5F0] hover:border-[#12234B]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-white border border-[#DDE5F0] flex items-center justify-center font-mono-code font-bold text-sm text-[#12234B] shadow-xs">
                      {step.num}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#12234B] mb-1">{step.title}</h3>
                  <div className="text-xs font-semibold text-[#5B6478] mb-3">{step.subtitle}</div>

                  <ul className="space-y-2 text-xs text-[#1B2233] mb-4">
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0 mt-0.5"
                          style={{ color: step.color }}
                        />
                        <span className="text-[#5B6478]">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#DDE5F0]/60 flex items-center justify-between text-xs font-semibold">
                  <button
                    onClick={() => onNavigate(step.module)}
                    className="text-[#12234B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Test Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono-code text-[11px] text-[#8CA0C6]">STEP {step.num}/06</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
