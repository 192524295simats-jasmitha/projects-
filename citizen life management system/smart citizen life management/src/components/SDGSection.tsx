import React, { useState } from 'react';
import { sdgData } from '../data/initialData';
import { Globe2, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const SDGSection: React.FC = () => {
  const [activeSDG, setActiveSDG] = useState(0);

  return (
    <section id="sdg" className="py-16 bg-[#F3F7FC] border-b border-[#DDE5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#1E7D5C] font-semibold mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Sustainability & Global Impact</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#12234B] tracking-tight mb-3">
            United Nations SDG Alignment
          </h2>
          <p className="text-sm sm:text-base text-[#5B6478]">
            The Smart Citizen Life Management Cloud architecture is directly aligned with five UN Sustainable Development Goals (SDGs) to advance inclusive digital governance, quality healthcare, and resilient infrastructure.
          </p>
        </div>

        {/* 5 SDG Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {sdgData.map((sdg, index) => {
            const isSelected = activeSDG === index;
            return (
              <div
                key={sdg.sdgNumber}
                onClick={() => setActiveSDG(index)}
                className={`rounded-2xl p-5 text-white transition-all cursor-pointer bg-gradient-to-br ${sdg.badgeColor} shadow-sm ${
                  isSelected ? 'ring-4 ring-[#12234B]/30 scale-[1.02]' : 'hover:opacity-95'
                }`}
              >
                <div className="text-[11px] font-mono-code opacity-85 mb-3 font-semibold">
                  {sdg.sdgNumber}
                </div>
                <h3 className="font-display font-bold text-base mb-2 leading-snug">
                  {sdg.title}
                </h3>
                <p className="text-xs opacity-90 line-clamp-3 mb-4">
                  {sdg.target}
                </p>
                <div className="text-[11px] font-semibold underline opacity-90 flex items-center gap-1">
                  <span>Explore Impact</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected SDG Detail Card */}
        {sdgData[activeSDG] && (
          <div className="bg-white border border-[#DDE5F0] rounded-2xl p-6 sm:p-8 shadow-xs animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#DDE5F0]">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-code font-bold text-white mb-2"
                  style={{ backgroundColor: sdgData[activeSDG].accentColor }}
                >
                  <span>{sdgData[activeSDG].sdgNumber} TARGET FOCUS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#12234B]">
                  {sdgData[activeSDG].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6478] mt-1">
                  {sdgData[activeSDG].target}
                </p>
              </div>

              {/* Metric Card */}
              <div className="p-4 bg-[#F3F7FC] border border-[#DDE5F0] rounded-xl shrink-0 max-w-sm">
                <div className="text-[11px] text-[#5B6478] font-mono-code uppercase font-semibold mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#1E7D5C]" />
                  <span>Key Quantitative Indicator</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#12234B]">
                  {sdgData[activeSDG].metric}
                </div>
              </div>
            </div>

            {/* Impact Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sdgData[activeSDG].impacts.map((impact, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F3F7FC] rounded-xl border border-[#DDE5F0] flex items-start gap-3"
                >
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: sdgData[activeSDG].accentColor }}
                  />
                  <span className="text-xs text-[#1B2233] leading-relaxed">{impact}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
