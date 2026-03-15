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
 * Converts Hex to HSL
 */
function hexToHSL(hex: string): { h: number, s: number, l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s, l };
}

/**
 * Converts HSL to Hex
 */
function hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Desaturates a color, with stronger desaturation for cool tones (green/blue/purple)
 */
function adjustColorIntensity(hex: string): string {
    const hsl = hexToHSL(hex);

    // Cool hues are roughly between 80 (yellow-green) and 280 (violet)
    const isCool = hsl.h > 80 && hsl.h < 280;

    // Desaturate significantly for cool tones, less for warm tones
    const desaturationFactor = isCool ? 0.3 : 0.6;
    hsl.s *= desaturationFactor;

    return hslToHex(hsl.h, hsl.s, hsl.l);
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
        // Tone down the victory colors as well
        const mutedRed = adjustColorIntensity(JETS_COLORS.red);
        const mutedBlue = adjustColorIntensity(JETS_COLORS.blue);
        return {
            background: `linear-gradient(135deg, ${mutedRed}30, ${mutedBlue}40)`,
            mixBlend: 'multiply'
        };
    }

    if (theme && theme.id !== 'NORMAL') {
        // Blend the theme's accent and dark background, but desaturate
        const mutedAccent = adjustColorIntensity(theme.lightColors.accent);
        const mutedBg = adjustColorIntensity(theme.darkColors.bg);
        return {
            background: `linear-gradient(135deg, ${mutedAccent}35, ${mutedBg}35)`,
            mixBlend: 'multiply'
        };
    }

    // Normal: Temperature-based color
    const tempColor = getColorForTemperature(mentalTemp, seasonBias);
    const mutedColor = adjustColorIntensity(tempColor);
    return {
        background: `linear-gradient(135deg, ${mutedColor}25, ${mutedColor}15)`,
        mixBlend: 'multiply'
    };
}

/**
 * Gets a dynamic, professionally polished message based on context.
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
    const { 
        temp, mentalTemp, jetsStatus, isGrind, grindDays, 
        tomorrowMinTemp, dayAfterMinTemp, isColdSnapWarning, 
        holiday, isBlackout, deviation, deltaShock 
    } = context;

    // 1. Protect Blackout Dates (Solemn Days)
    if (isBlackout) {
        if (holiday?.includes('Remembrance Day')) return 'Lest we forget. Take a moment to reflect today.';
        if (holiday?.includes('Truth & Reconciliation')) return 'Every Child Matters. Take a moment to reflect today.';
        return 'Please take a moment to reflect today.';
    }

    const messageParts: string[] = [];

    // 2. Holiday Messages (Primary Greeting)
    if (holiday) {
        if (holiday.includes('Christmas')) messageParts.push("Season's greetings. Stay warm and enjoy the holidays with us.");
        else if (holiday.includes('New Year')) messageParts.push("Wishing you a happy New Year and a fresh start!");
        else if (holiday.includes('Festival du Voyageur')) messageParts.push("Heho! Happy Festival du Voyageur!");
        else if (holiday.includes('Halloween')) messageParts.push("Happy Halloween!! Join us for some spooky treats.");
        else if (holiday.includes('Thanksgiving')) messageParts.push("Happy Thanksgiving. We are thankful for you.");
        else if (holiday.includes('Lunar New Year')) messageParts.push("Happy Lunar New Year! Wishing you joy and prosperity.");
        else if (holiday.includes('Diwali')) messageParts.push("Wishing you a bright and joyous Diwali.");
        else if (holiday.includes('Holi')) messageParts.push("Happy Holi. Wishing you a vibrant and colorful season.");
        else if (holiday.includes('Eid')) messageParts.push("Eid Mubarak! Wishing you peace and joy.");
        else if (holiday.includes('Philippine Independence')) messageParts.push("Happy Philippine Independence Day.");
        else if (holiday.includes('Vaisakhi')) messageParts.push("Happy Vaisakhi! Wishing you a season of abundance.");
    }

    // 3. Weather & Sports Context (Secondary Message)
    let contextMsg = '';
    let weatherHandled = false;
    let sportsHandled = false;

    // A. Special Combinations (Naturally joined with "and" where appropriate)
    if (jetsStatus === 'VICTORY' && temp < -25) {
        contextMsg = `A great Jets victory to help brave the ${mentalTemp.toFixed(0)}°C chill.`;
        weatherHandled = true;
        sportsHandled = true;
    } else if (jetsStatus === 'GAME_DAY' && temp < -30) {
        contextMsg = "It's Game Day, and it is bitterly cold outside. Please bundle up, and join us for a good luck meal.";
        weatherHandled = true;
        sportsHandled = true;
    } else if (jetsStatus === 'VICTORY' && deltaShock > 10) {
        contextMsg = "A Jets victory and warming temperatures make for a beautiful day.";
        weatherHandled = true;
        sportsHandled = true;
    }

    // B. Independent Sports
    if (!sportsHandled && !contextMsg) {
        if (jetsStatus === 'VICTORY') contextMsg = "Celebrating the Jets victory today!";
        else if (jetsStatus === 'GAME_DAY') contextMsg = "It's Game Day! Our brunch is good luck ;)";
    }

    // C. Independent Weather
    if (!weatherHandled) {
        let weatherSubMsg = '';
        
        if (isGrind) weatherSubMsg = `Day ${grindDays + 1} of the deep freeze. Warm up with our daily soup!`;
        else if (isColdSnapWarning) {
            const targetTemp = Math.min(tomorrowMinTemp, dayAfterMinTemp);
            if (targetTemp < -25) weatherSubMsg = `A cold snap is approaching (${targetTemp}°C). Stop by and enjoy a warm meal before it sets in.`;
            else weatherSubMsg = "Colder weather is on the way - our oven is on!";
        } else if (temp < -35) weatherSubMsg = "Extreme cold warning today. Please stay safe, and join us indoors when you need to warm up.";
        else if (temp < -25) weatherSubMsg = "Frigid temperatures today. Bundle up and come warm up.";
        else if (temp > 35) weatherSubMsg = "Escape the heat today. Join us in the air conditioning for a refreshing lemonade.";
        else if (temp > 30) weatherSubMsg = "It's a hot one today! Stop by for a cold drink.";
        else if (deltaShock > 15) weatherSubMsg = "The weather is finally warming up. Celebrate with a great meal.";
        else if (deltaShock < -15) weatherSubMsg = "Winter has returned. Warm up inside with a hot beverage.";
        else if (deviation > 10) weatherSubMsg = "A bit warm today - perfect for an iced coffee.";
        else if (deviation < -10) weatherSubMsg = "A bit chilly out today - stop by for hot cocoa!";

        // Intelligently combine sports and weather if both triggered independently
        if (contextMsg && weatherSubMsg) {
            // Converts the first letter of weatherSubMsg to lowercase for a smoother grammatical join
            const lowerWeather = weatherSubMsg.charAt(0).toLowerCase() + weatherSubMsg.slice(1);
            contextMsg = `${contextMsg} Also, ${lowerWeather}`;
        } else if (weatherSubMsg) {
            contextMsg = weatherSubMsg;
        }
    }

    if (contextMsg) messageParts.push(contextMsg);

    // 4. Default Fallbacks (Only triggers if the array is entirely empty)
    if (messageParts.length === 0) {
        if (temp < -10) return "It's cold out there. Step inside and warm up.";
        if (temp < 5) return "Our coffee is fresh and hot. We hope to see you today.";
        if (temp > 20) return "It's patio weather! Join us outside.";
        return "We look forward to seeing you today!";
    }

    // 5. Final Assembly (Joins primary greetings and context smoothly)
    return messageParts.join(' ');
}
