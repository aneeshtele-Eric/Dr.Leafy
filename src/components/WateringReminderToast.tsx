import React from 'react';
import { PlantWateringPlan } from '../utils/wateringScheduler';

interface WateringReminderToastProps {
  toast: PlantWateringPlan | null;
  onDismiss: () => void;
  onNavigateToPatient: (patientId: string) => void;
  onMarkWatered: (patientId: string) => void;
}

export const WateringReminderToast: React.FC<WateringReminderToastProps> = ({
  toast,
  onDismiss,
  onNavigateToPatient,
  onMarkWatered,
}) => {
  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white/95 backdrop-blur-xl border-2 border-[#144226] rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#e8f0e9] border border-[#144226]/15 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
            💧
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97746] bg-[#FAF0E6] px-1.5 py-0.2 rounded border border-[#D97746]/20">
                Watering Due
              </span>
              <span className="text-[10px] text-[#414942]">#{toast.patientId}</span>
            </div>
            <h4 className="font-bold text-[#144226] text-sm">{toast.plantName}</h4>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="w-7 h-7 rounded-full bg-[#f7faf8] hover:bg-[#e8f0e9] text-[#414942] flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      <p className="text-xs text-[#161d1a] leading-relaxed bg-[#f7faf8] p-2.5 rounded-xl border border-[#E8ECE9]">
        {toast.notificationMessage}
      </p>

      <div className="flex items-center gap-1.5 text-[11px] text-[#376847]">
        <span className="material-symbols-outlined text-[14px]">water_drop</span>
        <span className="font-semibold">Type: {toast.waterType}</span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E8ECE9]">
        <button
          onClick={() => {
            onNavigateToPatient(toast.patientId);
            onDismiss();
          }}
          className="text-xs font-semibold text-[#144226] hover:text-[#376847] cursor-pointer"
        >
          Open Case Roadmap →
        </button>

        <button
          onClick={() => {
            onMarkWatered(toast.patientId);
            onDismiss();
          }}
          className="px-3 py-1.5 bg-[#2d5a3c] hover:bg-[#144226] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">done_all</span>
          <span>Mark Watered</span>
        </button>
      </div>
    </div>
  );
};
