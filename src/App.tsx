/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { INITIAL_PATIENTS } from './data/initialPatients';
import { Patient, User } from './types';
import { BotanicalGuide } from './data/botanicalLibrary';
import { Navbar } from './components/Navbar';
import { ConservatoryManager } from './components/ConservatoryManager';
import { ExamineSpecimen } from './components/ExamineSpecimen';
import { SpecimenIdentity } from './components/SpecimenIdentity';
import { RecoveryForecast } from './components/RecoveryForecast';
import { PlantVoiceWidget } from './components/PlantVoiceWidget';
import { PathologyMatrix } from './components/PathologyMatrix';
import { CareJourneyTimeline } from './components/CareJourneyTimeline';
import { TreatmentProtocols } from './components/TreatmentProtocols';
import { DoctorChatSection } from './components/DoctorChatSection';
import { BotanicalLibraryView } from './components/BotanicalLibraryView';
import { MyConservatoryView } from './components/MyConservatoryView';
import { LoginModal } from './components/LoginModal';
import { AddPlantModal } from './components/AddPlantModal';
import { NotificationModal } from './components/NotificationModal';
import { HelpModal } from './components/HelpModal';
import { PdfExportModal } from './components/PdfExportModal';
import { WateringReminderToast } from './components/WateringReminderToast';
import { calculateWateringPlan, PlantWateringPlan } from './utils/wateringScheduler';
import { triggerNativeNotification } from './utils/browserNotifications';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'conservatory' | 'library'>('diagnosis');
  const [patients, setPatients] = useState<Record<string, Patient>>(INITIAL_PATIENTS);
  const [activePatientId, setActivePatientId] = useState<string>('DL-8821');

  // Authenticated user state
  const [user, setUser] = useState<User | null>({
    id: 'usr_aneesh_botanist',
    name: 'Aneesh (Botanist)',
    email: 'aneeshtele@gmail.com',
    phone: '+1 (415) 555-8821',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDBvQfTJJBjWAZkoIL3H6qVdfjNX8MS1aktaurhzzaqpUY5vLSZ0SXF-DGhgzAwtfkXSxpp7xgPzgzeQsGCzziytJKk9ama4gWInS03dQUkLwAmcK5hgVPmTiedfWoc_HjThGbnrefsSKIPlZl-4rolX-1rzTTXXEqKUbvjyz1ulBOkx2ZkEFxUl6Z8OHPUD4v_Yuzpc6lVP9D8N0nUIHovhJhaXrRznDtzAyeOtOHyUtdvEd9LnGRB4w',
    role: 'Lead Horticulturalist',
    joinedDate: 'October 2026',
    activePatientsCount: 3,
  });

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Recurring Watering Reminders State
  const [isRecurringEnabled, setIsRecurringEnabled] = useState(true);
  const [recurringInterval, setRecurringInterval] = useState('smart');
  const [activeWateringToast, setActiveWateringToast] = useState<PlantWateringPlan | null>(null);

  // Active patient object
  const activePatient = patients[activePatientId] || patients['DL-8821'];

  // Recurring Background Watering Timer
  useEffect(() => {
    if (!isRecurringEnabled) return;

    let intervalMs = 60000 * 30; // 30 mins for smart
    if (recurringInterval === 'demo') intervalMs = 25000; // 25s for fast demonstration!
    else if (recurringInterval === 'daily') intervalMs = 60000 * 60 * 24;
    else if (recurringInterval === '3days') intervalMs = 60000 * 60 * 24 * 3;
    else if (recurringInterval === 'weekly') intervalMs = 60000 * 60 * 24 * 7;

    const timer = setInterval(() => {
      const list = Object.values(patients);
      const target = list.find((p) => p.baseVigor < 90) || list[0];
      if (target) {
        const plan = calculateWateringPlan(target);
        triggerNativeNotification(plan.notificationTitle, {
          body: `${plan.notificationMessage}\n* Water: ${plan.waterType}`,
        });
        setActiveWateringToast(plan);
        setHasUnreadNotifications(true);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRecurringEnabled, recurringInterval, patients]);

  // Calculate completed tasks & vigor for the active patient
  let totalTasks = 0;
  let completedTasks = 0;
  activePatient.phases.forEach((ph) => {
    ph.tasks.forEach((t) => {
      totalTasks++;
      if (t.completed) completedTasks++;
    });
  });

  const progressFraction = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const currentVigor = Math.min(
    100,
    Math.round(activePatient.baseVigor + progressFraction * (100 - activePatient.baseVigor))
  );
  const isHappy = completedTasks >= Math.ceil(totalTasks / 2);

  // Interactive spotlight following cursor
  const spotlightRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Interactive floating spore / dew particles
  const particlesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    container.innerHTML = '';

    const count = 24;
    const sporeColors = [
      'rgba(180, 230, 195, 0.45)',
      'rgba(82, 183, 136, 0.35)',
      'rgba(249, 215, 126, 0.35)',
      'rgba(255, 255, 255, 0.55)',
    ];

    const particles: Array<{
      el: HTMLDivElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      rot: number;
      rotSpeed: number;
      swayPhase: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'leaf-particle';
      const size = Math.random() * 8 + 3;
      el.style.width = `${size}px`;
      el.style.height = `${size * (Math.random() > 0.5 ? 1.4 : 1)}px`;
      el.style.background = sporeColors[Math.floor(Math.random() * sporeColors.length)];
      if (Math.random() > 0.4) {
        el.style.boxShadow = '0 0 8px rgba(82, 183, 136, 0.4)';
      }
      container.appendChild(el);

      particles.push({
        el,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.15),
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.8,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    let animationFrameId: number;
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      particles.forEach((p) => {
        p.swayPhase += 0.02;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.3;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.y < -20) {
          p.y = h + 15;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handle task checkbox toggle
  const handleToggleTask = (phaseIndex: number, taskId: string) => {
    setPatients((prev) => {
      const current = prev[activePatientId];
      if (!current) return prev;

      const newPhases = current.phases.map((ph, pIdx) => {
        if (pIdx !== phaseIndex) return ph;
        return {
          ...ph,
          tasks: ph.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      });

      return {
        ...prev,
        [activePatientId]: {
          ...current,
          phases: newPhases,
        },
      };
    });
  };

  // Reset active patient tasks
  const handleReset = () => {
    setPatients((prev) => {
      const current = prev[activePatientId];
      if (!current) return prev;

      const newPhases = current.phases.map((ph) => ({
        ...ph,
        tasks: ph.tasks.map((t) => ({ ...t, completed: false })),
      }));

      return {
        ...prev,
        [activePatientId]: {
          ...current,
          phases: newPhases,
        },
      };
    });
  };

  // Update active patient from live Gemini diagnosis
  const handleUpdatePatientDiagnosis = (updated: Partial<Patient>) => {
    setPatients((prev) => {
      const current = prev[activePatientId];
      if (!current) return prev;
      return {
        ...prev,
        [activePatientId]: {
          ...current,
          ...updated,
        },
      };
    });
  };

  // Add Care Note to active patient
  const handleAddCareNote = (noteText: string) => {
    setPatients((prev) => {
      const current = prev[activePatientId];
      if (!current) return prev;
      const notes = current.careNotes || [];
      const newNote = {
        id: `cn-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        note: noteText,
        author: user?.name || 'Caregiver',
        vigorAtTime: currentVigor,
      };
      return {
        ...prev,
        [activePatientId]: {
          ...current,
          careNotes: [newNote, ...notes],
        },
      };
    });
  };

  // Mark patient recovered
  const handleMarkRecovered = () => {
    setPatients((prev) => {
      const current = prev[activePatientId];
      if (!current) return prev;
      return {
        ...prev,
        [activePatientId]: {
          ...current,
          baseVigor: 98,
          severity: {
            text: 'Discharged • Fully Recovered',
            chip: 'Stable / In Remission',
            icon: 'check_circle',
            colorClass: 'text-[#3B8356]',
            bgClass: 'bg-[#EAF4EE]',
            borderClass: 'border-[#3B8356]/30',
          },
          prognosisText: 'Status: Recovered & Discharged',
          prognosisSummary: 'Full Botanical Equilibrium Achieved',
          prognosisDetail:
            'Tissue resilience and foliar fenestrations fully revived! Maintained on routine preventative hydration.',
          companionVoice: {
            ...current.companionVoice,
            moodBadge: '✓',
            happyEmoji: '🌸🌿',
            happyVoiceQuote: '“Thank you for saving me! My leaves are glossy and thriving!”',
          },
        },
      };
    });
  };

  // Mark plant watered from watering notification
  const handleMarkWatered = (patientId: string) => {
    setPatients((prev) => {
      const current = prev[patientId];
      if (!current) return prev;
      const notes = current.careNotes || [];
      const newVigor = Math.min(100, current.baseVigor + 3);
      const newNote = {
        id: `cn-water-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        note: 'Completed scheduled hydration reminder. Root ball re-moistened to optimal turgor.',
        author: user?.name || 'Caregiver',
        vigorAtTime: newVigor,
      };
      return {
        ...prev,
        [patientId]: {
          ...current,
          baseVigor: newVigor,
          careNotes: [newNote, ...notes],
        },
      };
    });
  };

  // Add new patient from AddPlantModal
  const handleAddNewPatient = (newPatient: Patient) => {
    setPatients((prev) => ({
      ...prev,
      [newPatient.id]: newPatient,
    }));
    setActivePatientId(newPatient.id);
    setActiveTab('diagnosis');
  };

  // Add specimen directly from Botanical Library
  const handleDiagnosePlantFromLibrary = (guide: BotanicalGuide) => {
    const newId = `DL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      id: newId,
      fullIdTag: `#${newId}-${guide.category.slice(0, 2).toUpperCase()}`,
      name: guide.name,
      commonName: guide.name,
      latinName: guide.latinName,
      room: 'Conservatory Bay',
      phaseTag: 'Phase 1 Clinical Intake',
      patientOrderTag: `Patient ${newId}`,
      baseVigor: 75,
      matchPct: '98% match',
      prognosisText: 'Prognosis: Favorable (10–14 days)',
      prognosisSummary: 'Enrolled from Botanical Library',
      prognosisDetail:
        'Standardized clinical rehabilitation protocol initiated. Expected vigor bounce-back in <strong class="text-primary font-semibold">10–14 Days</strong>.',
      checkinText: 'Next check-in: In 3 days',
      imageUrl: guide.image,
      photos: [
        {
          id: `photo-lib-${Date.now()}`,
          url: guide.image,
          caption: `Botanical catalog specimen profile for ${guide.name}`,
          date: 'Intake',
          source: 'intake',
          tag: 'Foliage',
        },
      ],
      severity: {
        text: 'Intake Acclimation & Soil Inspection',
        chip: 'Stage 1 Triage',
        icon: 'warning',
        colorClass: 'text-alert-terracotta',
        bgClass: 'bg-[#FAF0E6]',
      },
      companionVoice: {
        speaker: `${guide.name}'s Voice`,
        initialEmoji: '🌿👀',
        happyEmoji: '🌸😊',
        moodBadge: '!',
        voiceQuote: `“I've joined the conservatory from the botanical library! Ready for hydration check.”`,
        happyVoiceQuote: '“My leaves feel vibrant and balanced!”',
      },
      drNote: `“${guide.name} thrives in ${guide.light.toLowerCase()} Avoid waterlogging.”`,
      pathology: {
        primaryTitle: 'Primary: Acclimation Calibration',
        priorityBadge: 'Priority 1',
        primaryDesc: guide.description,
        diffTags: [
          { text: 'Light adjustment (normal)', type: 'info' },
          { text: 'Root pathogens (negative)', type: 'cancel' },
        ],
      },
      careSubtitle: `Clinical recovery protocol for ${guide.name}.`,
      phases: [
        {
          number: 1,
          title: 'Phase 1 • Environment Optimization',
          badge: 'Immediate action',
          circleBg: 'bg-primary-container text-white',
          tasks: [
            {
              id: 'lib_1',
              title: `Calibrate lighting to: ${guide.light.split('.')[0]}`,
              time: '10 mins',
              desc: 'Relocate to prevent leaf scorch or chlorosis.',
              completed: false,
            },
            {
              id: 'lib_2',
              title: `Hydration test: ${guide.water.split('.')[0]}`,
              time: '5 mins',
              desc: 'Probe soil depth before adding distilled or filtered moisture.',
              completed: false,
            },
          ],
        },
      ],
      treatmentProtocols: {
        organicRemedies: [
          {
            title: 'Gentle Humic Acid Flush',
            badge: '🐾 100% Pet-Safe',
            desc: 'Stimulates micro-root hairs without chemical salt buildup.',
            usage: 'Monthly tonic',
          },
        ],
        commercialSolutions: [],
      },
    };

    handleAddNewPatient(newPatient);
  };

  return (
    <div className="text-on-surface antialiased min-h-screen flex flex-col selection:bg-[#b6edc2] selection:text-[#3b6d4b] relative overflow-x-hidden bg-[#eaf4ec]">
      {/* ========================================================================= */}
      {/* LUSH BOTANICAL GREENHOUSE BACKGROUND SYSTEM (ANIMATED & INTERACTIVE)       */}
      {/* ========================================================================= */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Botanical Lush Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#dff2e4] via-[#e5f5ea] to-[#d6ede0]"></div>

        {/* Animated Botanical Ambient Orbs */}
        <div className="orb-1 absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#5db97e]/35 via-[#348a56]/25 to-transparent blur-3xl"></div>
        <div className="orb-2 absolute top-[25%] -right-[12%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#76c893]/30 via-[#52b788]/20 to-[#f9d77e]/20 blur-3xl"></div>
        <div className="orb-3 absolute bottom-[-15%] left-[15%] w-[60vw] h-[55vw] rounded-full bg-gradient-to-tr from-[#2d6a4f]/25 via-[#40916c]/30 to-[#95d5b2]/25 blur-3xl"></div>
        <div className="sunbeam-pulse absolute top-[5%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-b from-[#fef08a]/30 via-[#bbf7d0]/30 to-transparent blur-2xl"></div>

        {/* Organic Leaf Silhouettes */}
        <div className="absolute -top-16 -right-16 w-96 h-96 opacity-20 text-[#144226]">
          <svg className="w-full h-full transform rotate-45" fill="currentColor" viewBox="0 0 200 200">
            <path d="M42.7,-72.2C54.8,-66.1,63.6,-53.4,70.5,-39.9C77.4,-26.4,82.4,-12.1,80.8,1.6C79.2,15.3,71.1,28.4,62.4,40.1C53.7,51.8,44.4,62.1,32.7,69.5C21.1,76.9,7.1,81.4,-7.4,82.1C-21.9,82.7,-37,79.5,-49.2,71.5C-61.4,63.5,-70.7,50.7,-76.3,36.5C-81.9,22.3,-83.8,6.7,-81.9,-8.1C-80,-22.8,-74.3,-36.7,-64.7,-46.8C-55.1,-56.9,-41.6,-63.2,-28.4,-68.6C-15.1,-74,-2.2,-78.6,11.2,-76.4L42.7,-72.2Z" transform="translate(100 100)"></path>
          </svg>
        </div>
        <div className="absolute bottom-10 -left-20 w-80 h-80 opacity-15 text-[#2d5a3c]">
          <svg className="w-full h-full transform -rotate-12" fill="currentColor" viewBox="0 0 200 200">
            <path d="M38.1,-63.8C49.9,-58.5,60.2,-48.5,68.2,-36.2C76.2,-23.9,81.9,-9.3,80.7,5C79.4,19.3,71.3,33.3,61.4,44.5C51.5,55.7,39.9,64.1,26.7,69.5C13.5,74.9,-1.2,77.3,-15.8,74.7C-30.4,72.1,-44.8,64.5,-55.8,53.4C-66.8,42.3,-74.3,27.7,-76.7,12.2C-79.1,-3.3,-76.4,-19.7,-68.8,-32.9C-61.2,-46.1,-48.7,-56.1,-35.6,-60.9C-22.5,-65.7,-8.7,-65.3,4.4,-66.2L38.1,-63.8Z" transform="translate(100 100)"></path>
          </svg>
        </div>

        {/* Dynamic Spotlight */}
        <div
          ref={spotlightRef}
          id="botanical-spotlight"
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle 580px at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(212, 245, 219, 0.55), rgba(254, 243, 199, 0.22) 35%, transparent 70%)',
          }}
        ></div>

        {/* Floating Spore Particles */}
        <div ref={particlesRef} className="absolute inset-0 overflow-hidden"></div>
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => setUser(null)}
        onReset={handleReset}
        onOpenNotifications={() => {
          setIsNotificationModalOpen(true);
          setHasUnreadNotifications(false);
        }}
        hasUnreadNotifications={hasUnreadNotifications}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Main Canvas Container */}
      <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6 relative z-10">
        {/* Render Diagnosis & Recovery Room */}
        {activeTab === 'diagnosis' && (
          <>
            {/* Subheader Announcement / Intent Anchor */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-2">
              <div>
                <div className="flex items-center gap-2 text-[#144226] text-xs uppercase tracking-wider mb-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#3B8356] animate-pulse shadow-[0_0_8px_#3B8356]"></span>
                  <span>Horticultural AI Diagnostic Engine • Live Case Session</span>
                </div>
                <h1 className="text-3xl text-[#144226] tracking-tight drop-shadow-xs font-bold">
                  {activePatient.name} Recovery Room
                </h1>
                <p className="text-sm text-[#414942]">
                  Your caring plant companion analyzing foliar distress and restoring vibrant botanical health ({activePatient.fullIdTag}).
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs bg-white/90 backdrop-blur-md text-[#376847] border border-[#144226]/15 shadow-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-[#3B8356]">format_image_left</span>
                  <span>Validated Care Protocol #{activePatient.id}</span>
                </span>
                <button
                  onClick={() => setIsPdfExportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs bg-white/95 hover:bg-[#EDF4F7] text-[#144226] border border-[#144226]/20 shadow-sm font-bold transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  title="Export Clinical Recovery Roadmap PDF Report"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#D97746]">picture_as_pdf</span>
                  <span>Export Roadmap PDF</span>
                </button>
                <button
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs bg-white/95 hover:bg-[#EDF4F7] text-[#144226] border border-[#144226]/20 shadow-sm font-bold transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  title="Configure Recurring Browser Watering Reminders"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#3B8356]">water_drop</span>
                  <span>Watering Reminders</span>
                </button>
              </div>
            </div>

            {/* Specimen Patient Carousel & Conservatory Matrix */}
            <ConservatoryManager
              patients={patients}
              activePatientId={activePatientId}
              onSelectPatient={setActivePatientId}
              onAddNewPatient={() => setIsAddPlantModalOpen(true)}
            />

            {/* Dual-Column Workspace: 5/7 Ratio Desktop Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT RAIL: Persistent Context & Input Dropzone (5 Columns) */}
              <div className="lg:col-span-5 space-y-6">
                <ExamineSpecimen
                  activePatient={activePatient}
                  onUpdatePatientDiagnosis={handleUpdatePatientDiagnosis}
                  onAddNewPatientModal={() => setIsAddPlantModalOpen(true)}
                />

                <SpecimenIdentity
                  activePatient={activePatient}
                  onAddNote={handleAddCareNote}
                  onMarkRecovered={handleMarkRecovered}
                  onExportPdf={() => setIsPdfExportModalOpen(true)}
                />

                <RecoveryForecast
                  activePatient={activePatient}
                  currentVigor={currentVigor}
                />
              </div>

              {/* RIGHT RAIL: Diagnostic Journey & Prescribed Treatment Flow (7 Columns) */}
              <div className="lg:col-span-7 space-y-6">
                <PlantVoiceWidget
                  activePatient={activePatient}
                  isHappy={isHappy}
                />

                <PathologyMatrix activePatient={activePatient} />

                <CareJourneyTimeline
                  activePatient={activePatient}
                  onToggleTask={handleToggleTask}
                  completedTasksCount={completedTasks}
                  totalTasksCount={totalTasks}
                  onExportPdf={() => setIsPdfExportModalOpen(true)}
                />

                <TreatmentProtocols activePatient={activePatient} />

                <DoctorChatSection activePatient={activePatient} />
              </div>
            </div>
          </>
        )}

        {/* Render My Conservatory Tab */}
        {activeTab === 'conservatory' && (
          <MyConservatoryView
            patients={patients}
            onSelectPatient={(id) => {
              setActivePatientId(id);
              setActiveTab('diagnosis');
            }}
            onAddNewPlant={() => setIsAddPlantModalOpen(true)}
          />
        )}

        {/* Render Botanical Library Tab (with Gemini NL understanding & Google Search grounding) */}
        {activeTab === 'library' && (
          <BotanicalLibraryView
            onDiagnosePlant={handleDiagnosePlantFromLibrary}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-[#144226]/10 mt-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 py-6 max-w-[1180px] mx-auto gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg text-[#144226] font-bold">Dr. Leafy</span>
            <span className="text-xs text-[#414942] pl-2 border-l border-[#144226]/10">
              © 2026 Dr. Leafy AI Botanical Health. Cultivating thriving green companions.
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="text-xs text-[#414942] hover:text-[#144226] transition-colors font-medium cursor-pointer"
            >
              Plant Triage Guide
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className="text-xs text-[#414942] hover:text-[#144226] transition-colors font-medium cursor-pointer"
            >
              Symptom Index
            </button>
            <button
              onClick={() => setActiveTab('conservatory')}
              className="text-xs text-[#414942] hover:text-[#144226] transition-colors font-medium cursor-pointer"
            >
              Care Standards
            </button>
            <span className="text-[11px] text-[#376847] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#144226]/10 font-bold">
              Gemini + Google Search Powered
            </span>
          </nav>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />

      <AddPlantModal
        isOpen={isAddPlantModalOpen}
        onClose={() => setIsAddPlantModalOpen(false)}
        onAddPatient={handleAddNewPatient}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onNavigateToPatient={(pid) => {
          setActivePatientId(pid);
          setActiveTab('diagnosis');
        }}
        patients={patients}
        onTriggerInAppToast={(plan) => setActiveWateringToast(plan)}
        isRecurringEnabled={isRecurringEnabled}
        onToggleRecurring={setIsRecurringEnabled}
        recurringInterval={recurringInterval}
        onChangeRecurringInterval={setRecurringInterval}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <PdfExportModal
        isOpen={isPdfExportModalOpen}
        onClose={() => setIsPdfExportModalOpen(false)}
        patient={activePatient}
        currentVigor={currentVigor}
        user={user}
      />

      <WateringReminderToast
        toast={activeWateringToast}
        onDismiss={() => setActiveWateringToast(null)}
        onNavigateToPatient={(pid) => {
          setActivePatientId(pid);
          setActiveTab('diagnosis');
        }}
        onMarkWatered={handleMarkWatered}
      />
    </div>
  );
}
