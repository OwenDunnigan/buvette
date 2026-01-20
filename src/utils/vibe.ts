import type { ThemeKey } from '../themes';

interface VibeState {
    theme: ThemeKey;
    windSpeed: number;
}

export function deriveTheme(): VibeState {
    const now = new Date();
    const month = now.getMonth(); // 0 = Jan, 11 = Dec

    // Default Wind Speed (randomized)
    let windSpeed = Math.floor(Math.random() * 60); // 0 to 60 km/h

    // 1. Determine Season
    let possibleThemes: ThemeKey[] = ['NORMAL'];

    if (month >= 10 || month <= 2) {
        // WINTER (Nov, Dec, Jan, Feb, Mar)
        possibleThemes = ['BUNKER', 'DEEP_FREEZE', 'SUN_DOG', 'NORTH_WIND', 'WHITE_OUT'];
        windSpeed += 20; // It's windier in winter
    } else if (month === 3 || month === 4) {
        // SPRING / THAW (Apr, May)
        possibleThemes = ['SLUSH', 'FALSE_SPRING', 'FLOOD', 'CONSTRUCTION'];
    } else if (month >= 5 && month <= 8) {
        // SUMMER (Jun, Jul, Aug, Sep)
        possibleThemes = ['PRAIRIE_GOLD', 'MOSQUITO_SWARM', 'CONSTRUCTION', 'SMOKE'];
    } else {
        // AUTUMN (Oct)
        possibleThemes = ['PRAIRIE_GOLD', 'NORMAL', 'CONSTRUCTION'];
    }

    // 2. Random Selection from Season
    let selectedTheme = possibleThemes[Math.floor(Math.random() * possibleThemes.length)];

    // 3. Overrides / Events (Small chance)
    const roll = Math.random();

    if (roll < 0.05) {
        selectedTheme = 'VICTORY_LAP'; // 5% chance the Jets won
    } else if (roll < 0.10 && (month > 4 && month < 9)) {
        selectedTheme = 'MOSQUITO_SWARM'; // Extra chance in summer
    }

    // 4. Force specific themes based on extreme wind simulation
    if (windSpeed > 50 && (month >= 10 || month <= 2)) {
        selectedTheme = 'NORTH_WIND';
    }

    return {
        theme: selectedTheme,
        windSpeed
    };
}
