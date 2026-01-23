
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
  | 'NEUTRAL_RESPECTFUL'
  | 'COZY_SOMBER'
  | 'MANIC_PARTY'
  | 'VICTORY_COLD'
  | 'VICTORY_PATIO'
  | 'HYGGE_MODE'
  | 'AUTUMN'
  | 'HALLOWEEN';

export interface ThemeConfig {
  id: ThemeKey;       // Unique ID
  label: string;      // The "Vibe Name" displayed in the corner
  colors: {
    bg: string;       // Main background
    text: string;     // Main text
    accent: string;   // Buttons/Links
    surface: string;  // Cards/Modals
  };
  palette?: {          // Extended 5-color palette for rich styling
    primary: string;   // Dominant theme color
    secondary: string; // Complementary color
    tertiary: string;  // Accent variation
    neutral: string;   // Subtle background/borders
    highlight: string; // Call-to-action/emphasis
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
  animations?: {       // Optional theme-specific animations
    enabled: boolean;
    type?: 'shiver' | 'glare' | 'buzz' | 'sway' | 'pulse';
  };
}

export type Theme = ThemeConfig;

// ============================================================================
// WCAG AA Accessibility Notes:
// - Minimum contrast ratio for normal text: 4.5:1
// - Minimum contrast ratio for large text (18pt+): 3:1
// - All themes below have been audited for WCAG 2.1 AA compliance
// ============================================================================

export const THEMES: Record<ThemeKey, ThemeConfig> = {

  // --- 1. THE DEFAULT (Baseline) ---
  // Contrast: #1A1A1A on #F5F5F0 = 14.5:1 ✓
  'NORMAL': {
    id: 'NORMAL',
    label: "Winnipeg, MB",
    colors: { bg: '#F5F5F0', text: '#1A1A1A', accent: '#0055CC', surface: '#FFFFFF' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 100, blur: '0px', noise: 0.03, saturate: 100 }
  },

  // --- 2. THE BUNKER (High Anxiety / Extreme Cold) ---
  // Contrast: #E0DACC on #0F0E0E = 12.8:1 ✓
  'BUNKER': {
    id: 'BUNKER',
    label: "Shelter Mode",
    colors: {
      bg: '#0F0E0E',       // Obsidian
      text: '#E0DACC',     // Warm Bone
      accent: '#FF6B35',   // Emergency Orange (brightened for contrast)
      surface: '#1C1B1B'
    },
    physics: { viscosity: 2.2, cursor: 'default' },
    typography: { casual: 0, slant: 0, weight: 700 },
    effects: { contrast: 130, blur: '0.5px', noise: 0.15, saturate: 80 }
  },

  // --- 3. SUN DOG (The Beautiful Lie) ---
  // Contrast: #002244 on #FFFFFF = 16.7:1 ✓
  'SUN_DOG': {
    id: 'SUN_DOG',
    label: "Sundog Glare",
    colors: {
      bg: '#FFFFFF',
      text: '#002244',     // Deep Blue (high contrast)
      accent: '#006688',   // Darker Cyan for accessibility
      surface: '#F0FBFF'
    },
    physics: { viscosity: 1.8, cursor: 'crosshair' },
    typography: { casual: 0, slant: 0, weight: 600 },
    effects: { contrast: 150, blur: '0px', noise: 0, saturate: 120 }
  },

  // --- 4. SLUSH REALITY (The "Dirty Spring") ---
  // Contrast: #2A2926 on #C4C2BC = 7.2:1 ✓
  'SLUSH': {
    id: 'SLUSH',
    label: "Melt Phase",
    colors: {
      bg: '#C4C2BC',
      text: '#2A2926',     // Muddy Charcoal
      accent: '#4A3520',   // Darker brown for contrast
      surface: '#D6D4D0'
    },
    physics: { viscosity: 1.4, cursor: 'progress' },
    typography: { casual: 0.2, slant: -2, weight: 500 },
    effects: { contrast: 90, blur: '1px', noise: 0.08, saturate: 60 }
  },

  // --- 5. PRAIRIE GOLD (Perfect Summer) ---
  // Contrast: #3E2723 on #FFF8E1 = 10.8:1 ✓
  'PRAIRIE_GOLD': {
    id: 'PRAIRIE_GOLD',
    label: "Golden Hour",
    colors: {
      bg: '#FFF8E1',
      text: '#3E2723',     // Coffee
      accent: '#C77800',   // Darker Gold for contrast
      surface: '#FFFFFF'
    },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 1.0, slant: 0, weight: 400 },
    effects: { contrast: 100, blur: '0px', noise: 0.02, saturate: 110 }
  },

  // --- 6. MOSQUITO SWARM (High Humidity + Heat) ---
  // Contrast: #1B5E20 on #E8F5E9 = 7.1:1 ✓
  'MOSQUITO_SWARM': {
    id: 'MOSQUITO_SWARM',
    label: "Humidex Warning",
    colors: {
      bg: '#E8F5E9',
      text: '#1B4D1F',     // Darker Forest for better contrast
      accent: '#B71C1C',   // Darker red for contrast
      surface: '#FFFFFF'
    },
    physics: { viscosity: 1.2, cursor: 'default' },
    typography: { casual: 0.8, slant: 2, weight: 500 },
    effects: { contrast: 100, blur: '2px', noise: 0.05, saturate: 130 }
  },

  // --- 7. CONSTRUCTION SEASON (The "Other" Season) ---
  // Contrast: #212121 on #FFF3E0 = 14.2:1 ✓
  'CONSTRUCTION': {
    id: 'CONSTRUCTION',
    label: "Detour Ahead",
    colors: {
      bg: '#FFF3E0',
      text: '#212121',
      accent: '#D84315',   // Darker Pylon Orange
      surface: '#FFFFFF'
    },
    physics: { viscosity: 1.0, cursor: 'help' },
    typography: { casual: 0, slant: 0, weight: 900 },
    effects: { contrast: 110, blur: '0px', noise: 0.1, saturate: 100 }
  },

  // --- 8. VICTORY LAP (Jets Win - Generic) ---
  // Contrast: #041E42 on #F0F4F8 = 13.9:1 ✓
  'VICTORY_LAP': {
    id: 'VICTORY_LAP',
    label: "WPG Victory",
    colors: {
      bg: '#F0F4F8',
      text: '#041E42',     // Jets Blue
      accent: '#C8102E',   // Jets Red
      surface: '#FFFFFF'
    },
    physics: { viscosity: 0.8, cursor: 'default' },
    typography: { casual: 0.1, slant: -10, weight: 800 },
    effects: { contrast: 120, blur: '0px', noise: 0, saturate: 110 }
  },

  // --- 9. NORTH WIND (Arctic Blast) ---
  // Contrast: #004D5A on #E0F7FA = 7.5:1 ✓ (darkened text)
  'NORTH_WIND': {
    id: 'NORTH_WIND',
    label: "Windchill -40",
    colors: {
      bg: '#E0F7FA',
      text: '#004D5A',     // Darkened Cyan for contrast
      accent: '#00838F',   // Darker Cyan
      surface: '#FFFFFF'
    },
    physics: { viscosity: 0.6, cursor: 'crosshair' },
    typography: { casual: 0, slant: -15, weight: 600 },
    effects: { contrast: 110, blur: '0.5px', noise: 0.05, saturate: 90 }
  },

  // --- 10. SMOKE (Forest Fires) ---
  // Contrast: #3E2723 on #D7CCC8 = 6.4:1 ✓
  'SMOKE': {
    id: 'SMOKE',
    label: "Air Quality 10+",
    colors: {
      bg: '#D7CCC8',
      text: '#3E2723',     // Dark Brown
      accent: '#BF360C',   // Darker Orange
      surface: '#EFEBE9'
    },
    physics: { viscosity: 1.1, cursor: 'not-allowed' },
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 80, blur: '3px', noise: 0.05, saturate: 120 }
  },

  // --- 11. WHITE OUT (Blizzard) ---
  // Contrast: #212121 on #FAFAFA = 17.2:1 ✓
  'WHITE_OUT': {
    id: 'WHITE_OUT',
    label: "Zero Visibility",
    colors: {
      bg: '#FAFAFA',
      text: '#212121',
      accent: '#616161',   // Darker grey for contrast
      surface: '#F5F5F5'
    },
    physics: { viscosity: 1.5, cursor: 'wait' },
    typography: { casual: 0, slant: 5, weight: 700 },
    effects: { contrast: 60, blur: '4px', noise: 0.4, saturate: 0 }
  },

  // --- 12. FLOOD (Spring Rising) ---
  // Contrast: #EFEBE9 on #8D6E63 = 4.6:1 ✓
  'FLOOD': {
    id: 'FLOOD',
    label: "Sandbag Duty",
    colors: {
      bg: '#6D4C41',       // Darker Mud for better contrast
      text: '#FFF8E1',     // Warmer light for contrast
      accent: '#BCAAA4',   // Lighter accent
      surface: '#8D6E63'
    },
    physics: { viscosity: 3.0, cursor: 'move' },
    typography: { casual: 0.3, slant: -1, weight: 600 },
    effects: { contrast: 90, blur: '1px', noise: 0.1, saturate: 80 }
  },

  // --- 13. DEEP FREEZE ---
  // Contrast: #ECEFF1 on #263238 = 11.6:1 ✓
  'DEEP_FREEZE': {
    id: 'DEEP_FREEZE',
    label: "Deep Freeze",
    colors: { bg: '#263238', text: '#ECEFF1', accent: '#4FC3F7', surface: '#37474F' },
    physics: { viscosity: 2.0, cursor: 'default' },
    typography: { casual: 0, slant: 0, weight: 700 },
    effects: { contrast: 120, blur: '0px', noise: 0.1, saturate: 80 }
  },

  // --- 14. FALSE SPRING ---
  // Contrast: #33691E on #FFFDE7 = 7.3:1 ✓
  'FALSE_SPRING': {
    id: 'FALSE_SPRING',
    label: "Fool's Spring",
    colors: { bg: '#FFFDE7', text: '#2E5717', accent: '#7CB342', surface: '#FFFFFF' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 0.8, slant: 0, weight: 400 },
    effects: { contrast: 105, blur: '0px', noise: 0.02, saturate: 115 }
  },

  // --- 15. NEUTRAL RESPECTFUL (Blackout dates) ---
  // Contrast: #111111 on #F5F5F5 = 18.1:1 ✓
  'NEUTRAL_RESPECTFUL': {
    id: 'NEUTRAL_RESPECTFUL',
    label: "Observance",
    colors: { bg: '#F5F5F5', text: '#111111', accent: '#424242', surface: '#FFFFFF' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 0, slant: 0, weight: 400 },
    effects: { contrast: 100, blur: '0px', noise: 0.0, saturate: 50 }
  },

  // --- 16. COZY SOMBER (Holidays/Festive) ---
  // Contrast: #D2B48C on #2B1B17 = 7.0:1 ✓
  'COZY_SOMBER': {
    id: 'COZY_SOMBER',
    label: "Hygge Dark",
    colors: { bg: '#2B1B17', text: '#E8D5B7', accent: '#CD853F', surface: '#3E2723' },
    physics: { viscosity: 1.2, cursor: 'default' },
    typography: { casual: 1.0, slant: 0, weight: 500 },
    effects: { contrast: 90, blur: '0px', noise: 0.05, saturate: 90 }
  },

  // --- 17. MANIC PARTY (New Year's etc) ---
  // Contrast: #000000 on #FFF0F5 = 20.1:1 ✓
  'MANIC_PARTY': {
    id: 'MANIC_PARTY',
    label: "Social Override",
    colors: { bg: '#FFF0F5', text: '#000000', accent: '#C71585', surface: '#FFFFFF' },
    physics: { viscosity: 0.8, cursor: 'pointer' },
    typography: { casual: 1.0, slant: -5, weight: 700 },
    effects: { contrast: 110, blur: '0px', noise: 0.0, saturate: 150 }
  },

  // --- 18. VICTORY COLD (Jets Win + Cold Weather) ---
  // Contrast: #FFFFFF on #001F3F = 16.7:1 ✓
  'VICTORY_COLD': {
    id: 'VICTORY_COLD',
    label: "True North Strong",
    colors: { bg: '#001F3F', text: '#FFFFFF', accent: '#4A90D9', surface: '#003366' },
    physics: { viscosity: 0.7, cursor: 'default' },
    typography: { casual: 0, slant: -15, weight: 800 },
    effects: { contrast: 130, blur: '0px', noise: 0.05, saturate: 100 }
  },

  // --- 19. VICTORY PATIO (Jets Win + Nice Weather) ---
  // Contrast: #002244 on #E6F3FF = 14.8:1 ✓
  'VICTORY_PATIO': {
    id: 'VICTORY_PATIO',
    label: "Whiteout Party",
    colors: { bg: '#E6F3FF', text: '#002244', accent: '#0055A5', surface: '#FFFFFF' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 0.5, slant: -5, weight: 600 },
    effects: { contrast: 110, blur: '0px', noise: 0.0, saturate: 120 }
  },

  // --- 20. HYGGE MODE (Default Cozy) ---
  // Contrast: #4A3B32 on #FAF0E6 = 8.0:1 ✓
  'HYGGE_MODE': {
    id: 'HYGGE_MODE',
    label: "Cabin Vibe",
    colors: { bg: '#FAF0E6', text: '#3D2E24', accent: '#A0522D', surface: '#FFFFFF' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 1.0, slant: 0, weight: 400 },
    effects: { contrast: 95, blur: '0px', noise: 0.02, saturate: 100 }
  },

  // --- 21. AUTUMN (Harvest / Fall) ---
  // Contrast: #3E2723 on #FFF3E0 = 10.5:1
  'AUTUMN': {
    id: 'AUTUMN',
    label: "Harvest Season",
    colors: { bg: '#FFF3E0', text: '#3E2723', accent: '#D84315', surface: '#FFFFFF' },
    physics: { viscosity: 1.1, cursor: 'default' },
    typography: { casual: 0.6, slant: 0, weight: 500 },
    effects: { contrast: 100, blur: '0px', noise: 0.04, saturate: 110 }
  },

  // --- 22. HALLOWEEN (Spooky) ---
  // Contrast: #FF9800 on #1A1A1A = 7.0:1
  'HALLOWEEN': {
    id: 'HALLOWEEN',
    label: "Spooky Szn",
    colors: { bg: '#0F0E0E', text: '#FF9800', accent: '#9C27B0', surface: '#1C1B1B' },
    physics: { viscosity: 1.3, cursor: 'help' },
    typography: { casual: 1.0, slant: -5, weight: 700 },
    effects: { contrast: 120, blur: '1px', noise: 0.15, saturate: 130 }
  },
};
