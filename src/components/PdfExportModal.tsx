import React, { useState } from 'react';
import { Patient, User } from '../types';
import { generatePatientPdf } from '../utils/pdfGenerator';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  currentVigor: number;
  user?: User | null;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentVigor,
  user,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const doc = generatePatientPdf(patient, currentVigor, user);
      const filename = `${patient.name.replace(/\s+/g, '_')}_${patient.id}_Recovery_Roadmap.pdf`;
      doc.save(filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    try {
      const doc = generatePatientPdf(patient, currentVigor, user);
      const pdfBlobUrl = doc.output('bloburl');
      const printWindow = window.open(pdfBlobUrl);
      if (printWindow) {
        printWindow.focus();
      }
    } catch {
      window.print();
    }
  };

  const careNotes = patient.careNotes || [];
  let totalTasks = 0;
  let completedTasks = 0;
  patient.phases.forEach((ph) => {
    ph.tasks.forEach((t) => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#144226]/15 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#144226] to-[#2d5a3c] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
            </div>
            <div>
              <h2 className="text-base font-bold">Export Patient Recovery Roadmap</h2>
              <p className="text-xs text-white/80">
                Official Clinical Botanical Dossier & Care History Summary (PDF)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Report Preview Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#161d1a] bg-[#f7faf8]">
          {downloadSuccess && (
            <div className="p-3 bg-[#EAF4EE] border border-[#3B8356]/30 text-[#144226] font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px] text-[#3B8356]">check_circle</span>
              <span>PDF Report successfully generated and downloaded to your device!</span>
            </div>
          )}

          {/* Dossier Meta Summary */}
          <div className="p-4 bg-white rounded-xl border border-[#E8ECE9] shadow-xs space-y-2">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#376847]">
                  Protocol #{patient.id}
                </span>
                <h3 className="text-lg font-bold text-[#144226]">{patient.name}</h3>
                <p className="text-xs text-[#414942] italic">{patient.latinName}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#EAF4EE] text-[#144226] font-extrabold text-xs border border-[#144226]/15">
                  {currentVigor}% Current Vigor
                </span>
                <p className="text-[10px] text-[#414942] mt-1">
                  Location: <strong className="text-[#144226]">{patient.room}</strong>
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF0E6] border border-[#D97746]/20 flex items-center gap-2 text-[#D97746] font-semibold">
              <span className="material-symbols-outlined text-[16px]">{patient.severity.icon}</span>
              <span>{patient.severity.text} ({patient.severity.chip})</span>
            </div>
          </div>

          {/* Included Sections Checklist */}
          <div className="p-4 bg-white rounded-xl border border-[#E8ECE9] shadow-xs space-y-2.5">
            <h4 className="font-bold text-[#144226] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#3B8356]">verified</span>
              <span>Included in this PDF Export:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#414942]">
              <div className="flex items-center gap-1.5 bg-[#f7faf8] p-2 rounded-lg border border-[#E8ECE9]">
                <span className="material-symbols-outlined text-[15px] text-[#3B8356]">show_chart</span>
                <span>
                  <strong>Vigor History Graph:</strong> {careNotes.length + 1} data milestones
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#f7faf8] p-2 rounded-lg border border-[#E8ECE9]">
                <span className="material-symbols-outlined text-[15px] text-[#3B8356]">checklist</span>
                <span>
                  <strong>Care Roadmap:</strong> {completedTasks}/{totalTasks} completed tasks
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#f7faf8] p-2 rounded-lg border border-[#E8ECE9]">
                <span className="material-symbols-outlined text-[15px] text-[#3B8356]">history_edu</span>
                <span>
                  <strong>Clinical Notes:</strong> {careNotes.length} logged observations
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#f7faf8] p-2 rounded-lg border border-[#E8ECE9]">
                <span className="material-symbols-outlined text-[15px] text-[#3B8356]">local_pharmacy</span>
                <span>
                  <strong>Treatment Protocols:</strong> Organic recipes & commercial specs
                </span>
              </div>
            </div>
          </div>

          {/* Care Notes Snapshot */}
          <div className="p-4 bg-white rounded-xl border border-[#E8ECE9] shadow-xs space-y-2">
            <h4 className="font-bold text-[#144226]">Logged Care Notes Summary:</h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {careNotes.map((cn) => (
                <div key={cn.id} className="p-2 rounded bg-[#f7faf8] border border-[#E8ECE9] text-[11px]">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#144226]">{cn.date} • {cn.author}</span>
                    {cn.vigorAtTime && (
                      <span className="font-semibold text-[#3B8356]">{cn.vigorAtTime}% Vigor</span>
                    )}
                  </div>
                  <p className="text-[#414942] mt-0.5">{cn.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white border-t border-[#E8ECE9] flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#414942] hover:bg-[#EDF4F7] rounded-xl transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 border border-[#144226]/20 bg-white hover:bg-[#EDF4F7] text-[#144226] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Preview</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-5 py-2 bg-[#2d5a3c] hover:bg-[#144226] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">
                    progress_activity
                  </span>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
