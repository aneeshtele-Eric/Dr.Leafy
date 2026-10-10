import React from 'react';
import { Patient } from '../types';

interface PlantVoiceWidgetProps {
  activePatient: Patient;
  isHappy: boolean;
}

export const PlantVoiceWidget: React.FC<PlantVoiceWidgetProps> = ({
  activePatient,
  isHappy,
}) => {
  const { companionVoice } = activePatient;

  const currentEmoji = isHappy ? companionVoice.happyEmoji : companionVoice.initialEmoji;
  const currentQuote = isHappy ? companionVoice.happyVoiceQuote : companionVoice.voiceQuote;
  const badgeText = isHappy ? '✓' : companionVoice.moodBadge || '!';
  const badgeBg = isHappy ? 'bg-[#3B8356]' : 'bg-[#D97746]';

  return (
    <section className="bg-white/95 backdrop-blur-md rounded-xl border border-primary/15 p-5 custom-tier-1-shadow relative overflow-hidden bg-gradient-to-r from-white via-white to-[#eef6ef]/60">
      <div className="flex items-start gap-4">
        {/* Expressive plant mood avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-[#e8f0e9] flex items-center justify-center border border-[#144226]/15 transition-transform duration-300 shadow-sm hover:scale-105">
            <span
              role="img"
              aria-label="Plant mood face"
              className="text-3xl select-none"
            >
              {currentEmoji}
            </span>
          </div>
          <span
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${badgeBg} text-white flex items-center justify-center text-[10px] font-bold shadow-xs transition-colors`}
          >
            {badgeText}
          </span>
        </div>

        {/* Speech Bubble Quote */}
        <div className="flex-1 bg-[#f7faf8] rounded-2xl rounded-tl-sm p-4 border border-[#144226]/10 relative shadow-xs">
          <div className="text-xs text-[#144226] font-semibold mb-1 flex items-center gap-1.5 flex-wrap">
            <span>{companionVoice.speaker}</span>
            <span className="text-[#c1c9bf]">•</span>
            <span className="text-[#414942] font-normal">Living Companion Diary</span>
          </div>
          <blockquote className="text-sm text-[#161d1a] italic leading-relaxed">
            {currentQuote}
          </blockquote>
        </div>
      </div>
    </section>
  );
};
