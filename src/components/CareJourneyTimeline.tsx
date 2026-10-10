import React from 'react';
import { Patient } from '../types';

interface CareJourneyTimelineProps {
  activePatient: Patient;
  onToggleTask: (phaseIndex: number, taskId: string) => void;
  completedTasksCount: number;
  totalTasksCount: number;
  onExportPdf?: () => void;
}

export const CareJourneyTimeline: React.FC<CareJourneyTimelineProps> = ({
  activePatient,
  onToggleTask,
  completedTasksCount,
  totalTasksCount,
  onExportPdf,
}) => {
  return (
    <section className="bg-white/95 backdrop-blur-md rounded-xl border border-primary/15 p-5 custom-tier-1-shadow space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="text-xl text-[#144226] font-bold">
              Care Journey — {activePatient.name} ({activePatient.fullIdTag})
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs bg-[#FAF0E6] text-[#D97746] border border-[#D97746]/20 font-semibold">
              {activePatient.patientOrderTag}
            </span>
          </div>
          <p className="text-xs text-[#414942]">
            {activePatient.careSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#376847] font-semibold bg-[#e8f0e9] px-3 py-1 rounded-full whitespace-nowrap border border-[#144226]/10">
            {completedTasksCount} of {totalTasksCount} completed
          </span>
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="text-xs text-[#144226] hover:bg-[#EDF4F7] border border-[#144226]/15 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow-xs transition-colors bg-white cursor-pointer"
              title="Export Roadmap PDF"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] text-[#D97746]">picture_as_pdf</span>
              <span>Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Container for Patient Specific Phases and Checklist Tasks */}
      <div className="space-y-4">
        {activePatient.phases.map((phase, pIdx) => (
          <div key={phase.number} className={`space-y-2 ${pIdx > 0 ? 'pt-2' : ''}`}>
            {/* Phase Header */}
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full ${phase.circleBg || 'bg-[#2d5a3c] text-white'} text-xs flex items-center justify-center font-bold shadow-xs`}
              >
                {phase.number}
              </span>
              <span className="text-sm text-[#144226] font-bold">
                {phase.title}
              </span>
              {phase.badge && (
                <span
                  className={`text-xs ${phase.badgeClass || 'text-[#D97746] bg-[#FAF0E6] border border-[#D97746]/15'} px-2 py-0.5 rounded ml-auto font-semibold`}
                >
                  {phase.badge}
                </span>
              )}
            </div>

            {/* Tasks in this phase */}
            <div className="space-y-2">
              {phase.tasks.map((task) => (
                <label
                  key={task.id}
                  className={`group flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer shadow-xs ${
                    task.completed
                      ? 'border-[#3B8356]/40 bg-[#f0f8f3]'
                      : 'border-[#E8ECE9] hover:border-[#376847] bg-[#f7faf8] hover:bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(pIdx, task.id)}
                    className="mt-1 h-5 w-5 rounded border-[#c1c9bf] text-[#376847] focus:ring-[#376847]/30 transition-all cursor-pointer accent-[#376847]"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          task.completed
                            ? 'line-through text-[#414942]'
                            : 'text-[#161d1a] group-hover:text-[#144226]'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-xs bg-white text-[#414942] px-2 py-0.5 rounded border border-[#E8ECE9] font-medium">
                        {task.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#414942] leading-relaxed">
                      {task.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
