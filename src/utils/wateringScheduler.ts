import { Patient } from '../types';

export interface PlantWateringPlan {
  patientId: string;
  plantName: string;
  speciesCategory: string;
  recommendedIntervalDays: number;
  nextWateringDate: string;
  dueStatus: 'urgent' | 'due-soon' | 'optimal';
  reasoning: string;
  notificationTitle: string;
  notificationMessage: string;
  waterType: 'Tepid Distilled / Filtered' | 'Pure Distilled / Rainwater Only' | 'Lukewarm Filtered' | 'Standard Aerated';
}

/**
 * Calculates a tailored watering schedule and notification message
 * based on the plant species taxonomy, severity, and historical careNotes.
 */
export function calculateWateringPlan(patient: Patient): PlantWateringPlan {
  const notes = patient.careNotes || [];
  const latestNote = notes.length > 0 ? notes[notes.length - 1].note.toLowerCase() : '';
  const plantLower = (patient.name + ' ' + patient.latinName).toLowerCase();

  // 1. Monstera / Epiphytic Aroids
  if (plantLower.includes('monstera') || plantLower.includes('philodendron') || plantLower.includes('pothos')) {
    const isDryReported = latestNote.includes('dry') || latestNote.includes('soak') || latestNote.includes('compaction');
    return {
      patientId: patient.id,
      plantName: patient.name,
      speciesCategory: 'Tropical Aroid / Epiphytic Vine',
      recommendedIntervalDays: isDryReported ? 5 : 7,
      nextWateringDate: isDryReported ? 'Immediate (Today)' : 'In 3 days',
      dueStatus: isDryReported ? 'urgent' : 'due-soon',
      reasoning: isDryReported
        ? 'Recent care note indicated substrate dryness down to base. Hydrophobic channeling requires bottom-watering soak.'
        : 'Tropical aroid prefers upper 2–3 inches to dry out before deep drenching.',
      waterType: 'Tepid Distilled / Filtered',
      notificationTitle: `💧 Dr. Leafy Water Alert: ${patient.name} (#${patient.id})`,
      notificationMessage: isDryReported
        ? 'Bottom soak due! Recent care notes detected dry soil down to base. Submerge pot for 45 minutes to restore turgor.'
        : 'Time to check topsoil moisture. If top 2 inches feel dry, provide a deep thorough soak.',
    };
  }

  // 2. Ficus lyrata / Fiddle Leaf Fig
  if (plantLower.includes('ficus') || plantLower.includes('fig')) {
    const isMiteRecovery = latestNote.includes('mite') || latestNote.includes('neem') || latestNote.includes('shower');
    return {
      patientId: patient.id,
      plantName: patient.name,
      speciesCategory: 'Broadleaf Moraceae Tree',
      recommendedIntervalDays: 8,
      nextWateringDate: 'In 2 days',
      dueStatus: 'due-soon',
      reasoning: isMiteRecovery
        ? 'Ficus is recovering from foliar pest stress. Avoid soggy soil while ensuring consistent humidity to support new cuticle generation.'
        : 'Fiddle Leaf Figs require steady dry-down between waterings to prevent edema or leaf drop.',
      waterType: 'Lukewarm Filtered',
      notificationTitle: `🪴 Dr. Leafy Water Alert: ${patient.name} (#${patient.id})`,
      notificationMessage:
        'Watering check-in: Probe 2 inches deep. Avoid sudden saturation to prevent leaf edema; wipe foliage with damp cloth.',
    };
  }

  // 3. Calathea / Goeppertia (Prayer Plants)
  if (plantLower.includes('calathea') || plantLower.includes('orbifolia') || plantLower.includes('maranta')) {
    return {
      patientId: patient.id,
      plantName: patient.name,
      speciesCategory: 'Marantaceae (Prayer Plant)',
      recommendedIntervalDays: 4,
      nextWateringDate: 'In 1 day',
      dueStatus: 'due-soon',
      reasoning:
        'Sensitive root rhizosphere prone to fluoride and chlorine burn. Care notes require continuous distilled water moisture and 65% humidity.',
      waterType: 'Pure Distilled / Rainwater Only',
      notificationTitle: `🌱 Dr. Leafy Water Alert: ${patient.name} (#${patient.id})`,
      notificationMessage:
        'Calathea moisture top-up due! STRICTLY use distilled or rainwater to avoid mineral salt crusts on sensitive margins.',
    };
  }

  // 4. Succulents / Sansevieria / Cacti
  if (plantLower.includes('sansevieria') || plantLower.includes('snake') || plantLower.includes('succulent')) {
    return {
      patientId: patient.id,
      plantName: patient.name,
      speciesCategory: 'Drought-tolerant Succulent',
      recommendedIntervalDays: 18,
      nextWateringDate: 'In 10 days',
      dueStatus: 'optimal',
      reasoning: 'CAM photosynthetic pathway stores moisture in fleshy blades. Water only when substrate is bone dry.',
      waterType: 'Standard Aerated',
      notificationTitle: `🌵 Dr. Leafy Water Alert: ${patient.name} (#${patient.id})`,
      notificationMessage:
        'Drought inspection: Soil is likely still moist at base. Only water if completely bone dry 3 inches down.',
    };
  }

  // 5. Default General Houseplant
  return {
    patientId: patient.id,
    plantName: patient.name,
    speciesCategory: 'Tropical Houseplant',
    recommendedIntervalDays: 6,
    nextWateringDate: 'In 3 days',
    dueStatus: 'due-soon',
    reasoning: 'Standard moisture equilibrium: Allow top 1–2 inches to dry before replenishing.',
    waterType: 'Tepid Distilled / Filtered',
    notificationTitle: `🌿 Dr. Leafy Water Alert: ${patient.name} (#${patient.id})`,
    notificationMessage:
      'Scheduled hydration probe: Test topsoil moisture. Replenish with tepid water if dry to touch.',
  };
}
