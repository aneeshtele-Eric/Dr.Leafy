import { Patient } from '../types';

export const INITIAL_PATIENTS: Record<string, Patient> = {
  'DL-8821': {
    id: 'DL-8821',
    fullIdTag: '#DL-8821-MD',
    name: 'Monstera Deliciosa',
    commonName: 'Swiss Cheese Plant',
    latinName: 'Monstera Deliciosa Liebm.',
    room: 'Living Room',
    phaseTag: 'Phase 1 Emergency',
    patientOrderTag: 'Patient DL-8821 (1 of 3)',
    baseVigor: 88,
    matchPct: '96% match',
    prognosisText: 'Prognosis: Optimistic (14–21 days)',
    prognosisSummary: 'High Recovery Likelihood',
    prognosisDetail:
      'Full foliar bounce-back expected within <strong class="text-primary font-semibold">14–21 Days</strong> under the prescribed hydration adjustments.',
    checkinText: 'Next check-in: In 3 days',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBha0kTSgsmNWONbYhT7CTzkEhaKe1rOsqUmUv43Gdvfi1NCgmRwDAjfuP8ptBUvdrauZ9laa7vYpAFAI8rIbdw3yvL4NaUkkbI5GhbDIhi1LOICN_c-bxF1LK36uDEqzygfdrZQujEB7hfWMIGnGi6ZoUuUqFuDhKH52TiJfSY5v0CTQNsD0xLVtWQ_eq17oHvjRFEbXPBhZRhI-p7ZBCM-bPq3ShdTXvRipCzfut36fzhlZU6yEPZVA',
    photos: [
      {
        id: 'photo-md-1',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBha0kTSgsmNWONbYhT7CTzkEhaKe1rOsqUmUv43Gdvfi1NCgmRwDAjfuP8ptBUvdrauZ9laa7vYpAFAI8rIbdw3yvL4NaUkkbI5GhbDIhi1LOICN_c-bxF1LK36uDEqzygfdrZQujEB7hfWMIGnGi6ZoUuUqFuDhKH52TiJfSY5v0CTQNsD0xLVtWQ_eq17oHvjRFEbXPBhZRhI-p7ZBCM-bPq3ShdTXvRipCzfut36fzhlZU6yEPZVA',
        caption: 'Lower petiole wilting and tip chlorosis',
        date: 'Oct 9, 2026',
        source: 'intake',
        tag: 'Foliage',
      },
      {
        id: 'photo-md-2',
        url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&auto=format&fit=crop&q=80',
        caption: 'Topsoil compaction and hydrophobic channeling',
        date: 'Oct 8, 2026',
        source: 'camera',
        tag: 'Soil/Roots',
      },
      {
        id: 'photo-md-3',
        url: 'https://images.unsplash.com/photo-1617173944883-6ffbd35d584e?w=800&auto=format&fit=crop&q=80',
        caption: 'Petiolar node inspection prior to bottom soak',
        date: 'Oct 9, 2026',
        source: 'camera',
        tag: 'Petiole',
      },
      {
        id: 'photo-md-4',
        url: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&auto=format&fit=crop&q=80',
        caption: 'Healthy apical fenestration furling upward',
        date: 'Oct 10, 2026',
        source: 'upload',
        tag: 'Foliage',
      },
    ],
    severity: {
      text: 'Moderate Under-watering & Leaf Blight',
      chip: 'Stage 2 Triage',
      icon: 'warning',
      colorClass: 'text-alert-terracotta',
      bgClass: 'bg-[#FAF0E6]',
      borderClass: 'border-alert-terracotta/25',
    },
    companionVoice: {
      speaker: "Monstera's Voice",
      initialEmoji: '🥺🌿',
      happyEmoji: '🌿😊',
      moodBadge: '!',
      moodBadgeBg: 'bg-alert-terracotta',
      voiceQuote:
        '“I\'m feeling a bit parched on my lower leaves, and my roots could really use some tender aeration...”',
      happyVoiceQuote:
        '“Ahhh, that bottom soak feels wonderful! My root cells are rehydrating and my petioles feel so refreshed!”',
    },
    drNote:
      '“Don\'t fret! Monstera are remarkably resilient with steady moisture. You caught the leaf blight early before stem rot settled in.”',
    pathology: {
      primaryTitle: 'Primary: Early Chlorosis & Soil Compaction',
      priorityBadge: 'Priority 1',
      primaryDesc:
        'The lower petiole shows characteristic turgor loss while outer tip crisping stems from hydrophilic soil hydrophobic channeling.',
      diffTags: [
        { text: 'Low humidity (secondary contributor)', type: 'info' },
        { text: 'Nutrient lock (unlikely)', type: 'cancel' },
        { text: 'Spider mite infestation (negative)', type: 'cancel' },
      ],
    },
    careSubtitle:
      'Clinical tasks for foliar revitalization and root compaction relief in Living Room specimen.',
    phases: [
      {
        number: 1,
        title: 'Phase 1 • Day 0: Emergency Care',
        badge: 'Immediate action',
        badgeClass: 'text-alert-terracotta bg-[#FAF0E6] border border-alert-terracotta/15',
        circleBg: 'bg-primary-container text-on-primary',
        tasks: [
          {
            id: 'md_1',
            title: 'Deep bottom-watering soak',
            time: '45 mins',
            desc: 'Submerge lower ceramic pot in tepid distilled water to break soil hydrophobicity evenly.',
            completed: false,
          },
          {
            id: 'md_2',
            title: 'Prune 2 yellowed lower leaves',
            time: '10 mins',
            desc: 'Use sterilized shears at a 45° angle to prevent plant energy depletion into dying foliage.',
            completed: false,
          },
        ],
      },
      {
        number: 2,
        title: 'Phase 2 • Week 1: Active Treatment',
        badge: '',
        circleBg: 'bg-secondary text-on-secondary',
        tasks: [
          {
            id: 'md_3',
            title: 'Aerate compacted topsoil with chopstick',
            time: '5 mins',
            desc: 'Gently probe 2 inches into soil substrate around perimeter to bring vital oxygen to the root zone.',
            completed: false,
          },
          {
            id: 'md_4',
            title: 'Misting & 60% humidity adjustment',
            time: 'Daily',
            desc: 'Group plant with other tropicals or place on a pebble tray to prevent foliar edge desiccation.',
            completed: false,
          },
        ],
      },
      {
        number: 3,
        title: 'Phase 3 • Week 2–4: Recovery & New Growth',
        badge: '',
        circleBg: 'bg-outline text-surface-card',
        tasks: [
          {
            id: 'md_5',
            title: 'Check new fenestration shoots',
            time: 'Weekly',
            desc: 'Inspect the apical stem for light green spear furling indicative of vascular re-hydration.',
            completed: false,
          },
          {
            id: 'md_6',
            title: 'Gentle balanced nitrogen feed',
            time: 'Week 3',
            desc: 'Dilute organic feed to quarter strength; never fertilize when soil is completely dry.',
            completed: false,
          },
        ],
      },
    ],
    treatmentProtocols: {
      organicRemedies: [
        {
          title: 'DIY Ceylon Cinnamon Dusting',
          badge: '🐾 100% Pet-Safe',
          desc: 'Natural antifungal cinnamaldehyde prevents spore germination on pruned Monstera nodes.',
          usage: 'Recipe: Dust fresh cut cuts',
        },
        {
          title: 'Cold-Pressed Neem Oil Emulsion',
          badge: '🐾 Organic Standard',
          desc: 'Mix 5ml cold-pressed neem with 2ml castile soap in 1L warm water. Gently wipe top and bottom leaf blades.',
          usage: 'Spray once / 14 days',
        },
        {
          title: 'Chamomile Antiseptic Soil Flush',
          badge: '🐾 Gentle Tonic',
          desc: 'Brew mild chamomile tea, allow to cool completely, and use as the moisture agent during soak.',
          usage: 'Single Application',
        },
      ],
      commercialSolutions: [
        {
          title: 'Gentle Chelated Copper Fungicide',
          badge: '⚠️ Keep away from pets',
          desc: 'Broad spectrum micronized mineral copper controls leaf spot and blight recurrence on large foliage.',
          linkText: 'Find & Buy',
        },
        {
          title: 'Slow-Release Bio-Liquid 3-1-2 Formula',
          badge: '✓ Child-safe capped',
          desc: 'Hydrolyzed fish kelp blend designed to stimulate leaf fenestration without root osmotic burn.',
          linkText: 'Find & Buy',
        },
      ],
    },
    careNotes: [
      {
        id: 'cn-0',
        date: 'Oct 4',
        note: 'Initial foliar turgor drop observed after dry spell. Lower petiole wilt.',
        author: 'Dr. Leafy Intake',
        vigorAtTime: 78,
      },
      {
        id: 'cn-0b',
        date: 'Oct 6',
        note: 'Substrate aeration check. Minor hydrophobic channeling noted.',
        author: 'Dr. Leafy Intake',
        vigorAtTime: 82,
      },
      {
        id: 'cn-1',
        date: 'Oct 8',
        note: 'Noticed tip browning and lower leaf paling after 10-day trip. Soil was dry down to base.',
        author: 'Dr. Leafy Intake',
        vigorAtTime: 86,
      },
      {
        id: 'cn-2',
        date: 'Oct 9',
        note: 'Initial triage performed. Bottom soak schedule initiated. Pruning scheduled.',
        author: 'Aneesh (Botanist)',
        vigorAtTime: 88,
      },
    ],
  },

  'DL-8822': {
    id: 'DL-8822',
    fullIdTag: '#DL-8822-FLF',
    name: 'Fiddle Leaf Fig',
    commonName: 'Fiddle-Leaf Fig Tree',
    latinName: 'Ficus lyrata Warb.',
    room: 'Sunroom',
    phaseTag: 'Phase 2 Active Treatment',
    patientOrderTag: 'Patient DL-8822 (2 of 3)',
    baseVigor: 64,
    matchPct: '99% match',
    prognosisText: 'Prognosis: Moderate Recovery (7–10 days)',
    prognosisSummary: 'Steady Foliar Turnaround',
    prognosisDetail:
      'Foliage clearing and cellular recovery expected in <strong class="text-primary font-semibold">7–10 Days</strong> following targeted pest abatement & humidity shield.',
    checkinText: 'Next check-in: In 2 days',
    imageUrl:
      'https://images.unsplash.com/photo-1597055181300-e3633a207519?w=800&auto=format&fit=crop&q=80',
    photos: [
      {
        id: 'photo-flf-1',
        url: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?w=800&auto=format&fit=crop&q=80',
        caption: 'Full tree profile in sunroom corner',
        date: 'Oct 3, 2026',
        source: 'intake',
        tag: 'Foliage',
      },
      {
        id: 'photo-flf-2',
        url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop&q=80',
        caption: 'Abaxial leaf lamina stippling and spider mite colonies',
        date: 'Oct 5, 2026',
        source: 'camera',
        tag: 'Underside',
      },
      {
        id: 'photo-flf-3',
        url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&auto=format&fit=crop&q=80',
        caption: 'Post-shower neem oil wipe sheen check',
        date: 'Oct 7, 2026',
        source: 'camera',
        tag: 'Foliage',
      },
    ],
    severity: {
      text: 'Spider Mites & Cellular Stippling',
      chip: 'Stage 3 Infestation',
      icon: 'bug_report',
      colorClass: 'text-alert-terracotta',
      bgClass: 'bg-[#FAF0E6]',
      borderClass: 'border-alert-terracotta/25',
    },
    companionVoice: {
      speaker: "Fiddle Leaf's Voice",
      initialEmoji: '😣🐛',
      happyEmoji: '🪴✨',
      moodBadge: '⚠️',
      moodBadgeBg: 'bg-alert-terracotta',
      voiceQuote:
        '“Those sneaky spider mites on my undersides are tickling me fiercely, but the neem oil treatment is starting to soothe my fronds!”',
      happyVoiceQuote:
        '“My broad leaves feel so clean! The fine webbing is cleared and I can finally soak in the dappled sunroom rays without itching!”',
    },
    drNote:
      '“Ficus lyrata leaves are thick yet susceptible to stippling. Consistent undersheet wiping and avoiding drafty radiators will secure quick remission.”',
    pathology: {
      primaryTitle: 'Primary: Tetranychidae Webbing & Foliar Desiccation',
      priorityBadge: 'Critical Triage',
      primaryDesc:
        'Micro-punctures on abaxial leaf lamina causing pale stippling and early leaf drop along midrib veins.',
      diffTags: [
        { text: 'Bacterial leaf spot (ruled out)', type: 'cancel' },
        { text: 'Drafty cold air exposure (minor factor)', type: 'info' },
        { text: 'Root rot / Pythium (negative)', type: 'cancel' },
      ],
    },
    careSubtitle:
      'Targeted pest quarantine & lipid barrier treatment for Ficus lyrata in Sunroom.',
    phases: [
      {
        number: 1,
        title: 'Phase 1 • Day 0: Infestation Containment',
        badge: 'Quarantine Active',
        badgeClass: 'text-alert-terracotta bg-[#FAF0E6] border border-alert-terracotta/15',
        circleBg: 'bg-alert-terracotta text-on-primary',
        tasks: [
          {
            id: 'flf_1',
            title: 'Lukewarm shower & physical rinse',
            time: '20 mins',
            desc: 'Isolate in bathroom and gently wash tops and undersides of leaves to dislodge mite colonies.',
            completed: true,
          },
          {
            id: 'flf_2',
            title: 'Microfibre leaf wipe with neem formula',
            time: '25 mins',
            desc: 'Carefully stroke down each leaf blade with diluted emulsified horticultural neem oil.',
            completed: true,
          },
        ],
      },
      {
        number: 2,
        title: 'Phase 2 • Day 3–7: Barrier Protection',
        badge: '',
        circleBg: 'bg-secondary text-on-secondary',
        tasks: [
          {
            id: 'flf_3',
            title: 'Relocate away from drafty AC vent',
            time: '10 mins',
            desc: 'Position in gentle indirect sunroom light at steady 70°F (21°C) to prevent stress drop.',
            completed: true,
          },
          {
            id: 'flf_4',
            title: 'Second contact repellent application',
            time: '15 mins',
            desc: 'Spray leaf undersides and petiolar junctures to eliminate newly hatched nymph stages.',
            completed: false,
          },
        ],
      },
      {
        number: 3,
        title: 'Phase 3 • Week 2+: Foliar Restoration',
        badge: '',
        circleBg: 'bg-outline text-surface-card',
        tasks: [
          {
            id: 'flf_5',
            title: 'Dilute foliar calcium & nitrogen tonic',
            time: 'Week 2',
            desc: 'Apply light bio-stimulant to strengthen leaf cuticles against future pest penetration.',
            completed: false,
          },
        ],
      },
    ],
    treatmentProtocols: {
      organicRemedies: [
        {
          title: 'Castile Soap & Cold-Pressed Neem Foliar Bath',
          badge: '🐾 100% Pet-Safe',
          desc: 'Suffocates active nymph stages by dissolving lipid exoskeleton without clogging stomata.',
          usage: 'Apply every 4-5 days',
        },
        {
          title: 'Rosemary Essential Oil Deterrent Mist',
          badge: '🐾 Gentle Tonic',
          desc: 'Natural terpinoid vapors disrupt reproductive pheromones of spider mite colonies.',
          usage: 'Weekly preventative mist',
        },
      ],
      commercialSolutions: [
        {
          title: 'Potassium Salts of Fatty Acids (Insecticidal Soap)',
          badge: '✓ OMRI Listed',
          desc: 'Targeted organic contact miticide that dries within hours leaving zero toxic residue.',
          linkText: 'Find & Buy',
        },
        {
          title: 'Systemic Houseplant Granules',
          badge: '⚠️ Keep away from pets',
          desc: 'Sub-surface root uptake protects newly emerging leaves from systemic pests for 8 weeks.',
          linkText: 'Find & Buy',
        },
      ],
    },
    careNotes: [
      {
        id: 'cn-flf-1',
        date: 'Oct 3',
        note: 'Noticed heavy spider mite colonies under leaves; pale stippling visible.',
        author: 'Dr. Leafy Intake',
        vigorAtTime: 48,
      },
      {
        id: 'cn-flf-2',
        date: 'Oct 5',
        note: 'Isolated plant in bathroom and gave full lukewarm shower rinse.',
        author: 'Aneesh (Botanist)',
        vigorAtTime: 54,
      },
      {
        id: 'cn-flf-3',
        date: 'Oct 7',
        note: 'Wiped all foliage blades with cold-pressed neem and castile soap emulsion.',
        author: 'Aneesh (Botanist)',
        vigorAtTime: 60,
      },
      {
        id: 'cn-flf-4',
        date: 'Oct 9',
        note: 'Relocated away from AC draft into stable 70°F sunroom light. Stippling arrested.',
        author: 'Aneesh (Botanist)',
        vigorAtTime: 64,
      },
    ],
  },

  'DL-8823': {
    id: 'DL-8823',
    fullIdTag: '#DL-8823-CO',
    name: 'Calathea Orbifolia',
    commonName: 'Orbifolia Prayer Plant',
    latinName: 'Goeppertia orbifolia (Linden)',
    room: 'Bedroom',
    phaseTag: 'Phase 3 Near Full Recovery',
    patientOrderTag: 'Patient DL-8823 (3 of 3)',
    baseVigor: 92,
    matchPct: '98% match',
    prognosisText: 'Prognosis: Near Full Recovery (2–4 days)',
    prognosisSummary: 'Excellent Botanical Equilibrium',
    prognosisDetail:
      'Full tissue resilience restored! Final discharge check scheduled within <strong class="text-success-leaf font-semibold">2–4 Days</strong>.',
    checkinText: 'Next check-in: In 4 days',
    imageUrl:
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80',
    photos: [
      {
        id: 'photo-co-1',
        url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80',
        caption: 'Broad metallic silver-green foliar banding',
        date: 'Sep 29, 2026',
        source: 'intake',
        tag: 'Foliage',
      },
      {
        id: 'photo-co-2',
        url: 'https://images.unsplash.com/photo-1508022713622-df2d8fb7b4ea?w=800&auto=format&fit=crop&q=80',
        caption: 'Marginal chlorosis prior to distilled flush',
        date: 'Oct 2, 2026',
        source: 'camera',
        tag: 'Foliage',
      },
      {
        id: 'photo-co-3',
        url: 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&auto=format&fit=crop&q=80',
        caption: 'Dusk prayer leaf vertical lift response (nyctinasty)',
        date: 'Oct 8, 2026',
        source: 'camera',
        tag: 'Foliage',
      },
    ],
    severity: {
      text: 'Crisping Fronds Healed • Turgor Restored',
      chip: 'Stage 1 Stable',
      icon: 'check_circle',
      colorClass: 'text-success-leaf',
      bgClass: 'bg-[#EAF4EE]',
      borderClass: 'border-success-leaf/25',
    },
    companionVoice: {
      speaker: "Calathea's Voice",
      initialEmoji: '🌿✨',
      happyEmoji: '🌸😊',
      moodBadge: '✓',
      moodBadgeBg: 'bg-success-leaf',
      voiceQuote:
        '“My crisp leaf edges have halted and two brand new unfurling leaves are drinking up the 65% humidity! Thank you for reviving me!”',
      happyVoiceQuote:
        '“Look at me praying upwards tonight! The distilled water flush was exactly what my sensitive calathea roots craved!”',
    },
    drNote:
      '“Magnificent comeback! Calatheas are notorious mineral divas—stick exclusively to distilled or rainwater and keep the fine mist going.”',
    pathology: {
      primaryTitle: 'Primary: Calathea Osmotic Shock (Resolved)',
      priorityBadge: 'Stabilized',
      primaryDesc:
        'Mineral tap water fluoride salt accumulation successfully flushed; new leaf margins display pristine silver-green banding.',
      diffTags: [
        { text: 'Mineral burn (effectively flushed)', type: 'info' },
        { text: 'Crisp margin necrosis (arrested)', type: 'info' },
        { text: 'Fungal leaf spot (negative)', type: 'cancel' },
      ],
    },
    careSubtitle:
      'Final stabilization and maintenance protocol for Goeppertia orbifolia in Bedroom.',
    phases: [
      {
        number: 1,
        title: 'Phase 1 • Emergency Salt Flush',
        badge: 'Completed',
        badgeClass: 'text-success-leaf bg-[#EAF4EE] border border-success-leaf/20',
        circleBg: 'bg-success-leaf text-on-primary',
        tasks: [
          {
            id: 'co_1',
            title: 'Distilled rainwater soil flush',
            time: '30 mins',
            desc: 'Leached tap-water salt crusts from root-ball with 2 liters of pure distilled water.',
            completed: true,
          },
          {
            id: 'co_2',
            title: 'Trim dry outer brown edges with sterilized blade',
            time: '15 mins',
            desc: 'Carefully shaped leaf margins leaving an ultra-fine dry buffer to prevent living tissue tear.',
            completed: true,
          },
        ],
      },
      {
        number: 2,
        title: 'Phase 2 • Microclimate Calibration',
        badge: 'Completed',
        badgeClass: 'text-success-leaf bg-[#EAF4EE] border border-success-leaf/20',
        circleBg: 'bg-success-leaf text-on-primary',
        tasks: [
          {
            id: 'co_3',
            title: 'Ultrasonic cool-mist humidifier set to 65%',
            time: 'Ongoing',
            desc: 'Positioned mist vapor plume 3 feet from foliar canopy to prevent droplet pooling.',
            completed: true,
          },
          {
            id: 'co_4',
            title: 'Pebble humidity tray replenishment',
            time: 'Bi-weekly',
            desc: 'Filled ceramic pebble tray to keep ambient air moist around bedroom plant stand.',
            completed: true,
          },
          {
            id: 'co_5',
            title: 'Monitor evening prayer leaf fold',
            time: 'Daily',
            desc: 'Verify pulvinus movement when leaves naturally rise vertically at dusk.',
            completed: true,
          },
        ],
      },
      {
        number: 3,
        title: 'Phase 3 • New Growth Celebration',
        badge: 'Final Step',
        badgeClass: 'text-primary bg-surface-container border border-primary/20',
        circleBg: 'bg-secondary text-on-secondary',
        tasks: [
          {
            id: 'co_6',
            title: 'Inspect unfurling apical spear',
            time: 'Weekly',
            desc: 'Watch the new rolled cylindrical leaf uncoil into glossy emerald stripes.',
            completed: false,
          },
        ],
      },
    ],
    treatmentProtocols: {
      organicRemedies: [
        {
          title: 'Distilled Rainwater & Humic Acid Rinse',
          badge: '🐾 100% Pet-Safe',
          desc: 'Naturally chelates bound carbonates without altering delicate rhizosphere pH.',
          usage: 'Continuous watering source',
        },
      ],
      commercialSolutions: [
        {
          title: 'Zero-Chlorine Reverse Osmosis Mineral Conditioner',
          badge: '✓ Safe for sensitive foliage',
          desc: 'Removes chlorine, chloramines and heavy fluorides responsible for calathea leaf margin burn.',
          linkText: 'Find & Buy',
        },
      ],
    },
    careNotes: [
      {
        id: 'cn-co-1',
        date: 'Sep 29',
        note: 'Severe crisp leaf margins after watering with hard tap water.',
        author: 'Dr. Leafy Intake',
        vigorAtTime: 65,
      },
      {
        id: 'cn-co-2',
        date: 'Oct 3',
        note: 'Pure distilled rainwater soil flush executed; 2L drained thoroughly.',
        author: 'Aneesh (Botanist)',
        vigorAtTime: 76,
      },
      {
        id: 'cn-co-3',
        date: 'Oct 6',
        note: 'Pebble humidity tray set up; ambient RH elevated to 65%.',
        author: 'Aneesh (Botanist)',
        vigorAtTime: 85,
      },
      {
        id: 'cn-co-4',
        date: 'Oct 9',
        note: 'Nighttime prayer leaf lift observed; two new spears unfurling nicely.',
        author: 'Aneesh (Botanist)',
        vigorAtTime: 92,
      },
    ],
  },
};
