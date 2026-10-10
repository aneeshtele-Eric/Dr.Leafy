import React from 'react';
import { Patient } from '../types';

interface PathologyMatrixProps {
  activePatient: Patient;
}

export const PathologyMatrix: React.FC<PathologyMatrixProps> = ({ activePatient }) => {
  const { pathology } = activePatient;

  return (
    <section className="bg-white/95 backdrop-blur-md rounded-xl border border-primary/15 p-5 custom-tier-1-shadow space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl text-[#144226] flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-[#376847]">analytics</span>
          <span>Identified Pathologies</span>
        </h3>
        <span className="text-xs text-[#414942] font-medium hidden sm:inline">
          Differential Diagnostic Matrix
        </span>
      </div>

      <div className="p-4 rounded-lg bg-[#f7faf8] border border-[#E8ECE9] space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-bold text-[#144226]">
            {pathology.primaryTitle}
          </h4>
          <span className="text-xs text-[#144226] font-bold bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#144226]/10">
            {pathology.priorityBadge}
          </span>
        </div>
        <p className="text-xs text-[#414942] leading-relaxed">
          {pathology.primaryDesc}
        </p>
      </div>

      {/* Differential Diagnoses Tags */}
      <div>
        <div className="text-xs text-[#414942] uppercase tracking-wider mb-2 font-bold">
          Differential Diagnoses & Exclusions
        </div>
        <div className="flex flex-wrap gap-2">
          {pathology.diffTags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                tag.type === 'info'
                  ? 'bg-[#EDF4F7] text-[#00404f] border-[#17586a]/20'
                  : 'bg-[#e8f0e9] text-[#414942] border-[#E8ECE9]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {tag.type === 'info' ? 'info' : 'cancel'}
              </span>
              <span>{tag.text}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
