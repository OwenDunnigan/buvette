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

import type { Theme } from '../themes';

/**
 * Gets the hero overlay gradient
 * - Normal weather: temperature-based gradient
 * - Jets win: Red/Blue Jets colors
 * - Active Theme: Uses theme accent and background
 */
export function getHeroOverlay(
    mentalTemp: number,
    jetsStatus: 'VICTORY' | 'DEFEAT' | 'GAME_DAY' | 'NONE',
    seasonBias: 'optimistic' | 'pessimistic' = 'optimistic',
    theme?: Theme
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

    if (theme && theme.id !== 'NORMAL') {
        // Blend the theme's accent and dark background
        return {
            background: `linear-gradient(135deg, ${theme.lightColors.accent}80, ${theme.darkColors.bg}80)`,
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
    todayMinTemp: number;
    tomorrowMinTemp: number;
    dayAfterMinTemp: number;
    isColdSnapWarning: boolean;
    holiday: string | null;
    isBlackout?: boolean;
    deviation: number;
    deltaShock: number;
}): string {
    const { temp, mentalTemp, jetsStatus, isGrind, grindDays, todayMinTemp, tomorrowMinTemp, dayAfterMinTemp, isColdSnapWarning, holiday, isBlackout, deviation, deltaShock } = context;

    // 0. Protect Blackout Dates (Solemn Days)
    if (isBlackout) {
        if (holiday?.includes('Remembrance Day')) return 'Lest we forget. Take a moment to reflect today.';
        if (holiday?.includes('Truth & Reconciliation')) return 'Every Child Matters. Take time to listen and reflect today.';
        return 'Take a moment to reflect today.';
    }

    const messages: string[] = [];

    // 1. Holiday messages
    if (holiday?.includes('Christmas')) messages.push('Tis the season. Stay warm inside.');
    else if (holiday?.includes('New Year')) messages.push('Fresh start. Hot coffee.');
    else if (holiday?.includes('Festival du Voyageur')) messages.push('Célébrons ensemble.');
    else if (holiday?.includes('Halloween')) messages.push('Spooky vibes only 👻');
    else if (holiday?.includes('Thanksgiving')) messages.push('Gobble gobble. Grateful for you.');
    else if (holiday?.includes('Lunar New Year')) messages.push('Happy Lunar New Year! Prosperity to you.');
    else if (holiday?.includes('Diwali')) messages.push('Happy Diwali! Let your light shine.');
    else if (holiday?.includes('Holi')) messages.push('Happy Holi! Embrace the colors of the season.');
    else if (holiday?.includes('Eid')) messages.push('Eid Mubarak! Celebrate safely.');
    else if (holiday?.includes('Philippine Independence')) messages.push('Maligayang Araw ng Kalayaan!');
    else if (holiday?.includes('Vaisakhi')) messages.push('Happy Vaisakhi! Harvest blessings.');

    // 2. Special Combinations (e.g. Jets + Weather)
    let weatherIncluded = false;
    let sportsIncluded = false;

    if (jetsStatus === 'VICTORY' && temp < -25) {
        messages.push(`Jets won! At least that helps the ${mentalTemp.toFixed(0)}°C chill.`);
        weatherIncluded = true;
        sportsIncluded = true;
    } else if (jetsStatus === 'GAME_DAY' && temp < -30) {
        messages.push(`Game Day. Bundle up, it is brutal out there.`);
        weatherIncluded = true;
        sportsIncluded = true;
    } else if (jetsStatus === 'VICTORY' && deltaShock > 10) {
        messages.push(`Jets win AND it is warming up. A beautiful day.`);
        weatherIncluded = true;
        sportsIncluded = true;
    }

    // 3. Independent Sports
    if (!sportsIncluded) {
        if (jetsStatus === 'VICTORY') messages.push('Go Jets Go! Victory tastes sweet.');
        else if (jetsStatus === 'GAME_DAY') messages.push('Game Day. Puck drop tonight.');
    }

    // 4. Independent Weather
    if (!weatherIncluded) {
        if (isGrind) messages.push(`Day ${grindDays + 1} of this cold. We have soup.`);
        else if (isColdSnapWarning) {
            const targetTemp = Math.min(tomorrowMinTemp, dayAfterMinTemp);
            if (targetTemp < -25) messages.push(`Serious cold incoming (${targetTemp}°C). Stock up and settle in.`);
            else messages.push(`The cold moves in soon. Eat somewhere warm tonight.`);
        } else if (temp < -35) messages.push('Do not go outside. Seriously.');
        else if (temp < -25) messages.push('The cold demands respect.');
        else if (temp > 35) messages.push('AC is blasting. Come cool off.');
        else if (temp > 30) messages.push(`It's hot. Stay hydrated.`);
        else if (deltaShock > 15) messages.push(`It's warming up. Finally.`);
        else if (deltaShock < -15) messages.push('Winter came back. Sorry.');
        else if (deviation > 10) messages.push('Warmer than it should be.');
        else if (deviation < -10) messages.push('Colder than usual for this time of year.');
    }

    // 5. Default Fallbacks
    if (messages.length === 0) {
        if (temp < -10) return 'The oven is on. Come in.';
        if (temp < 5) return 'Coffee is hot. You are welcome.';
        if (temp > 20) return 'Patio season!';
        return 'Good to see you.';
    }

    // Combine and return
    return messages.join(' ');
}
