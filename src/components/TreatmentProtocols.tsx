import React, { useState } from 'react';
import { Patient } from '../types';

interface TreatmentProtocolsProps {
  activePatient: Patient;
}

export const TreatmentProtocols: React.FC<TreatmentProtocolsProps> = ({ activePatient }) => {
  const [activeTab, setActiveTab] = useState<'organic' | 'commercial'>('organic');
  const { treatmentProtocols } = activePatient;

  return (
    <section className="bg-white/95 backdrop-blur-md rounded-xl border border-primary/15 p-5 custom-tier-1-shadow space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl text-[#144226] font-bold">Treatment Protocols</h3>
          <p className="text-xs text-[#414942]">
            Choose between holistic homemade botanicals and targeted laboratory remedies.
          </p>
        </div>

        {/* Segmented Control Button Pill */}
        <div className="inline-flex p-1 bg-[#EEF4F0] rounded-full border border-[#144226]/15 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('organic')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'organic'
                ? 'bg-white text-[#144226] shadow-sm'
                : 'text-[#414942] hover:text-[#144226]'
            }`}
          >
            🌿 Organic Remedies
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('commercial')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'commercial'
                ? 'bg-white text-[#144226] shadow-sm'
                : 'text-[#414942] hover:text-[#144226]'
            }`}
          >
            🧪 Commercial Solutions
          </button>
        </div>
      </div>

      {/* Tab Content: Organic Remedies */}
      {activeTab === 'organic' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {treatmentProtocols.organicRemedies.map((remedy, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[#f7faf8] border border-[#E8ECE9] flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#144226]">
                    {remedy.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-[#EAF4EE] text-[#144226] border border-[#144226]/10 font-medium">
                    {remedy.badge}
                  </span>
                </div>
                <p className="text-xs text-[#414942] leading-relaxed">
                  {remedy.desc}
                </p>
              </div>
              <span className="text-xs text-[#376847] font-semibold bg-white border border-[#144226]/10 px-3 py-1.5 rounded-lg whitespace-nowrap self-start md:self-auto shadow-xs">
                {remedy.usage}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Commercial Solutions */}
      {activeTab === 'commercial' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {treatmentProtocols.commercialSolutions.map((solution, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[#f7faf8] border border-[#E8ECE9] flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#144226]">
                    {solution.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-[#FAF0E6] text-[#D97746] border border-[#D97746]/20 font-medium">
                    {solution.badge}
                  </span>
                </div>
                <p className="text-xs text-[#414942] leading-relaxed">
                  {solution.desc}
                </p>
              </div>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(solution.title)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#144226] hover:text-[#376847] font-semibold border border-[#144226]/15 bg-white px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap self-start md:self-auto transition-colors"
              >
                <span>Find & Buy</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
