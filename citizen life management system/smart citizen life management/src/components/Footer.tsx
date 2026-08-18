import React from 'react';
import { ModuleType } from '../types';
import { ShieldCheck, Heart, Github, Globe2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (module: ModuleType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0A1730] text-[#AEBBD6] pt-14 pb-8 border-t border-[#1E356A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand & Summary */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#12234B] to-[#2A4A8C] flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-4 h-4 text-[#6FE0B0]" />
              </div>
              <span className="font-display font-bold text-base tracking-tight">
                Smart Citizen Life Management Cloud
              </span>
            </div>
            <p className="text-xs text-[#8FA0C4] max-w-md leading-relaxed">
              A comprehensive cloud-native platform integrating personal identity, electronic healthcare records, verified educational credentials, and digital documents into a zero-trust sovereign architecture. Built as an advanced engineering capstone project.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#6FE0B0] font-mono-code">
              <span>• ISO 27001</span>
              <span>• HL7 / FHIR</span>
              <span>• W3C Credentials</span>
              <span>• UN SDGs</span>
            </div>
          </div>

          {/* Module Links */}
          <div className="space-y-2.5 text-xs">
            <div className="font-mono-code uppercase text-[11px] font-semibold text-[#7C8FB8] tracking-wider mb-2">
              Cloud Modules
            </div>
            <div>
              <button
                onClick={() => onNavigate('personal')}
                className="text-[#C6D1E8] hover:text-white transition-colors cursor-pointer"
              >
                Personal & Family Identity
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate('healthcare')}
                className="text-[#C6D1E8] hover:text-white transition-colors cursor-pointer"
              >
                Healthcare & EHR Diagnostics
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate('education')}
                className="text-[#C6D1E8] hover:text-white transition-colors cursor-pointer"
              >
                Educational Degrees & Skills
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate('documents')}
                className="text-[#C6D1E8] hover:text-white transition-colors cursor-pointer"
              >
                Encrypted Document Vault
              </button>
            </div>
          </div>

          {/* Architecture & SDG Links */}
          <div className="space-y-2.5 text-xs">
            <div className="font-mono-code uppercase text-[11px] font-semibold text-[#7C8FB8] tracking-wider mb-2">
              System & Impact
            </div>
            <div>
              <button
                onClick={() => onNavigate('architecture')}
                className="text-[#C6D1E8] hover:text-white transition-colors cursor-pointer"
              >
                5-Layer System Architecture
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate('sdg')}
                className="text-[#C6D1E8] hover:text-white transition-colors cursor-pointer"
              >
                UN SDG Alignment Hub
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate('overview')}
                className="text-[#C6D1E8] hover:text-white transition-colors cursor-pointer"
              >
                6-Step Platform Workflow
              </button>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7C8FB8]">
          <div>
            Smart Citizen Life Management Cloud — College Capstone Project © 2026
          </div>
          <div className="flex items-center gap-4">
            <span>Multi-Tenant Cloud-Native Microservices</span>
            <span className="font-mono-code text-[#6FE0B0]">v2.4 Production</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
