
export type ThemeKey =
  | 'NORMAL'
  | 'BUNKER'
  | 'SUN_DOG'
  | 'DEEP_FREEZE'
  | 'SLUSH'
  | 'FALSE_SPRING'
  | 'PRAIRIE_GOLD'
  | 'MOSQUITO_SWARM'
  | 'CONSTRUCTION'
  | 'VICTORY_LAP'
  | 'NORTH_WIND'
  | 'SMOKE'
  | 'WHITE_OUT'
  | 'FLOOD'
  // --- Ported from Lite Themes ---
  | 'NEUTRAL_RESPECTFUL'
  | 'COZY_SOMBER'
  | 'MANIC_PARTY'
  | 'VICTORY_COLD'
  | 'VICTORY_PATIO'
  | 'HYGGE_MODE';

export interface ThemeConfig {
  id: ThemeKey;       // Unique ID
  label: string;      // The "Vibe Name" displayed in the corner
  colors: {
    bg: string;       // Main background
    text: string;     // Main text
    accent: string;   // Buttons/Links
    surface: string;  // Cards/Modals
  };
  physics: {
    viscosity: number; // 0.8 (Fast) to 2.5 (Sludge)
    cursor: string;    // 'default', 'wait', 'crosshair', etc.
  };
  typography: {
    casual: number;    // Recursive CASL axis (0=Stiff, 1=Loose)
    slant: number;     // Wind lean (0 to -15)
    weight: number;    // Base weight modifier
  };
  effects: {
    contrast: number;  // 100% is normal
    blur: string;      // '0px' or '2px' (Humidity)
    noise: number;     // Opacity of grain overlay (0 to 1)
    saturate: number;  // 100% is normal
  };
}

export type Theme = ThemeConfig;

export const THEMES: Record<ThemeKey, ThemeConfig> = {

  // --- 1. THE DEFAULT (Baseline) ---
  'NORMAL': {
    id: 'NORMAL',
    label: "Winnipeg, MB",
    colors: { bg: '#F5F5F0', text: '#1A1A1A', accent: '#0055FF', surface: '#FFFFFF' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 100, blur: '0px', noise: 0.03, saturate: 100 }
  },

  // --- 2. THE BUNKER (High Anxiety / Extreme Cold) ---
  // Merged with BUNKER_STORM
  'BUNKER': {
    id: 'BUNKER',
    label: "Shelter Mode",
    colors: {
      bg: '#0F0E0E',       // Obsidian
      text: '#E0DACC',     // Warm Bone
      accent: '#FF4400',   // Emergency Orange (dimmed)
      surface: '#1C1B1B'   // Dark Grey
    },
    physics: { viscosity: 2.2, cursor: 'default' }, // Very slow interactions
    typography: { casual: 0, slant: 0, weight: 700 }, // Stiff, heavy fonts
    effects: { contrast: 130, blur: '0.5px', noise: 0.15, saturate: 80 } // High grain, gritty
  },

  // --- 3. SUN DOG (The Beautiful Lie) ---
  // Merged with SUN_DOG_GLARE
  'SUN_DOG': {
    id: 'SUN_DOG',
    label: "Sundog Glare",
    colors: {
      bg: '#FFFFFF',
      text: '#002244',     // Deep Blue text (high contrast needed against glare)
      accent: '#00AACC',   // Cyan Ice
      surface: '#F0FBFF'   // Very pale blue
    },
    physics: { viscosity: 1.8, cursor: 'crosshair' }, // Sharp, brittle feel
    typography: { casual: 0, slant: 0, weight: 600 },
    effects: { contrast: 150, blur: '0px', noise: 0, saturate: 120 } // Sharp, blown-out highlights
  },

  // --- 4. SLUSH REALITY (The "Dirty Spring") ---
  'SLUSH': {
    id: 'SLUSH',
    label: "Melt Phase",
    colors: {
      bg: '#C4C2BC',       // Wet Concrete
      text: '#2A2926',     // Muddy Charcoal
      accent: '#5C4830',   // Leather Boot Brown
      surface: '#D6D4D0'
    },
    physics: { viscosity: 1.4, cursor: 'progress' }, // Draggy
    typography: { casual: 0.2, slant: -2, weight: 500 }, // Slightly messy
    effects: { contrast: 90, blur: '1px', noise: 0.08, saturate: 60 } // Muted, damp feel
  },

  // --- 5. PRAIRIE GOLD (Perfect Summer) ---
  'PRAIRIE_GOLD': {
    id: 'PRAIRIE_GOLD',
    label: "Golden Hour",
    colors: {
      bg: '#FFF8E1',       // Warm Wheat
      text: '#3E2723',     // Coffee
      accent: '#FFB300',   // Canola Gold
      surface: '#FFFFFF'
    },
    physics: { viscosity: 0.9, cursor: 'default' }, // Fluid, easy
    typography: { casual: 1.0, slant: 0, weight: 400 }, // Relaxed, curvy fonts
    effects: { contrast: 100, blur: '0px', noise: 0.02, saturate: 110 } // Warm, rich
  },

  // --- 6. MOSQUITO SWARM (High Humidity + Heat) ---
  // Merged with SWAMP_HUMIDITY
  'MOSQUITO_SWARM': {
    id: 'MOSQUITO_SWARM',
    label: "Humidex Warning",
    colors: {
      bg: '#E8F5E9',       // Swamp Green tint
      text: '#1B5E20',     // Dark Forest
      accent: '#D50000',   // Blood Red (Subtle nod)
      surface: '#FFFFFF'
    },
    physics: { viscosity: 1.2, cursor: 'default' }, // Sticky air
    typography: { casual: 0.8, slant: 2, weight: 500 }, // Jittery?
    effects: { contrast: 100, blur: '2px', noise: 0.05, saturate: 130 } // Hazy, sweaty blur
  },

  // --- 7. CONSTRUCTION SEASON (The "Other" Season) ---
  'CONSTRUCTION': {
    id: 'CONSTRUCTION',
    label: "Detour Ahead",
    colors: {
      bg: '#FFF3E0',       // Dust
      text: '#212121',     // Asphalt
      accent: '#FF6F00',   // Pylon Orange
      surface: '#FFFFFF'
    },
    physics: { viscosity: 1.0, cursor: 'help' }, // Confused cursor?
    typography: { casual: 0, slant: 0, weight: 900 }, // Heavy "Warning" type
    effects: { contrast: 110, blur: '0px', noise: 0.1, saturate: 100 } // Dusty grain
  },

  // --- 8. VICTORY LAP (Jets Win - Generic) ---
  'VICTORY_LAP': {
    id: 'VICTORY_LAP',
    label: "WPG Victory",
    colors: {
      bg: '#F0F4F8',       // Ice White
      text: '#041E42',     // Jets Blue
      accent: '#C8102E',   // Jets Red
      surface: '#FFFFFF'
    },
    physics: { viscosity: 0.8, cursor: 'default' }, // Fast, exciting
    typography: { casual: 0.1, slant: -10, weight: 800 }, // Fast, leaning forward
    effects: { contrast: 120, blur: '0px', noise: 0, saturate: 110 } // Crisp TV signal
  },

  // --- 9. NORTH WIND (Arctic Blast) ---
  // Merged with ICE_SHELL
  'NORTH_WIND': {
    id: 'NORTH_WIND',
    label: "Windchill -40",
    colors: {
      bg: '#E0F7FA',       // Icy Blue
      text: '#006064',     // Deep Cyan
      accent: '#00BCD4',   // Cyan
      surface: '#FFFFFF'
    },
    physics: { viscosity: 0.6, cursor: 'crosshair' }, // Very fast, piercing
    typography: { casual: 0, slant: -15, weight: 600 }, // Extreme wind lean
    effects: { contrast: 110, blur: '0.5px', noise: 0.05, saturate: 90 } // Cold clarity
  },

  // --- 10. SMOKE (Forest Fires) ---
  // Merged with HAZE_DYSTOPIA
  'SMOKE': {
    id: 'SMOKE',
    label: "Air Quality 10+",
    colors: {
      bg: '#D7CCC8',       // Hazy Grey/Brown
      text: '#3E2723',     // Dark Brown
      accent: '#FF5722',   // Dim Orange Sun
      surface: '#EFEBE9'
    },
    physics: { viscosity: 1.1, cursor: 'not-allowed' }, // Choking
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 80, blur: '3px', noise: 0.05, saturate: 120 } // Hazy, diffuse
  },

  // --- 11. WHITE OUT (Blizzard) ---
  'WHITE_OUT': {
    id: 'WHITE_OUT',
    label: "Zero Visibility",
    colors: {
      bg: '#FAFAFA',       // White
      text: '#212121',     // Black (Contrast needed)
      accent: '#9E9E9E',   // Grey
      surface: '#F5F5F5'
    },
    physics: { viscosity: 1.5, cursor: 'wait' }, // Struggling to move
    typography: { casual: 0, slant: 5, weight: 700 }, // Buffeting
    effects: { contrast: 60, blur: '4px', noise: 0.4, saturate: 0 } // Can't see anything
  },

  // --- 12. FLOOD (Spring Rising) ---
  'FLOOD': {
    id: 'FLOOD',
    label: "Sandbag Duty",
    colors: {
      bg: '#8D6E63',       // Mud
      text: '#EFEBE9',     // Light Sand
      accent: '#795548',   // Darker Mud
      surface: '#A1887F'
    },
    physics: { viscosity: 3.0, cursor: 'move' }, // Trudging through water
    typography: { casual: 0.3, slant: -1, weight: 600 },
    effects: { contrast: 90, blur: '1px', noise: 0.1, saturate: 80 } // Murky
  },

  // --- Fallbacks / Specifics Ported from Lite ---

  'DEEP_FREEZE': {
      id: 'DEEP_FREEZE',
      label: "Deep Freeze",
      colors: { bg: '#263238', text: '#ECEFF1', accent: '#0288D1', surface: '#37474F' },
      physics: { viscosity: 2.0, cursor: 'default' },
      typography: { casual: 0, slant: 0, weight: 700 },
      effects: { contrast: 120, blur: '0px', noise: 0.1, saturate: 80 }
  },
  'FALSE_SPRING': {
      id: 'FALSE_SPRING',
      label: "Fool's Spring",
      colors: { bg: '#FFFDE7', text: '#33691E', accent: '#C6FF00', surface: '#FFFFFF' },
      physics: { viscosity: 0.9, cursor: 'default' },
      typography: { casual: 0.8, slant: 0, weight: 400 },
      effects: { contrast: 105, blur: '0px', noise: 0.02, saturate: 115 }
  },

  // --- NEW PORTED THEMES ---
  'NEUTRAL_RESPECTFUL': {
    id: 'NEUTRAL_RESPECTFUL',
    label: "Observance",
    colors: { bg: '#F5F5F5', text: '#111111', accent: '#555555', surface: '#FFFFFF' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 0, slant: 0, weight: 400 }, // Somber, straight
    effects: { contrast: 100, blur: '0px', noise: 0.0, saturate: 50 } // Desaturated
  },
  'COZY_SOMBER': {
    id: 'COZY_SOMBER',
    label: "Hygge Dark",
    colors: { bg: '#2B1B17', text: '#D2B48C', accent: '#8B4513', surface: '#3E2723' },
    physics: { viscosity: 1.2, cursor: 'default' },
    typography: { casual: 1.0, slant: 0, weight: 500 }, // Warm, soft
    effects: { contrast: 90, blur: '0px', noise: 0.05, saturate: 90 }
  },
  'MANIC_PARTY': {
    id: 'MANIC_PARTY',
    label: "Social Override",
    colors: { bg: '#FFF0F5', text: '#000000', accent: '#FF00FF', surface: '#FFFFFF' },
    physics: { viscosity: 0.8, cursor: 'pointer' },
    typography: { casual: 1.0, slant: -5, weight: 700 },
    effects: { contrast: 110, blur: '0px', noise: 0.0, saturate: 150 }
  },
  'VICTORY_COLD': {
    id: 'VICTORY_COLD',
    label: "True North Strong",
    colors: { bg: '#001F3F', text: '#FFFFFF', accent: '#004C97', surface: '#003366' },
    physics: { viscosity: 0.7, cursor: 'default' },
    typography: { casual: 0, slant: -15, weight: 800 },
    effects: { contrast: 130, blur: '0px', noise: 0.05, saturate: 100 }
  },
  'VICTORY_PATIO': {
    id: 'VICTORY_PATIO',
    label: "Whiteout Party",
    colors: { bg: '#E6F3FF', text: '#002244', accent: '#004C97', surface: '#FFFFFF' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 0.5, slant: -5, weight: 600 },
    effects: { contrast: 110, blur: '0px', noise: 0.0, saturate: 120 }
  },
  'HYGGE_MODE': {
    id: 'HYGGE_MODE',
    label: "Cabin Vibe",
    colors: { bg: '#FAF0E6', text: '#4A3B32', accent: '#DEB887', surface: '#FFFFFF' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 1.0, slant: 0, weight: 400 },
    effects: { contrast: 95, blur: '0px', noise: 0.02, saturate: 100 }
  },
};
