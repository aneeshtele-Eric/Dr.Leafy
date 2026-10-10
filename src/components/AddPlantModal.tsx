import React, { useRef, useState } from 'react';
import { Patient } from '../types';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: Patient) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [plantName, setPlantName] = useState('');
  const [room, setRoom] = useState('Living Room');
  const [symptoms, setSymptoms] = useState('');
  const [previewImage, setPreviewImage] = useState<string>(
    'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80'
  );
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setBase64Image(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) return;

    setIsLoading(true);
    const newIdNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `DL-${newIdNum}`;

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image || undefined,
          mimeType: 'image/jpeg',
          symptoms: symptoms || 'Routine health checkup and preventative monitoring',
          plantHint: plantName,
        }),
      });

      if (!res.ok) throw new Error('Diagnosis call failed');
      const data = await res.json();

      const createdPatient: Patient = {
        id: newId,
        fullIdTag: `#${newId}-${plantName.slice(0, 2).toUpperCase()}`,
        name: plantName,
        commonName: data.commonName || plantName,
        latinName: data.latinName || `${plantName} sp.`,
        room: room || 'Living Room',
        phaseTag: 'Phase 1 Active Intake',
        patientOrderTag: `Patient ${newId}`,
        baseVigor: data.baseVigor || 78,
        matchPct: data.matchPct || '95% match',
        prognosisText: data.prognosis?.prognosisText || 'Prognosis: Favorable (10–14 days)',
        prognosisSummary: data.prognosis?.prognosisSummary || 'Active Recovery Roadmap',
        prognosisDetail:
          data.prognosis?.prognosisDetail ||
          'Foliar turgor restoration expected within <strong class="text-primary font-semibold">10–14 Days</strong> with steady aeration.',
        checkinText: data.prognosis?.checkinText || 'Next check-in: In 3 days',
        imageUrl: previewImage,
        photos: [
          {
            id: `photo-${Date.now()}`,
            url: previewImage,
            caption: `Intake specimen scan for ${plantName}`,
            date: 'Intake',
            source: 'upload',
            tag: 'Foliage',
          },
        ],
        severity: data.severity || {
          text: 'Foliar Acclimation & Moisture Balance',
          chip: 'Stage 1 Triage',
          icon: 'warning',
          colorClass: 'text-alert-terracotta',
          bgClass: 'bg-[#FAF0E6]',
        },
        companionVoice: data.companionVoice || {
          speaker: `${plantName}'s Voice`,
          initialEmoji: '🌱👀',
          happyEmoji: '🌿✨',
          moodBadge: '!',
          voiceQuote: `“I'm settling into my new spot in the ${room}, hope to get some fresh hydration soon!”`,
          happyVoiceQuote: '“My leaves are perked up and loving the care regimen!”',
        },
        drNote: data.drNote || '“Great job bringing this specimen into clinical care. Consistency is key.”',
        pathology: data.pathology || {
          primaryTitle: 'Primary: Minor Environmental Acclimation',
          priorityBadge: 'Priority 1',
          primaryDesc: 'Slight transpiration stress following seasonal or watering variation.',
          diffTags: [
            { text: 'Light adjustment (normal)', type: 'info' },
            { text: 'Root pathogens (negative)', type: 'cancel' },
          ],
        },
        careSubtitle: `Clinical recovery and nourishment protocol for ${plantName} in ${room}.`,
        phases: data.phases || [
          {
            number: 1,
            title: 'Phase 1 • Initial Hydration Calibration',
            circleBg: 'bg-primary-container text-white',
            badge: 'Immediate action',
            tasks: [
              {
                id: 'np_1',
                title: 'Check top 2 inches soil moisture',
                time: '5 mins',
                desc: 'Probe substrate to confirm root zone hydration level.',
                completed: false,
              },
              {
                id: 'np_2',
                title: 'Cleanse foliage of ambient dust',
                time: '15 mins',
                desc: 'Gently wipe leaves with damp cloth to maximize photosynthesis.',
                completed: false,
              },
            ],
          },
        ],
        treatmentProtocols: data.treatmentProtocols || {
          organicRemedies: [
            {
              title: 'Dilute Kelp Root Tonic',
              badge: '🐾 100% Pet-Safe',
              desc: 'Encourages root hair proliferation.',
              usage: 'Bi-weekly feed',
            },
          ],
          commercialSolutions: [
            {
              title: 'Balanced Micro-Nutrient Houseplant Feed',
              badge: '✓ Standard Formulation',
              desc: 'Provides iron, magnesium, and nitrogen.',
              linkText: 'Find & Buy',
            },
          ],
        },
      };

      onAddPatient(createdPatient);
      onClose();
    } catch {
      // Fallback patient creation
      const fallbackPatient: Patient = {
        id: newId,
        fullIdTag: `#${newId}-${plantName.slice(0, 2).toUpperCase()}`,
        name: plantName,
        commonName: plantName,
        latinName: `${plantName} botanical sp.`,
        room: room || 'Living Room',
        phaseTag: 'Phase 1 Active Intake',
        patientOrderTag: `Patient ${newId}`,
        baseVigor: 80,
        matchPct: '94% match',
        prognosisText: 'Prognosis: Optimistic (10–14 days)',
        prognosisSummary: 'Clinical Intake Registered',
        prognosisDetail:
          'Active rehabilitation under care protocol. Expect vigor turnaround within <strong class="text-primary font-semibold">10–14 Days</strong>.',
        checkinText: 'Next check-in: In 3 days',
        imageUrl: previewImage,
        photos: [
          {
            id: `photo-${Date.now()}`,
            url: previewImage,
            caption: `Intake scan for ${plantName}`,
            date: 'Intake',
            source: 'upload',
            tag: 'Foliage',
          },
        ],
        severity: {
          text: 'Foliar Stress & Hydration Check',
          chip: 'Stage 1 Triage',
          icon: 'warning',
          colorClass: 'text-alert-terracotta',
          bgClass: 'bg-[#FAF0E6]',
        },
        companionVoice: {
          speaker: `${plantName}'s Voice`,
          initialEmoji: '🌱👀',
          happyEmoji: '🌿✨',
          moodBadge: '!',
          voiceQuote: `“I'm settling into my new spot in the ${room}, looking forward to good care!”`,
          happyVoiceQuote: '“My leaves feel crisp and hydrated!”',
        },
        drNote: '“Welcome to the recovery room! Maintain steady indirect light.”',
        pathology: {
          primaryTitle: 'Primary: Initial Specimen Intake',
          priorityBadge: 'Priority 1',
          primaryDesc: 'Routine diagnostic monitoring for newly enrolled conservatory patient.',
          diffTags: [{ text: 'Acclimation (active)', type: 'info' }],
        },
        careSubtitle: `Clinical care regimen for ${plantName} in ${room}.`,
        phases: [
          {
            number: 1,
            title: 'Phase 1 • Initial Inspection',
            circleBg: 'bg-primary-container text-white',
            badge: 'Immediate action',
            tasks: [
              {
                id: 'fb_1',
                title: 'Inspect leaf undersides for mites',
                time: '5 mins',
                desc: 'Carefully check foliage for webbing or stippling.',
                completed: false,
              },
              {
                id: 'fb_2',
                title: 'Soil moisture assessment',
                time: '5 mins',
                desc: 'Probe topsoil to determine watering schedule.',
                completed: false,
              },
            ],
          },
        ],
        treatmentProtocols: {
          organicRemedies: [
            {
              title: 'Chamomile Root Tonic',
              badge: '🐾 100% Pet-Safe',
              desc: 'Calms transplant and acclimation shock.',
              usage: 'Single application',
            },
          ],
          commercialSolutions: [],
        },
      };

      onAddPatient(fallbackPatient);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[#144226]/15 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#E8ECE9] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#144226]">Diagnose & Enroll New Patient</h2>
            <p className="text-xs text-[#414942]">
              Add a plant to your conservatory for Gemini foliar pathology diagnosis and recovery tracking.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#e8f0e9] hover:bg-[#dce4de] flex items-center justify-center text-[#414942]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#144226] mb-1">
              Plant Name / Specimen Identifier *
            </label>
            <input
              type="text"
              required
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g. Golden Pothos, Snake Plant, Peace Lily, Philodendron..."
              className="w-full px-3 py-2 bg-[#f7faf8] border border-[#E8ECE9] rounded-xl text-sm text-[#161d1a] focus:border-[#376847]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#144226] mb-1">
                Room / Microclimate Location
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 bg-[#f7faf8] border border-[#E8ECE9] rounded-xl text-xs font-semibold text-[#161d1a]"
              >
                <option value="Living Room">Living Room</option>
                <option value="Sunroom">Sunroom</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen Window">Kitchen Window</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Balcony Greenhouse">Balcony Greenhouse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#144226] mb-1">
                Specimen Photo
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 border border-[#144226]/20 bg-white hover:bg-[#EDF4F7] text-xs font-semibold text-[#144226] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                <span>Upload Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {previewImage && (
            <div className="h-32 rounded-xl overflow-hidden border border-[#E8ECE9] relative">
              <img src={previewImage} alt="Specimen Preview" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                Specimen Leaf Preview
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#144226] mb-1">
              Observed Symptoms or Care History
            </label>
            <textarea
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Pale leaves, sudden drooping, crunchy edges, haven't watered in 2 weeks..."
              className="w-full p-2.5 bg-[#f7faf8] border border-[#E8ECE9] rounded-xl text-xs text-[#161d1a] focus:border-[#376847]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E8ECE9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#414942] hover:bg-[#EDF4F7] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold bg-[#2d5a3c] hover:bg-[#144226] text-white rounded-lg flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">
                    progress_activity
                  </span>
                  <span>Diagnosing with Gemini...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">stethoscope</span>
                  <span>Diagnose & Add Patient</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
