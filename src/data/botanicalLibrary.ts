export interface BotanicalGuide {
  id: string;
  name: string;
  latinName: string;
  category: 'Tropical' | 'Aroid' | 'Ficus' | 'Succulent' | 'Calathea' | 'Fern';
  difficulty: 'Easy' | 'Moderate' | 'Demanding';
  light: string;
  water: string;
  humidity: string;
  petSafe: boolean;
  commonIssues: string[];
  bestSoil: string;
  propagation: string;
  image: string;
  description: string;
}

export const BOTANICAL_GUIDES: BotanicalGuide[] = [
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    latinName: 'Monstera deliciosa Liebm.',
    category: 'Aroid',
    difficulty: 'Easy',
    light: 'Bright, indirect sunlight. Avoid scorching direct midday sun.',
    water: 'Allow top 2–3 inches of soil to dry out between waterings. Sensitive to soggy roots.',
    humidity: 'Prefers 60%+ humidity, but adaptable to normal household levels (40–50%).',
    petSafe: false,
    commonIssues: [
      'Leaf yellowing (chlorosis) from overwatering',
      'Crispy brown tips from dry air or hydrophobic soil',
      'Lack of fenestrations due to low light intensity',
    ],
    bestSoil: 'Chunky aroid mix: 40% potting soil, 30% orchid bark, 20% perlite, 10% horticultural charcoal.',
    propagation: 'Stem cuttings with at least one viable node and aerial root in water or sphagnum moss.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBha0kTSgsmNWONbYhT7CTzkEhaKe1rOsqUmUv43Gdvfi1NCgmRwDAjfuP8ptBUvdrauZ9laa7vYpAFAI8rIbdw3yvL4NaUkkbI5GhbDIhi1LOICN_c-bxF1LK36uDEqzygfdrZQujEB7hfWMIGnGi6ZoUuUqFuDhKH52TiJfSY5v0CTQNsD0xLVtWQ_eq17oHvjRFEbXPBhZRhI-p7ZBCM-bPq3ShdTXvRipCzfut36fzhlZU6yEPZVA',
    description: 'Renowned for its iconic fenestrated foliage, the Swiss Cheese plant is an epiphytic vine native to southern Mexican rainforests that thrives with moss pole climbing support.',
  },
  {
    id: 'ficus-lyrata',
    name: 'Fiddle Leaf Fig',
    latinName: 'Ficus lyrata Warb.',
    category: 'Ficus',
    difficulty: 'Moderate',
    light: 'Bright, filtered sunlight (minimum 4–6 hours daily). Avoid sudden relocation.',
    water: 'Water thoroughly when top 2 inches dry out. Prone to leaf drop if over/under-watered.',
    humidity: 'Prefers 50–65% humidity. Wipe broad foliage with damp microfiber regularly.',
    petSafe: false,
    commonIssues: [
      'Spider mites on leaf undersides during winter heating',
      'Edema (red spots on young leaves) from irregular hydration',
      'Sudden leaf shedding from drafts or air conditioner vents',
    ],
    bestSoil: 'Well-draining, rich peaty potting mix amended with perlite and pumice.',
    propagation: 'Stem tip cuttings with rooting hormone, or air-layering on mature trunks.',
    image: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?w=800&auto=format&fit=crop&q=80',
    description: 'Known for violin-shaped glossy leathery leaves. Requires consistent lighting and stable ambient temperature to thrive without foliar protest.',
  },
  {
    id: 'calathea-orbifolia',
    name: 'Calathea Orbifolia',
    latinName: 'Goeppertia orbifolia',
    category: 'Calathea',
    difficulty: 'Demanding',
    light: 'Medium to bright indirect light. Direct sunlight burns the delicate silver pinstripes.',
    water: 'Keep consistently damp but never waterlogged. STRICTLY use distilled or rainwater.',
    humidity: 'High (65%+ required). Low humidity causes leaf margin browning within 48 hours.',
    petSafe: true,
    commonIssues: [
      'Fluoride and chlorine toxicity causing brown edges',
      'Curling leaves signaling low ambient moisture or heat stress',
      'Fungus gnats if top layer remains persistently soaked without air circulation',
    ],
    bestSoil: 'Aerated moisture-retentive blend: peat moss, perlite, vermiculite, and composted pine bark.',
    propagation: 'Division of rhizome root clumps during spring repotting.',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80',
    description: 'Celebrated for its broad oval leaves adorned with alternating metallic silver and emerald bands, demonstrating dramatic circadian nyctinasty (prayer movements).',
  },
  {
    id: 'sansevieria-trifasciata',
    name: 'Snake Plant / Mother-in-Law Tongue',
    latinName: 'Dracaena trifasciata',
    category: 'Succulent',
    difficulty: 'Easy',
    light: 'Tolerates low light to full bright sunshine. Highly adaptable.',
    water: 'Extremely drought tolerant. Water only every 2–4 weeks when soil is completely bone dry.',
    humidity: 'Thrives in dry to average indoor humidity (30–50%).',
    petSafe: false,
    commonIssues: [
      'Root rot and mushy rhizomes from overwatering or stagnant drainage',
      'Wrinkled vertical blades during extreme chronic drought',
    ],
    bestSoil: 'Cactus/succulent blend with coarse pumice, perlite, and coarse sand.',
    propagation: 'Leaf cuttings or division of fleshy underground rhizomes.',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&auto=format&fit=crop&q=80',
    description: 'Virtually indestructible architectural plant noted for air-purifying properties and vertical sword-like variegated foliage.',
  },
  {
    id: 'epipremnum-aureum',
    name: 'Golden Pothos / Devil\'s Ivy',
    latinName: 'Epipremnum aureum',
    category: 'Tropical',
    difficulty: 'Easy',
    light: 'Low to bright indirect light. Variegation brightens in ample daylight.',
    water: 'Water when top 50% of potting medium dries out. Petioles droop slightly when thirsty.',
    humidity: 'Standard household humidity (40–60%). Very tolerant.',
    petSafe: false,
    commonIssues: [
      'Black stems from root hypoxia if sitting in drip tray reservoir',
      'Loss of gold marbling if placed in dark corners',
    ],
    bestSoil: 'Standard all-purpose houseplant potting soil with 20% perlite.',
    propagation: 'Fast-rooting single node cuttings submerged in clean water.',
    image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80',
    description: 'Cascading heart-leaved tropical vine known for exceptional air-filtering stamina and forgiving maintenance tolerances.',
  },
];
