import React from 'react';
import { ModuleType } from '../types';
import {
  User,
  HeartPulse,
  GraduationCap,
  FileCheck2,
  ArrowRight,
  Shield,
  Server,
  Network,
  Globe2,
} from 'lucide-react';

interface HeroProps {
  onNavigate: (module: ModuleType) => void;
  documentCount: number;
  upcomingAppointmentCount: number;
  verifiedCertCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  documentCount,
  upcomingAppointmentCount,
  verifiedCertCount,
}) => {
  return (
    <div className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 bg-[#F3F7FC] border-b border-[#DDE5F0] overflow-hidden">
      {/* Subtle architectural background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE5F0] shadow-xs text-[#12234B] text-xs font-mono-code tracking-wide font-medium">
            <span className="w-2 h-2 rounded-full bg-[#1E7D5C] animate-pulse" />
            <span>CLOUD-NATIVE · MULTI-TENANT · CITIZEN-FIRST</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#12234B] tracking-tight leading-[1.1] mb-5">
            One secure cloud for every citizen&apos;s{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E7D5C] via-[#2A4A8C] to-[#6D4AA8]">
              life records
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#5B6478] max-w-2xl mx-auto mb-8 leading-relaxed">
            The Smart Citizen Life Management Cloud unifies personal identity, healthcare diagnostics, academic credentials, and digital documents into a single sovereign platform.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
            <button
              onClick={() => onNavigate('architecture')}
              className="px-5 py-2.5 bg-[#12234B] hover:bg-[#0A1730] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>View System Architecture</span>
              <ArrowRight className="w-4 h-4 text-[#6FE0B0]" />
            </button>
            <button
              onClick={() => onNavigate('documents')}
              className="px-5 py-2.5 bg-white hover:bg-[#EBF1F9] text-[#12234B] border border-[#CBD6E6] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Open Digital Vault ({documentCount} files)
            </button>
          </div>
        </div>

        {/* 4 Fast-Action Module Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          {/* Card 1: Personal */}
          <div
            onClick={() => onNavigate('personal')}
            className="group bg-white border border-[#DDE5F0] hover:border-[#1E7D5C]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E6F5EF] text-[#1E7D5C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm text-[#12234B]">Personal Management</h3>
                <span className="text-[11px] font-mono-code text-[#1E7D5C] font-semibold bg-[#E6F5EF] px-2 py-0.5 rounded-full">
                  e-KYC OK
                </span>
              </div>
              <p className="text-xs text-[#5B6478] mb-3">
                Digital ID, biometric credentials, emergency contacts & family access control.
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F4FA] flex items-center justify-between text-xs font-semibold text-[#1E7D5C]">
              <span>Manage Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Healthcare */}
          <div
            onClick={() => onNavigate('healthcare')}
            className="group bg-white border border-[#DDE5F0] hover:border-[#C6404A]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#FBEAEA] text-[#C6404A] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm text-[#12234B]">Healthcare Management</h3>
                <span className="text-[11px] font-mono-code text-[#C6404A] font-semibold bg-[#FBEAEA] px-2 py-0.5 rounded-full">
                  {upcomingAppointmentCount} Apt Due
                </span>
              </div>
              <p className="text-xs text-[#5B6478] mb-3">
                EHR health history, clinical lab observations, vaccine passports & prescriptions.
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F4FA] flex items-center justify-between text-xs font-semibold text-[#C6404A]">
              <span>Clinical Records</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Educational */}
          <div
            onClick={() => onNavigate('education')}
            className="group bg-white border border-[#DDE5F0] hover:border-[#D97F1F]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#FCEEDC] text-[#D97F1F] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm text-[#12234B]">Educational Records</h3>
                <span className="text-[11px] font-mono-code text-[#D97F1F] font-semibold bg-[#FCEEDC] px-2 py-0.5 rounded-full">
                  {verifiedCertCount} Verified
                </span>
              </div>
              <p className="text-xs text-[#5B6478] mb-3">
                University degrees, verified skill badges, transcripts & lifelong credits.
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F4FA] flex items-center justify-between text-xs font-semibold text-[#D97F1F]">
              <span>Academic Transcripts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Documents */}
          <div
            onClick={() => onNavigate('documents')}
            className="group bg-white border border-[#DDE5F0] hover:border-[#6D4AA8]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EFE8F8] text-[#6D4AA8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm text-[#12234B]">Digital Document Vault</h3>
                <span className="text-[11px] font-mono-code text-[#6D4AA8] font-semibold bg-[#EFE8F8] px-2 py-0.5 rounded-full">
                  AES-256
                </span>
              </div>
              <p className="text-xs text-[#5B6478] mb-3">
                Encrypted storage, legally binding e-Sign, hash verification & expiring links.
              </p>
            </div>
            <div className="pt-2 border-t border-[#F0F4FA] flex items-center justify-between text-xs font-semibold text-[#6D4AA8]">
              <span>Open Document Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* System Metric Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#DDE5F0] border border-[#DDE5F0] rounded-xl overflow-hidden shadow-xs">
          <div className="bg-white p-4 text-center">
            <div className="text-2xl font-bold font-display text-[#12234B]">4</div>
            <div className="text-xs text-[#5B6478] font-medium">Core Cloud Modules</div>
          </div>
          <div className="bg-white p-4 text-center">
            <div className="text-2xl font-bold font-display text-[#12234B]">6</div>
            <div className="text-xs text-[#5B6478] font-medium">Data Repositories</div>
          </div>
          <div className="bg-white p-4 text-center">
            <div className="text-2xl font-bold font-display text-[#12234B]">5</div>
            <div className="text-xs text-[#5B6478] font-medium">External Integrations</div>
          </div>
          <div className="bg-white p-4 text-center">
            <div className="text-2xl font-bold font-display text-[#12234B]">5</div>
            <div className="text-xs text-[#5B6478] font-medium">UN SDGs Aligned</div>
          </div>
        </div>

      </div>
    </div>
  );
};
