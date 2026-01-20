export interface Theme {
    id: string;
    mode: 'light' | 'dark';
    palette: {
        primary: string;
        background: string;
        text: string;
    };
    visuals: {
        contrast: number; // 0 to 1
        blur: string; // CSS value
    };
}

export const THEMES: Record<string, Theme> = {
    BUNKER_STORM: {
        id: 'BUNKER_STORM',
        mode: 'dark',
        palette: { primary: '#4A4A4A', background: '#1A1A1A', text: '#E0E0E0' },
        visuals: { contrast: 0.8, blur: '2px' }
    },
    HAZE_DYSTOPIA: {
        id: 'HAZE_DYSTOPIA',
        mode: 'dark',
        palette: { primary: '#D4A017', background: '#2C241B', text: '#F5E6CC' },
        visuals: { contrast: 0.6, blur: '4px' }
    },
    ICE_SHELL: {
        id: 'ICE_SHELL',
        mode: 'light',
        palette: { primary: '#A5F2F3', background: '#F0FFFF', text: '#003366' },
        visuals: { contrast: 0.9, blur: '1px' }
    },
    NEUTRAL_RESPECTFUL: {
        id: 'NEUTRAL_RESPECTFUL',
        mode: 'light',
        palette: { primary: '#555555', background: '#F5F5F5', text: '#111111' },
        visuals: { contrast: 0.5, blur: '0px' }
    },
    COZY_SOMBER: {
        id: 'COZY_SOMBER',
        mode: 'dark',
        palette: { primary: '#8B4513', background: '#2B1B17', text: '#D2B48C' },
        visuals: { contrast: 0.7, blur: '0px' }
    },
    MANIC_PARTY: {
        id: 'MANIC_PARTY',
        mode: 'light',
        palette: { primary: '#FF00FF', background: '#FFF0F5', text: '#000000' },
        visuals: { contrast: 1.0, blur: '0px' }
    },
    SUN_DOG_GLARE: {
        id: 'SUN_DOG_GLARE',
        mode: 'light',
        palette: { primary: '#FFFFFF', background: '#FFFFFF', text: '#000000' },
        visuals: { contrast: 1.0, blur: '5px' }
    },
    SWAMP_HUMIDITY: {
        id: 'SWAMP_HUMIDITY',
        mode: 'light',
        palette: { primary: '#2E8B57', background: '#F0FFF0', text: '#006400' },
        visuals: { contrast: 0.6, blur: '3px' }
    },
    VICTORY_COLD: {
        id: 'VICTORY_COLD',
        mode: 'dark',
        palette: { primary: '#004C97', background: '#001F3F', text: '#FFFFFF' }, // Jets Blue
        visuals: { contrast: 0.9, blur: '0px' }
    },
    VICTORY_PATIO: {
        id: 'VICTORY_PATIO',
        mode: 'light',
        palette: { primary: '#004C97', background: '#E6F3FF', text: '#002244' },
        visuals: { contrast: 0.9, blur: '0px' }
    },
    FALSE_SPRING: {
        id: 'FALSE_SPRING',
        mode: 'light',
        palette: { primary: '#FF69B4', background: '#FFF0F5', text: '#333333' },
        visuals: { contrast: 0.8, blur: '0px' }
    },
    DEEP_FREEZE_GRIND: {
        id: 'DEEP_FREEZE_GRIND',
        mode: 'dark',
        palette: { primary: '#708090', background: '#2F4F4F', text: '#E0FFFF' },
        visuals: { contrast: 0.9, blur: '0px' }
    },
    PRAIRIE_GOLD: {
        id: 'PRAIRIE_GOLD',
        mode: 'light',
        palette: { primary: '#FFD700', background: '#FFFACD', text: '#5D4037' },
        visuals: { contrast: 0.8, blur: '0px' }
    },
    HYGGE_MODE: {
        id: 'HYGGE_MODE',
        mode: 'light',
        palette: { primary: '#DEB887', background: '#FAF0E6', text: '#4A3B32' },
        visuals: { contrast: 0.7, blur: '0px' }
    }
};
