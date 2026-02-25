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
  | 'HALLOWEEN'
  | 'MABUHAY'
  | 'LUNAR_NEW_YEAR'
  | 'HOLI'
  | 'EID'
  | 'DIWALI'
  | 'VALENTINES'
  | 'CHRISTMAS'
  | 'CANADA_DAY';

export interface ThemeConfig {
  id: ThemeKey;       // Unique ID
  label: string;      // The "Vibe Name" displayed in the corner
  lightColors: {
    bg: string;       // Main background
    text: string;     // Main text
    accent: string;   // Buttons/Links
    surface: string;  // Cards/Modals
  };
  darkColors: {
    bg: string;
    text: string;
    accent: string;
    surface: string;
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
    glow?: boolean;    // Add an icy glow to main title
  };
  animations?: {       // Optional theme-specific animations
    enabled: boolean;
    type?: 'shiver' | 'glare' | 'buzz' | 'sway' | 'pulse';
  };
}

export type Theme = ThemeConfig;

export const THEMES: Record<ThemeKey, ThemeConfig> = {

  'NORMAL': {
    id: 'NORMAL',
    label: "Winnipeg, MB",
    lightColors: { bg: '#F5F5F0', text: '#1A1A1A', accent: '#0055CC', surface: '#FFFFFF' },
    darkColors: { bg: '#1A1A1A', text: '#F5F5F0', accent: '#3388FF', surface: '#252525' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 100, blur: '0px', noise: 0.03, saturate: 100 }
  },

  'BUNKER': {
    id: 'BUNKER',
    label: "Shelter Mode",
    lightColors: { bg: '#2C2A29', text: '#F5F2EB', accent: '#FF5E00', surface: '#3A3837' },
    darkColors: { bg: '#050A0F', text: '#D0CAC2', accent: '#FF6B35', surface: '#0A121A' },
    physics: { viscosity: 2.2, cursor: 'default' },
    typography: { casual: 0, slant: 0, weight: 700 },
    effects: { contrast: 130, blur: '0.5px', noise: 0.15, saturate: 80, glow: true }
  },

  'SUN_DOG': {
    id: 'SUN_DOG',
    label: "Sundog Glare",
    lightColors: { bg: '#FFFFFF', text: '#002244', accent: '#006688', surface: '#F0FBFF' },
    darkColors: { bg: '#001122', text: '#E6F3FF', accent: '#22AADD', surface: '#001A33' },
    physics: { viscosity: 1.8, cursor: 'crosshair' },
    typography: { casual: 0, slant: 0, weight: 600 },
    effects: { contrast: 150, blur: '0px', noise: 0, saturate: 120 }
  },

  'SLUSH': {
    id: 'SLUSH',
    label: "Melt Phase",
    lightColors: { bg: '#C4C2BC', text: '#2A2926', accent: '#4A3520', surface: '#D6D4D0' },
    darkColors: { bg: '#1C1B19', text: '#B8B5AE', accent: '#846241', surface: '#2A2926' },
    physics: { viscosity: 1.4, cursor: 'progress' },
    typography: { casual: 0.2, slant: -2, weight: 500 },
    effects: { contrast: 90, blur: '1px', noise: 0.08, saturate: 60 }
  },

  'PRAIRIE_GOLD': {
    id: 'PRAIRIE_GOLD',
    label: "Golden Hour",
    lightColors: { bg: '#FFF8E1', text: '#3E2723', accent: '#C77800', surface: '#FFFFFF' },
    darkColors: { bg: '#241410', text: '#EFE8D1', accent: '#EAA43A', surface: '#36211B' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 1.0, slant: 0, weight: 400 },
    effects: { contrast: 100, blur: '0px', noise: 0.02, saturate: 110 }
  },

  'MOSQUITO_SWARM': {
    id: 'MOSQUITO_SWARM',
    label: "Humidex Warning",
    lightColors: { bg: '#E8F5E9', text: '#1B4D1F', accent: '#B71C1C', surface: '#FFFFFF' },
    darkColors: { bg: '#091A0D', text: '#C7DFC9', accent: '#E53935', surface: '#122E1A' },
    physics: { viscosity: 1.2, cursor: 'default' },
    typography: { casual: 0.8, slant: 2, weight: 500 },
    effects: { contrast: 100, blur: '2px', noise: 0.05, saturate: 130 }
  },

  'CONSTRUCTION': {
    id: 'CONSTRUCTION',
    label: "Detour Ahead",
    lightColors: { bg: '#FFF3E0', text: '#212121', accent: '#D84315', surface: '#FFFFFF' },
    darkColors: { bg: '#1A1A1A', text: '#EFE3D0', accent: '#FF7043', surface: '#2C2C2C' },
    physics: { viscosity: 1.0, cursor: 'help' },
    typography: { casual: 0, slant: 0, weight: 900 },
    effects: { contrast: 110, blur: '0px', noise: 0.1, saturate: 100 }
  },

  'VICTORY_LAP': {
    id: 'VICTORY_LAP',
    label: "WPG Victory",
    lightColors: { bg: '#F0F4F8', text: '#041E42', accent: '#C8102E', surface: '#FFFFFF' },
    darkColors: { bg: '#020D1A', text: '#E0E8F0', accent: '#EF3350', surface: '#0A1A2E' },
    physics: { viscosity: 0.8, cursor: 'default' },
    typography: { casual: 0.1, slant: -10, weight: 800 },
    effects: { contrast: 120, blur: '0px', noise: 0, saturate: 110 }
  },

  'NORTH_WIND': {
    id: 'NORTH_WIND',
    label: "Windchill -40",
    lightColors: { bg: '#E0F7FA', text: '#004D5A', accent: '#00838F', surface: '#FFFFFF' },
    darkColors: { bg: '#03080F', text: '#B8DBE0', accent: '#00BCD4', surface: '#0A1A22' },
    physics: { viscosity: 0.6, cursor: 'crosshair' },
    typography: { casual: 0, slant: -15, weight: 600 },
    effects: { contrast: 110, blur: '0.5px', noise: 0.05, saturate: 90, glow: true }
  },

  'SMOKE': {
    id: 'SMOKE',
    label: "Air Quality 10+",
    lightColors: { bg: '#D7CCC8', text: '#3E2723', accent: '#BF360C', surface: '#EFEBE9' },
    darkColors: { bg: '#291814', text: '#D7C4BF', accent: '#E64A19', surface: '#3E2A25' },
    physics: { viscosity: 1.1, cursor: 'not-allowed' },
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 80, blur: '3px', noise: 0.05, saturate: 120 }
  },

  'WHITE_OUT': {
    id: 'WHITE_OUT',
    label: "Zero Visibility",
    lightColors: { bg: '#FAFAFA', text: '#212121', accent: '#616161', surface: '#F5F5F5' },
    darkColors: { bg: '#050505', text: '#E0E0E0', accent: '#9E9E9E', surface: '#141414' },
    physics: { viscosity: 1.5, cursor: 'wait' },
    typography: { casual: 0, slant: 5, weight: 700 },
    effects: { contrast: 60, blur: '4px', noise: 0.4, saturate: 0, glow: true }
  },

  'FLOOD': {
    id: 'FLOOD',
    label: "Sandbag Duty",
    lightColors: { bg: '#D6CBC3', text: '#3E2B23', accent: '#7D5C4F', surface: '#EFEBE6' },
    darkColors: { bg: '#2D1F17', text: '#D6CBC3', accent: '#A88D82', surface: '#3D2F27' },
    physics: { viscosity: 3.0, cursor: 'move' },
    typography: { casual: 0.3, slant: -1, weight: 600 },
    effects: { contrast: 90, blur: '1px', noise: 0.1, saturate: 80 }
  },

  'DEEP_FREEZE': {
    id: 'DEEP_FREEZE',
    label: "Deep Freeze",
    lightColors: { bg: '#E3EDF2', text: '#15242C', accent: '#4FC3F7', surface: '#FFFFFF' },
    darkColors: { bg: '#02060A', text: '#C6DCE8', accent: '#29B6F6', surface: '#0A1822' },
    physics: { viscosity: 2.0, cursor: 'default' },
    typography: { casual: 0, slant: 0, weight: 700 },
    effects: { contrast: 120, blur: '0px', noise: 0.1, saturate: 80, glow: true }
  },

  'FALSE_SPRING': {
    id: 'FALSE_SPRING',
    label: "Fool's Spring",
    lightColors: { bg: '#FFFDE7', text: '#2E5717', accent: '#7CB342', surface: '#FFFFFF' },
    darkColors: { bg: '#142008', text: '#E5DFC0', accent: '#8BC34A', surface: '#1E300E' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 0.8, slant: 0, weight: 400 },
    effects: { contrast: 105, blur: '0px', noise: 0.02, saturate: 115 }
  },

  'NEUTRAL_RESPECTFUL': {
    id: 'NEUTRAL_RESPECTFUL',
    label: "Observance",
    lightColors: { bg: '#F5F5F5', text: '#111111', accent: '#424242', surface: '#FFFFFF' },
    darkColors: { bg: '#111111', text: '#EBEBEB', accent: '#A0A0A0', surface: '#222222' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 0, slant: 0, weight: 400 },
    effects: { contrast: 100, blur: '0px', noise: 0.0, saturate: 50 }
  },

  'COZY_SOMBER': {
    id: 'COZY_SOMBER',
    label: "Hygge Dark",
    lightColors: { bg: '#EFE7DF', text: '#3E2822', accent: '#B06E35', surface: '#FFFFFF' },
    darkColors: { bg: '#1B0E0A', text: '#E8D2BB', accent: '#CD853F', surface: '#2B1A15' },
    physics: { viscosity: 1.2, cursor: 'default' },
    typography: { casual: 1.0, slant: 0, weight: 500 },
    effects: { contrast: 90, blur: '0px', noise: 0.05, saturate: 90 }
  },

  'MANIC_PARTY': {
    id: 'MANIC_PARTY',
    label: "Social Override",
    lightColors: { bg: '#FFF0F5', text: '#000000', accent: '#C71585', surface: '#FFFFFF' },
    darkColors: { bg: '#110007', text: '#F4DEE7', accent: '#E82A9C', surface: '#22000E' },
    physics: { viscosity: 0.8, cursor: 'pointer' },
    typography: { casual: 1.0, slant: -5, weight: 700 },
    effects: { contrast: 110, blur: '0px', noise: 0.0, saturate: 150 }
  },

  'VICTORY_COLD': {
    id: 'VICTORY_COLD',
    label: "True North Strong",
    lightColors: { bg: '#EBF4FF', text: '#002C59', accent: '#267BE6', surface: '#FFFFFF' },
    darkColors: { bg: '#010A14', text: '#D8ECFF', accent: '#4A90D9', surface: '#001A38' },
    physics: { viscosity: 0.7, cursor: 'default' },
    typography: { casual: 0, slant: -15, weight: 800 },
    effects: { contrast: 130, blur: '0px', noise: 0.05, saturate: 100, glow: true }
  },

  'VICTORY_PATIO': {
    id: 'VICTORY_PATIO',
    label: "Whiteout Party",
    lightColors: { bg: '#E6F3FF', text: '#002244', accent: '#0055A5', surface: '#FFFFFF' },
    darkColors: { bg: '#00162B', text: '#D1E8FF', accent: '#1877D6', surface: '#00264A' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 0.5, slant: -5, weight: 600 },
    effects: { contrast: 110, blur: '0px', noise: 0.0, saturate: 120 }
  },

  'HYGGE_MODE': {
    id: 'HYGGE_MODE',
    label: "Cabin Vibe",
    lightColors: { bg: '#c5e4ed', text: '#1A2521', accent: '#28a3dc', surface: '#FFFFFF' },
    darkColors: { bg: '#101e37', text: '#F1E4D3', accent: '#225ae6', surface: '#12171E' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 1.0, slant: 0, weight: 400 },
    effects: { contrast: 95, blur: '0px', noise: 0.02, saturate: 100 }
  },

  'AUTUMN': {
    id: 'AUTUMN',
    label: "Harvest Season",
    lightColors: { bg: '#FFF3E0', text: '#3E2723', accent: '#D84315', surface: '#FFFFFF' },
    darkColors: { bg: '#26120E', text: '#EADACA', accent: '#EF663A', surface: '#3E1C13' },
    physics: { viscosity: 1.1, cursor: 'default' },
    typography: { casual: 0.6, slant: 0, weight: 500 },
    effects: { contrast: 100, blur: '0px', noise: 0.04, saturate: 110 }
  },

  'HALLOWEEN': {
    id: 'HALLOWEEN',
    label: "Spooky Szn",
    lightColors: { bg: '#FF6600', text: '#000000', accent: '#4A148C', surface: '#E65C00' },
    darkColors: { bg: '#0A0A0A', text: '#FF9800', accent: '#AB47BC', surface: '#1A1A1A' },
    physics: { viscosity: 1.3, cursor: 'help' },
    typography: { casual: 1.0, slant: -5, weight: 700 },
    effects: { contrast: 120, blur: '1px', noise: 0.15, saturate: 130 }
  },

  'MABUHAY': {
    id: 'MABUHAY',
    label: "Mabuhay",
    lightColors: { bg: '#0038A8', text: '#FFFFFF', accent: '#FCE100', surface: '#002570' },
    darkColors: { bg: '#001A4D', text: '#FCE100', accent: '#FF4D6A', surface: '#000D26' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 0.8, slant: 0, weight: 600 },
    effects: { contrast: 120, blur: '0px', noise: 0.05, saturate: 140 }
  },

  'LUNAR_NEW_YEAR': {
    id: 'LUNAR_NEW_YEAR',
    label: "Lunar Year",
    lightColors: { bg: '#B71C1C', text: '#FFEB3B', accent: '#FFE082', surface: '#880E4F' },
    darkColors: { bg: '#600000', text: '#FFD700', accent: '#FF8F00', surface: '#3E0000' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 0.7, slant: 0, weight: 700 },
    effects: { contrast: 130, blur: '0px', noise: 0.02, saturate: 150 }
  },

  'HOLI': {
    id: 'HOLI',
    label: "Festival of Colors",
    lightColors: { bg: '#C2185B', text: '#FFFFFF', accent: '#00E5FF', surface: '#AD1457' },
    darkColors: { bg: '#311B92', text: '#00E5FF', accent: '#FF4081', surface: '#1A0F4D' },
    physics: { viscosity: 0.8, cursor: 'pointer' },
    typography: { casual: 1.0, slant: -5, weight: 600 },
    effects: { contrast: 140, blur: '0px', noise: 0.1, saturate: 200 }
  },

  'EID': {
    id: 'EID',
    label: "Eid Mubarak",
    lightColors: { bg: '#00695C', text: '#FFFFFF', accent: '#FFCA28', surface: '#004D40' },
    darkColors: { bg: '#00332B', text: '#A5D6A7', accent: '#FFE082', surface: '#001A15' },
    physics: { viscosity: 1.0, cursor: 'default' },
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 110, blur: '0px', noise: 0.02, saturate: 130 }
  },

  'DIWALI': {
    id: 'DIWALI',
    label: "Festival of Lights",
    lightColors: { bg: '#E65100', text: '#FFF8E1', accent: '#FFEB3B', surface: '#BF360C' },
    darkColors: { bg: '#3E1C00', text: '#FFE0B2', accent: '#FFD54F', surface: '#1A0A00' },
    physics: { viscosity: 1.1, cursor: 'default' },
    typography: { casual: 0.8, slant: 0, weight: 600 },
    effects: { contrast: 120, blur: '0px', noise: 0.05, saturate: 140 }
  },

  'VALENTINES': {
    id: 'VALENTINES',
    label: "Valentine's",
    lightColors: { bg: '#C2185B', text: '#FFFFFF', accent: '#FFCDD2', surface: '#A0144F' },
    darkColors: { bg: '#4A0024', text: '#F48FB1', accent: '#FF4081', surface: '#2E0016' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 0.8, slant: 0, weight: 500 },
    effects: { contrast: 110, blur: '0px', noise: 0.02, saturate: 130 }
  },

  'CHRISTMAS': {
    id: 'CHRISTMAS',
    label: "Festive Season",
    lightColors: { bg: '#1B5E20', text: '#FFFFFF', accent: '#FF8A80', surface: '#144517' },
    darkColors: { bg: '#0B260D', text: '#C8E6C9', accent: '#F44336', surface: '#051206' },
    physics: { viscosity: 1.1, cursor: 'default' },
    typography: { casual: 0.4, slant: 0, weight: 600 },
    effects: { contrast: 110, blur: '0px', noise: 0.05, saturate: 120 }
  },

  'CANADA_DAY': {
    id: 'CANADA_DAY',
    label: "Canada Day",
    lightColors: { bg: '#C8102E', text: '#FFFFFF', accent: '#FFEBEE', surface: '#9E0C24' },
    darkColors: { bg: '#6B0818', text: '#FFEBEE', accent: '#FF5252', surface: '#38040C' },
    physics: { viscosity: 0.9, cursor: 'default' },
    typography: { casual: 0.5, slant: 0, weight: 700 },
    effects: { contrast: 115, blur: '0px', noise: 0, saturate: 130 }
  },
};
