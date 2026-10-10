import React, { useState } from 'react';
import { Patient } from '../types';

interface SpecimenIdentityProps {
  activePatient: Patient;
  onAddNote: (note: string) => void;
  onMarkRecovered: () => void;
  onExportPdf?: () => void;
}

export const SpecimenIdentity: React.FC<SpecimenIdentityProps> = ({
  activePatient,
  onAddNote,
  onMarkRecovered,
  onExportPdf,
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleSaveNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText.trim());
      setNoteText('');
      setShowAddNoteModal(false);
    }
  };

  return (
    <>
      <section className="bg-white/95 backdrop-blur-md rounded-xl border border-primary/15 p-5 custom-tier-1-shadow space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#e8f0e9] flex items-center justify-center text-[#144226] border border-[#144226]/10 shadow-inner">
              <span className="material-symbols-outlined text-[28px]">eco</span>
            </div>
            <div>
              <h3 className="text-xl text-[#144226] font-bold">
                {activePatient.commonName}
              </h3>
              <p className="text-xs text-[#414942] italic">
                {activePatient.latinName}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#EAF4EE] text-[#144226] border border-[#144226]/15 font-semibold">
            <span className="material-symbols-outlined text-[14px] text-[#3B8356]">check_circle</span>
            {activePatient.matchPct}
          </span>
        </div>

        {/* Plant Severity Tag */}
        <div
          className={`p-3 rounded-lg border flex items-center justify-between shadow-xs ${activePatient.severity.bgClass || 'bg-[#FAF0E6]'} ${activePatient.severity.borderClass || 'border-[#D97746]/25'}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[20px] ${activePatient.severity.colorClass || 'text-[#D97746]'}`}
            >
              {activePatient.severity.icon}
            </span>
            <span
              className={`text-xs font-semibold ${activePatient.severity.colorClass || 'text-[#D97746]'}`}
            >
              {activePatient.severity.text}
            </span>
          </div>
          <span
            className={`text-xs bg-white px-2 py-0.5 rounded border font-bold ${activePatient.severity.colorClass || 'text-[#D97746]'} ${activePatient.severity.borderClass || 'border-[#D97746]/20'}`}
          >
            {activePatient.severity.chip}
          </span>
        </div>

        {/* Specimen Contextual Controls */}
        <div className="pt-2 border-t border-[#E8ECE9] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="px-2.5 py-1 rounded-lg border border-[#144226]/15 hover:bg-[#EDF4F7] text-[#144226] text-xs font-semibold flex items-center gap-1 transition-colors bg-white/70 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">edit_note</span>
              <span>Add Care Note</span>
            </button>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-2.5 py-1 rounded-lg border border-[#144226]/15 hover:bg-[#EDF4F7] text-[#144226] text-xs font-semibold flex items-center gap-1 transition-colors bg-white/70 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">history</span>
              <span>Patient History</span>
            </button>
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="px-2.5 py-1 rounded-lg border border-[#144226]/15 hover:bg-[#EDF4F7] text-[#144226] text-xs font-semibold flex items-center gap-1 transition-colors bg-white/70 cursor-pointer"
                type="button"
                title="Export Recovery Roadmap PDF Report"
              >
                <span className="material-symbols-outlined text-[15px] text-[#D97746]">picture_as_pdf</span>
                <span>Export PDF</span>
              </button>
            )}
          </div>
          <button
            onClick={onMarkRecovered}
            className="px-2.5 py-1 rounded-lg bg-[#EAF4EE] hover:bg-[#b6edc2] text-[#144226] font-semibold text-xs flex items-center gap-1 transition-colors border border-[#144226]/15 shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-[#3B8356]">task_alt</span>
            <span>Mark Recovered</span>
          </button>
        </div>
      </section>

      {/* Add Care Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl border border-[#144226]/15 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-[#144226]">Add Clinical Care Note</h4>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="text-[#414942] hover:text-[#144226]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-[#414942]">
              Record new observations, watering volumes, or pest counts for {activePatient.name}.
            </p>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Performed 500ml distilled water flush. Leaves firming up nicely..."
              className="w-full p-2.5 bg-[#f7faf8] border border-[#E8ECE9] rounded-xl text-sm focus:border-[#376847]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="px-3 py-1.5 text-xs text-[#414942] hover:bg-[#EDF4F7] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 text-xs font-bold bg-[#2d5a3c] text-white hover:bg-[#144226] rounded-lg shadow-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 w-full max-w-lg shadow-2xl border border-[#144226]/15 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h4 className="text-base font-bold text-[#144226]">
                  Patient History & Care Log: #{activePatient.id}
                </h4>
                <p className="text-xs text-[#414942]">{activePatient.name} • {activePatient.room}</p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-[#414942] hover:text-[#144226]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {(activePatient.careNotes || []).length > 0 ? (
                activePatient.careNotes?.map((cn) => (
                  <div key={cn.id} className="p-3 bg-[#f7faf8] rounded-xl border border-[#E8ECE9] space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#144226]">{cn.author}</span>
                      <span className="text-[#414942]">{cn.date}</span>
                    </div>
                    <p className="text-xs text-[#161d1a]">{cn.note}</p>
                    {cn.vigorAtTime && (
                      <span className="inline-block text-[10px] bg-[#EAF4EE] text-[#144226] px-1.5 py-0.5 rounded font-semibold">
                        Vigor: {cn.vigorAtTime}%
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#414942] text-center py-4">
                  No previous care notes recorded yet.
                </p>
              )}
            </div>
            <div className="border-t pt-2 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 text-xs font-bold bg-[#2d5a3c] text-white hover:bg-[#144226] rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
