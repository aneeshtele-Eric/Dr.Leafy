export interface CareTask {
  id: string;
  title: string;
  time: string;
  desc: string;
  completed: boolean;
}

export interface CarePhase {
  number: number;
  title: string;
  badge?: string;
  badgeClass?: string;
  circleBg: string;
  tasks: CareTask[];
}

export interface DiffTag {
  text: string;
  type: 'info' | 'cancel';
}

export interface OrganicRemedy {
  title: string;
  badge: string;
  desc: string;
  usage: string;
}

export interface CommercialSolution {
  title: string;
  badge: string;
  desc: string;
  linkText?: string;
}

export interface CareNoteItem {
  id: string;
  date: string;
  note: string;
  author: string;
  vigorAtTime?: number;
}

export interface PatientPhoto {
  id: string;
  url: string;
  caption?: string;
  date: string;
  source: 'camera' | 'upload' | 'intake';
  tag?: 'Foliage' | 'Petiole' | 'Soil/Roots' | 'Underside';
}

export interface Patient {
  id: string;
  fullIdTag: string;
  name: string;
  commonName: string;
  latinName: string;
  room: string;
  phaseTag: string;
  patientOrderTag: string;
  baseVigor: number;
  matchPct: string;
  prognosisText: string;
  prognosisSummary: string;
  prognosisDetail: string;
  checkinText: string;
  imageUrl: string;
  photos?: PatientPhoto[];
  severity: {
    text: string;
    chip: string;
    icon: string;
    colorClass: string;
    bgClass: string;
    borderClass?: string;
  };
  companionVoice: {
    speaker: string;
    initialEmoji: string;
    happyEmoji: string;
    moodBadge: string;
    moodBadgeBg?: string;
    voiceQuote: string;
    happyVoiceQuote: string;
  };
  drNote: string;
  pathology: {
    primaryTitle: string;
    priorityBadge: string;
    primaryDesc: string;
    diffTags: DiffTag[];
  };
  careSubtitle: string;
  phases: CarePhase[];
  treatmentProtocols: {
    organicRemedies: OrganicRemedy[];
    commercialSolutions: CommercialSolution[];
  };
  careNotes?: CareNoteItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: string;
  joinedDate: string;
  activePatientsCount: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundedSearchResult {
  text: string;
  sources: GroundingSource[];
  webSearchQueries?: string[];
}
