import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[#144226]/15 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#E8ECE9] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#2d5a3c] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </span>
            <div>
              <h3 className="text-base font-bold text-[#144226]">Dr. Leafy Clinical Guide</h3>
              <p className="text-[11px] text-[#414942]">How to triage and rehabilitate plant patients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#e8f0e9] hover:bg-[#dce4de] flex items-center justify-center text-[#414942]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#161d1a] leading-relaxed">
          <div className="p-3 bg-[#f7faf8] rounded-xl border border-[#E8ECE9] space-y-1">
            <h4 className="font-bold text-[#144226] flex items-center gap-1.5">
              <span>1. Photograph Specimen</span>
              <span className="material-symbols-outlined text-[16px] text-[#376847]">photo_camera</span>
            </h4>
            <p className="text-[#414942]">
              Take a clear, well-lit photo of the affected leaf blade, petiole, or topsoil texture. Drag & drop it into the Examine Specimen dropzone.
            </p>
          </div>

          <div className="p-3 bg-[#f7faf8] rounded-xl border border-[#E8ECE9] space-y-1">
            <h4 className="font-bold text-[#144226] flex items-center gap-1.5">
              <span>2. Gemini Multimodal Diagnostic Reasoning</span>
              <span className="material-symbols-outlined text-[16px] text-[#376847]">psychology</span>
            </h4>
            <p className="text-[#414942]">
              Click <strong>Ask Dr. Leafy</strong>. The Gemini model analyzes symptoms, assesses cellular turgor, rules out differential pathologies, and generates a tailored recovery roadmap.
            </p>
          </div>

          <div className="p-3 bg-[#f7faf8] rounded-xl border border-[#E8ECE9] space-y-1">
            <h4 className="font-bold text-[#144226] flex items-center gap-1.5">
              <span>3. Interactive Care Journey Timeline</span>
              <span className="material-symbols-outlined text-[16px] text-[#376847]">checklist</span>
            </h4>
            <p className="text-[#414942]">
              Check off completed tasks (e.g. bottom-soaking, neem oil wiping, topsoil aeration). As you complete clinical tasks, your plant's Vigor Index rises and its companion voice perks up!
            </p>
          </div>

          <div className="p-3 bg-[#f7faf8] rounded-xl border border-[#E8ECE9] space-y-1">
            <h4 className="font-bold text-[#144226] flex items-center gap-1.5">
              <span>4. Natural Language Search & Google Grounding</span>
              <span className="material-symbols-outlined text-[16px] text-[#376847]">travel_explore</span>
            </h4>
            <p className="text-[#414942]">
              In the <strong>Botanical Library</strong>, enter any natural language query. Gemini interprets your question and synthesizes insights backed by real-time Google Search sources with verified citations.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E8ECE9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-[#2d5a3c] text-white hover:bg-[#144226] rounded-xl shadow-xs"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
