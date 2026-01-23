// Temperature-to-color gradient mapping
// -50°C (pink/purple) → 0°C (dark blue) → 20°C (orange) → 45°C (black/deep red)
// Spring: Brighter, fresher tones (Teal/Cyan/Green)
// Fall: Moodier, earthier tones (Purple/Brown/Deep Blue)

interface ColorStop {
    temp: number;
    color: string;
}

const SPRING_GRADIENT: ColorStop[] = [
    { temp: -50, color: '#1a0b2e' }, // Midnight Violet (Deep Cold)
    { temp: -30, color: '#172554' }, // Deep Blue 950
    { temp: -10, color: '#0EA5E9' }, // Bright Blue
    { temp: 0, color: '#06B6D4' }, // Cyan
    { temp: 10, color: '#10B981' }, // Emerald Green
    { temp: 20, color: '#FACC15' }, // Sun Yellow
    { temp: 30, color: '#F97316' }, // Orange
    { temp: 45, color: '#EF4444' }, // Red
];

const FALL_GRADIENT: ColorStop[] = [
    { temp: -50, color: '#1e1b4b' }, // Indigo 950 (Absolute Zero)
    { temp: -30, color: '#1e3a8a' }, // Blue 900
    { temp: -10, color: '#475569' }, // Slate
    { temp: 0, color: '#78716C' }, // Stone
    { temp: 10, color: '#A8A29E' }, // Warm Grey
    { temp: 20, color: '#D97706' }, // Amber
    { temp: 30, color: '#9a3412' }, // Burnt Orange
    { temp: 45, color: '#7F1D1D' }, // Deep Maroon
];

// Jets colors
export const JETS_COLORS = {
    blue: '#041E42',
    red: '#C8102E',
    silver: '#7B858D'
};

/**
 * Interpolates between two colors
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;

    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Gets the color for a given temperature
 * Uses mental temperature (actual + Jets boost/penalty)
 */
export function getColorForTemperature(mentalTemp: number, seasonBias: 'optimistic' | 'pessimistic' = 'optimistic'): string {
    // Clamp to gradient range
    const temp = Math.max(-50, Math.min(45, mentalTemp));

    // Choose gradient based on season
    const gradient = seasonBias === 'optimistic' ? SPRING_GRADIENT : FALL_GRADIENT;

    // Find the two stops we're between
    let lowerStop = gradient[0];
    let upperStop = gradient[gradient.length - 1];

    for (let i = 0; i < gradient.length - 1; i++) {
        if (temp >= gradient[i].temp && temp <= gradient[i + 1].temp) {
            lowerStop = gradient[i];
            upperStop = gradient[i + 1];
            break;
        }
    }

    // Calculate interpolation factor
    const range = upperStop.temp - lowerStop.temp;
    const factor = range === 0 ? 0 : (temp - lowerStop.temp) / range;

    return interpolateColor(lowerStop.color, upperStop.color, factor);
}

/**
 * Gets the hero overlay gradient
 * - Normal weather: temperature-based gradient
 * - Jets win: Red/Blue Jets colors
 */
export function getHeroOverlay(
    mentalTemp: number,
    jetsStatus: 'VICTORY' | 'DEFEAT' | 'GAME_DAY' | 'NONE',
    seasonBias: 'optimistic' | 'pessimistic' = 'optimistic'
): {
    background: string;
    mixBlend: string;
} {
    if (jetsStatus === 'VICTORY') {
        // Jets win: Cherry red + Jets blue gradient
        return {
            background: `linear-gradient(135deg, ${JETS_COLORS.red}60, ${JETS_COLORS.blue}70)`,
            mixBlend: 'multiply'
        };
    }

    // Normal: Temperature-based color
    const tempColor = getColorForTemperature(mentalTemp, seasonBias);
    return {
        background: `linear-gradient(135deg, ${tempColor}50, ${tempColor}40)`,
        mixBlend: 'multiply'
    };
}

/**
 * Gets a dynamic message based on context
 */
export function getDynamicMessage(context: {
    temp: number;
    mentalTemp: number;
    jetsStatus: 'VICTORY' | 'DEFEAT' | 'GAME_DAY' | 'NONE';
    isGrind: boolean;
    grindDays: number;
    holiday: string | null;
    deviation: number;
    deltaShock: number;
}): string {
    const { temp, mentalTemp, jetsStatus, isGrind, grindDays, holiday, deviation, deltaShock } = context;

    // Holiday messages
    if (holiday?.includes('Christmas')) return 'Tis the season. Stay warm inside.';
    if (holiday?.includes('New Year')) return 'Fresh start. Hot coffee.';
    if (holiday?.includes('Festival du Voyageur')) return 'Célébrons ensemble.';
    if (holiday?.includes('Halloween')) return 'Spooky vibes only 👻';
    if (holiday?.includes('Thanksgiving')) return 'Gobble gobble. Grateful for you.';

    // Jets context
    if (jetsStatus === 'VICTORY' && temp < -20) {
        return `Jets won! Feels like ${mentalTemp.toFixed(0)}°C today.`;
    }
    if (jetsStatus === 'VICTORY') {
        return 'Go Jets Go! Victory tastes sweet.';
    }
    // Game Day - Informative but Business as Usual
    if (jetsStatus === 'GAME_DAY') {
        return 'Game Day. Puck drop tonight.';
    }

    // Grind messages
    if (isGrind) {
        return `Day ${grindDays + 1} of this cold. We have soup.`;
    }

    // Extreme temps
    if (temp < -35) return 'Do not go outside. Seriously.';
    if (temp < -25) return 'The cold demands respect.';
    if (temp > 35) return 'AC is blasting. Come cool off.';
    if (temp > 30) return `It's hot. Stay hydrated.`;

    // Delta shock
    if (deltaShock > 15) return `It's warming up. Finally.`;
    if (deltaShock < -15) return 'Winter came back. Sorry.';

    // Deviation
    if (deviation > 10) return 'Warmer than it should be.';
    if (deviation < -10) return 'Colder than usual for this time of year.';

    // Default seasonal
    if (temp < -10) return 'The oven is on. Come in.';
    if (temp < 5) return 'Coffee is hot. You are welcome.';
    if (temp > 20) return 'Patio season!';

    return 'Good to see you.';
}
