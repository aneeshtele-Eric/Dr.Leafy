import React, { useState } from 'react';
import { GroundingSource, Patient } from '../types';

interface DoctorChatSectionProps {
  activePatient: Patient;
}

export const DoctorChatSection: React.FC<DoctorChatSectionProps> = ({ activePatient }) => {
  const [selectedSoil, setSelectedSoil] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [doctorMessages, setDoctorMessages] = useState<
    Array<{ text: string; time: string; sources?: GroundingSource[] }>
  >([
    {
      text: activePatient.drNote,
      time: 'Just now',
    },
  ]);

  // Sync initial note on patient change
  React.useEffect(() => {
    setDoctorMessages([
      {
        text: activePatient.drNote,
        time: 'Just now',
      },
    ]);
    setSelectedSoil(null);
    setQuestion('');
  }, [activePatient.id, activePatient.drNote]);

  const handleSoilClick = (soilType: string) => {
    setSelectedSoil(soilType);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() && !selectedSoil) return;

    const queryToSend = question.trim() || `I probed the soil 2 inches deep and it is: ${selectedSoil}. What should I do next?`;
    setQuestion('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ask-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryToSend,
          patientContext: {
            id: activePatient.id,
            name: activePatient.name,
            commonName: activePatient.commonName,
            condition: activePatient.severity.text,
          },
          soilMoisture: selectedSoil,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setDoctorMessages((prev) => [
          ...prev,
          {
            text: data.reply,
            time: 'Just now',
            sources: data.sources || [],
          },
        ]);
      } else {
        throw new Error('No reply from doctor');
      }
    } catch {
      // Local fallback simulation
      let fallback = `“Excellent observation regarding ${activePatient.name}. `;
      if (selectedSoil === '🌵 Bone dry') {
        fallback += `Since the soil is bone dry, proceed with the bottom-watering soak for 45 minutes to rehydrate the root ball without washing away nutrient pockets.”`;
      } else if (selectedSoil === '🌊 Soggy & cold') {
        fallback += `Since the soil is soggy and cold, immediately hold off on watering and aerate the top 2 inches with a sterile chopstick to introduce oxygen.”`;
      } else {
        fallback += `Damp and cool indicates optimal moisture retention! Maintain ambient humidity at 60% and monitor the new foliage shoots.”`;
      }
      setDoctorMessages((prev) => [...prev, { text: fallback, time: 'Just now' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="bg-white/95 backdrop-blur-md rounded-xl border border-primary/15 p-5 custom-tier-1-shadow space-y-4">
      {/* Messages Thread */}
      <div className="space-y-3">
        {doctorMessages.map((msg, index) => (
          <div key={index} className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#2d5a3c] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#144226]">
                  Dr. Leafy's Horticultural Note
                </span>
                <span className="text-[11px] text-[#414942] font-medium">{msg.time}</span>
              </div>
              <p className="text-sm text-[#161d1a] leading-relaxed">{msg.text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-1.5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-[#414942] font-semibold">Google Search Sources:</span>
                  {msg.sources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#376847] hover:underline bg-[#EAF4EE] px-1.5 py-0.5 rounded border border-[#144226]/10 truncate max-w-[200px]"
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Reply Bar / Immediate Soil Probe Assessment */}
      <div className="pt-3 border-t border-[#E8ECE9] space-y-2.5">
        <label className="block text-xs font-semibold text-[#161d1a]">
          QUICK FEEDBACK: How does the soil feel 2 inches deep right now?
        </label>
        <div className="flex flex-wrap gap-2">
          {['🌵 Bone dry', '💧 Damp & cool', '🌊 Soggy & cold'].map((soil) => (
            <button
              key={soil}
              type="button"
              onClick={() => handleSoilClick(soil)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors font-medium shadow-xs cursor-pointer ${
                selectedSoil === soil
                  ? 'bg-[#376847] text-white border border-[#376847] shadow-sm'
                  : 'border border-[#144226]/20 bg-white hover:bg-[#EDF4F7] text-[#161d1a]'
              }`}
            >
              {soil}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type a quick observation or question for Dr. Leafy..."
            className="flex-1 rounded-lg border border-[#E8ECE9] text-xs text-[#161d1a] placeholder:text-[#c1c9bf] bg-[#f7faf8] px-3 py-2 focus:ring-1 focus:ring-[#376847]/20 focus:border-[#376847] shadow-inner"
          />
          <button
            type="submit"
            disabled={isSending}
            className="px-4 py-2 bg-[#376847] hover:bg-[#144226] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
            ) : (
              <>
                <span>Send</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
