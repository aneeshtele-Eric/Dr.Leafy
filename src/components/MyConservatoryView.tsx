import React, { useState } from 'react';
import { Patient } from '../types';

interface MyConservatoryViewProps {
  patients: Record<string, Patient>;
  onSelectPatient: (id: string) => void;
  onAddNewPlant: () => void;
}

export const MyConservatoryView: React.FC<MyConservatoryViewProps> = ({
  patients,
  onSelectPatient,
  onAddNewPlant,
}) => {
  const [filter, setFilter] = useState<'all' | 'recovery' | 'stable'>('all');
  const patientList = Object.values(patients);

  const filteredPatients = patientList.filter((p) => {
    if (filter === 'recovery') return p.baseVigor < 90;
    if (filter === 'stable') return p.baseVigor >= 90;
    return true;
  });

  const avgVigor = Math.round(
    patientList.reduce((acc, curr) => acc + curr.baseVigor, 0) / (patientList.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-primary/15 custom-tier-1-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#376847]">
              Botanical Care Portfolio
            </span>
            <h1 className="text-2xl font-bold text-[#144226]">My Conservatory</h1>
            <p className="text-xs text-[#414942] mt-0.5">
              Live monitoring, hydration records, and foliar recovery tracking across all household rooms.
            </p>
          </div>
          <button
            onClick={onAddNewPlant}
            className="px-4 py-2.5 bg-[#2d5a3c] hover:bg-[#144226] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Add New Plant</span>
          </button>
        </div>

        {/* Quick Stats Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-[#f7faf8] p-3 rounded-xl border border-[#E8ECE9]">
            <span className="text-[11px] text-[#414942]">Total Patients</span>
            <p className="text-xl font-bold text-[#144226]">{patientList.length}</p>
          </div>
          <div className="bg-[#f7faf8] p-3 rounded-xl border border-[#E8ECE9]">
            <span className="text-[11px] text-[#414942]">Active Recovery</span>
            <p className="text-xl font-bold text-[#D97746]">
              {patientList.filter((p) => p.baseVigor < 90).length}
            </p>
          </div>
          <div className="bg-[#f7faf8] p-3 rounded-xl border border-[#E8ECE9]">
            <span className="text-[11px] text-[#414942]">Average Vigor</span>
            <p className="text-xl font-bold text-[#3B8356]">{avgVigor}%</p>
          </div>
          <div className="bg-[#f7faf8] p-3 rounded-xl border border-[#E8ECE9]">
            <span className="text-[11px] text-[#414942]">Due Today</span>
            <p className="text-xl font-bold text-[#144226]">2 Tasks</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#144226] text-white shadow-sm'
              : 'bg-white text-[#414942] border border-[#144226]/15 hover:bg-[#EDF4F7]'
          }`}
        >
          All Specimens ({patientList.length})
        </button>
        <button
          onClick={() => setFilter('recovery')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'recovery'
              ? 'bg-[#144226] text-white shadow-sm'
              : 'bg-white text-[#414942] border border-[#144226]/15 hover:bg-[#EDF4F7]'
          }`}
        >
          In Recovery ({patientList.filter((p) => p.baseVigor < 90).length})
        </button>
        <button
          onClick={() => setFilter('stable')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'stable'
              ? 'bg-[#144226] text-white shadow-sm'
              : 'bg-white text-[#414942] border border-[#144226]/15 hover:bg-[#EDF4F7]'
          }`}
        >
          Stabilized / Healthy ({patientList.filter((p) => p.baseVigor >= 90).length})
        </button>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => {
          let totalTasks = 0;
          let completedTasks = 0;
          patient.phases.forEach((ph) => {
            ph.tasks.forEach((t) => {
              totalTasks++;
              if (t.completed) completedTasks++;
            });
          });

          return (
            <div
              key={patient.id}
              className="bg-white/95 rounded-2xl border border-primary/15 overflow-hidden custom-tier-1-shadow hover:shadow-lg transition-all duration-200 flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={patient.imageUrl}
                  alt={patient.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-[#144226] border border-[#144226]/10">
                    #{patient.id}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-bold text-[#144226] shadow-xs">
                  {patient.baseVigor}% Vigor
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-[#144226]">{patient.name}</h3>
                      <p className="text-xs text-[#414942] italic">{patient.latinName}</p>
                    </div>
                    <span className="text-[11px] text-[#376847] bg-[#EAF4EE] px-2 py-0.5 rounded font-semibold border border-[#144226]/10">
                      {patient.room}
                    </span>
                  </div>

                  <div className="mt-2 p-2 rounded-lg bg-[#FAF0E6] border border-[#D97746]/20 flex items-center gap-1.5 text-xs text-[#D97746] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">{patient.severity.icon}</span>
                    <span className="truncate">{patient.severity.text}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#414942]">
                    <span>Clinical Tasks</span>
                    <span className="font-semibold text-[#144226]">
                      {completedTasks} / {totalTasks} Completed
                    </span>
                  </div>
                  <div className="w-full bg-[#e2eae4] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#376847] h-full rounded-full"
                      style={{
                        width: `${Math.max(10, Math.round((completedTasks / totalTasks) * 100))}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8ECE9] flex gap-2">
                  <button
                    onClick={() => onSelectPatient(patient.id)}
                    className="flex-1 py-2 bg-[#2d5a3c] hover:bg-[#144226] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">stethoscope</span>
                    <span>Enter Recovery Room</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
