import React from 'react';
import { Patient } from '../types';

interface ConservatoryManagerProps {
  patients: Record<string, Patient>;
  activePatientId: string;
  onSelectPatient: (id: string) => void;
  onAddNewPatient: () => void;
}

export const ConservatoryManager: React.FC<ConservatoryManagerProps> = ({
  patients,
  activePatientId,
  onSelectPatient,
  onAddNewPatient,
}) => {
  const patientList = Object.values(patients);
  const activeCount = patientList.filter((p) => p.baseVigor < 100).length;

  // Calculate total tasks due across patients
  let totalTasksDue = 0;
  patientList.forEach((p) => {
    p.phases.forEach((phase) => {
      phase.tasks.forEach((t) => {
        if (!t.completed) totalTasksDue++;
      });
    });
  });

  return (
    <section className="space-y-4" id="conservatory-patient-manager">
      {/* Header & Conservatory Health Matrix Ticker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-primary/15 custom-tier-1-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#e8f0e9] flex items-center justify-center text-[#144226] font-bold shadow-inner">
            <span className="material-symbols-outlined text-[22px] text-[#376847]">potted_plant</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl text-[#144226] font-bold">Conservatory Patients</h2>
              <span className="px-2 py-0.5 rounded-full text-xs bg-[#EAF4EE] text-[#144226] border border-[#144226]/15 font-semibold">
                {activeCount} Active in Recovery
              </span>
            </div>
            <p className="text-xs text-[#414942]">
              Switch between botanical cases or diagnose a new patient into your care regimen.
            </p>
          </div>
        </div>

        {/* Quick Status Ticker / Health Matrix */}
        <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto pt-1 sm:pt-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-[#144226]/10 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#D97746] animate-pulse"></span>
            <span className="text-xs text-[#414942]">
              Tasks Due:{' '}
              <strong className="text-[#144226] font-semibold">
                {Math.min(totalTasksDue, 3)} Today
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-[#144226]/10 shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-[#3B8356]">check_circle</span>
            <span className="text-xs text-[#414942]">
              Recovered:{' '}
              <strong className="text-[#3B8356] font-semibold">5 this month</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Specimen Patient Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" id="patient-card-deck">
        {patientList.map((patient) => {
          const isActive = patient.id === activePatientId;

          // Calculate completed tasks & current vigor
          let totalTasks = 0;
          let completedTasks = 0;
          patient.phases.forEach((ph) => {
            ph.tasks.forEach((t) => {
              totalTasks++;
              if (t.completed) completedTasks++;
            });
          });

          const progressFraction = totalTasks > 0 ? completedTasks / totalTasks : 0;
          const currentVigor = Math.min(
            100,
            Math.round(patient.baseVigor + progressFraction * (100 - patient.baseVigor))
          );

          let emoji = '🌿';
          if (patient.id === 'DL-8822') emoji = '🪴';
          if (patient.id === 'DL-8823') emoji = '🌱';

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className={`p-3.5 rounded-xl cursor-pointer group transition-all duration-200 relative ${
                isActive
                  ? 'border-2 border-[#144226] bg-white/95 backdrop-blur-md custom-tier-2-shadow ring-2 ring-[#144226]/20 -translate-y-0.5'
                  : 'border border-[#144226]/15 bg-white/90 backdrop-blur-md hover:border-[#376847] hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                {isActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#3B8356] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#144226] uppercase tracking-wider bg-[#EAF4EE] px-1.5 py-0.5 rounded border border-[#144226]/10">
                      Active Case
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-[#376847] bg-[#e8f0e9] px-1.5 py-0.5 rounded border border-[#144226]/10">
                    {patient.phases[0]?.badge || 'In Care'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-11 h-11 rounded-lg bg-[#e8f0e9] flex items-center justify-center text-xl border border-[#144226]/10 flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  {emoji}
                </div>
                <div className="min-w-0 pr-14">
                  <h3 className="text-sm font-bold text-[#144226] truncate group-hover:text-[#376847]">
                    {patient.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-[#144226] bg-[#EAF4EE] px-1.5 py-0.5 rounded border border-[#144226]/20 tracking-wider">
                      #{patient.id}
                    </span>
                    <span className="text-[11px] text-[#414942] truncate">
                      {patient.room}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D97746] font-semibold flex items-center gap-1 truncate max-w-[65%]">
                    <span className="material-symbols-outlined text-[13px]">{patient.severity.icon}</span>
                    <span className="truncate">{patient.severity.text}</span>
                  </span>
                  <span className="text-[#144226] font-bold">
                    {currentVigor}% Vigor
                  </span>
                </div>
                <div className="w-full bg-[#e2eae4] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#376847] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(12, Math.round(progressFraction * 100))}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#414942] pt-0.5">
                  <span>Progress: {completedTasks}/{totalTasks} tasks</span>
                  <span className="text-[#376847] font-medium">
                    {completedTasks === totalTasks ? 'Ready for review' : 'Care in progress'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Action Card: + Diagnose & Add New Plant */}
        <button
          onClick={onAddNewPatient}
          className="p-3.5 rounded-xl border-2 border-dashed border-[#144226]/25 hover:border-[#144226] bg-white/70 hover:bg-white/95 backdrop-blur-md cursor-pointer flex flex-col items-center justify-center text-center gap-2 group transition-all duration-200 min-h-[110px] w-full shadow-xs hover:shadow-md"
          type="button"
        >
          <div className="w-10 h-10 rounded-full bg-[#e8f0e9] group-hover:bg-[#2d5a3c] group-hover:text-white text-[#144226] flex items-center justify-center transition-colors duration-200 shadow-sm">
            <span className="material-symbols-outlined text-[22px]">add</span>
          </div>
          <div>
            <div className="text-xs font-bold text-[#144226] group-hover:text-[#376847]">
              + Diagnose & Add Plant
            </div>
            <div className="text-[11px] text-[#414942] font-medium">
              Start photo exam for new patient
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};
