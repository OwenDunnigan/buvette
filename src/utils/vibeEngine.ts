import { THEMES, type ThemeConfig as Theme, type ThemeKey } from '../themes';
import { getHolidayContext } from './holidays';
import { getVibeOverride, type VibeOverrideMode } from './sheets';

// --- Types ---

export interface WinnipegContext {
    weather: {
        temp: number;
        apparentTemp: number;
        viscosity: number;
        windForce: number;
        windSpeed: number;
        isSunLie: boolean;
        isSmoke: boolean;
        precipType: 'none' | 'snow' | 'rain' | 'ice';
        wmoCode: number;
        cloudCover: number;
        snowDepth: number;
        usAqi: number;
    };
    temporal: {
        dayOfYear: number;
        hour: number;
        seasonBias: 'optimistic' | 'pessimistic';
        isBlackoutDate: boolean;
        holiday: {
            isHoliday: boolean;
            holidayName: string | null;
        };
    };
    social: {
        jetsStatus: 'VICTORY' | 'DEFEAT' | 'GAME_DAY' | 'NONE';
        manualOverride: ManualOverride;
        overrideMessage: string | null;
    };
    grind: {
        isGrind: boolean;
        coldStreakDays: number;
    };
    metrics: {
        deltaShock: number;
        deviation: number;
        mentalTemp: number; // Temperature with social modifiers applied
    };
    theme: Theme;
}

type JetsStatus = WinnipegContext['social']['jetsStatus'];
type ManualOverride = 'NONE' | 'FORCE_SOMBER' | 'FORCE_PARTY' | 'FORCE_COZY' | 'FORCE_VICTORY';

// --- Cache ---
let cache: { data: WinnipegContext; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// --- Winnipeg Normal Curve ---
// Sinusoidal approximation of daily average highs
// Coldest: ~Jan 15 (Day 15) -> -13°C
// Hottest: ~July 15 (Day 196) -> +26°C
function getWinnipegNormal(dayOfYear: number): number {
    const amplitude = 19.5;
    const midpoint = 6.5;
    const phaseShift = 15; // Shifts trough to Jan 15
    return midpoint - amplitude * Math.cos((2 * Math.PI * (dayOfYear - phaseShift)) / 365);
}

// --- Logic Core ---

function calculatePhysics(temp: number, windSpeed: number) {
    // Viscosity: Maps -30C to 2.5s, +20C to 1s, +35C to 0.8s
    const rawViscosity = temp < -20 ? 2.5 : temp > 30 ? 0.8 : 1 + ((20 - temp) * 0.03);
    const viscosity = Math.min(Math.max(rawViscosity, 0.8), 2.5);

    // Wind Force: Maps 0-50km/h to 0-1 range
    const windForce = Math.min(windSpeed / 50, 1);

    return { viscosity, windForce };
}

async function getJetsContext(): Promise<JetsStatus> {
    try {
        const todayStr = new Date().toISOString().split('T')[0];

        // Calculate yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];

        // Start both fetches in parallel
        const todayPromise = fetch(`https://api-web.nhle.com/v1/score/${todayStr}`);
        const yesterdayPromise = fetch(`https://api-web.nhle.com/v1/score/${yStr}`);
        yesterdayPromise.catch(() => { }); // Prevent unhandled rejection if we return early

        // 1. Fetch the Scoreboard for TODAY
        const res = await todayPromise;
        if (!res.ok) return 'NONE';
        const data = await res.json();

        const todaysGame = data.games.find((g: any) =>
            g.homeTeam.abbrev === 'WPG' || g.awayTeam.abbrev === 'WPG'
        );

        // 2. CHECK: Is it Game Day?
        if (todaysGame) {
            if (todaysGame.gameState === 'FINAL') {
                const isWin = (todaysGame.homeTeam.abbrev === 'WPG' && todaysGame.homeTeam.score > todaysGame.awayTeam.score) ||
                    (todaysGame.awayTeam.abbrev === 'WPG' && todaysGame.awayTeam.score > todaysGame.homeTeam.score);
                return isWin ? 'VICTORY' : 'DEFEAT';
            }
            return 'GAME_DAY';
        }

        // 3. CHECK: Did they play yesterday?
        const yRes = await yesterdayPromise;
        if (!yRes.ok) return 'NONE';
        const yData = await yRes.json();

        const lastGame = yData.games.find((g: any) =>
            g.homeTeam.abbrev === 'WPG' || g.awayTeam.abbrev === 'WPG'
        );

        if (lastGame && lastGame.gameState === 'FINAL') {
            const isWin = (lastGame.homeTeam.abbrev === 'WPG' && lastGame.homeTeam.score > lastGame.awayTeam.score) ||
                (lastGame.awayTeam.abbrev === 'WPG' && lastGame.awayTeam.score > lastGame.homeTeam.score);
            return isWin ? 'VICTORY' : 'DEFEAT';
        }

        return 'NONE';
    } catch (e) {
        console.error('Error fetching Jets status:', e);
        return 'NONE';
    }
}

function deriveTheme(ctx: WinnipegContext): Theme {
    // --- PRIORITY 1: DANGER ---
    if (ctx.weather.wmoCode >= 95) return THEMES.BUNKER; // Severe Thunderstorm
    if (ctx.weather.isSmoke) return THEMES.SMOKE;
    if (ctx.weather.precipType === 'ice') return THEMES.NORTH_WIND; // Freezing Rain

    // --- PRIORITY 2: RESPECT (Blackouts supersede everything fun) ---
    if (ctx.temporal.isBlackoutDate) return THEMES.NEUTRAL_RESPECTFUL;

    // --- PRIORITY 3: MANUAL OVERRIDE (CSV-based) ---
    switch (ctx.social.manualOverride) {
        case 'FORCE_SOMBER': return THEMES.COZY_SOMBER;
        case 'FORCE_PARTY': return THEMES.MANIC_PARTY;
        case 'FORCE_COZY': return THEMES.HYGGE_MODE;
        case 'FORCE_VICTORY': return THEMES.VICTORY_COLD;
    }

    // --- PRIORITY 4: HOLIDAY THEMES ---
    const holiday = ctx.temporal.holiday;
    if (holiday.isHoliday && holiday.holidayName) {
        // Holiday-specific themes
        if (holiday.holidayName.includes('Christmas') || holiday.holidayName.includes('Boxing')) {
            return THEMES.COZY_SOMBER;
        }
        if (holiday.holidayName.includes('New Year')) {
            return ctx.temporal.hour < 12 ? THEMES.HYGGE_MODE : THEMES.MANIC_PARTY;
        }
        if (holiday.holidayName.includes('Festival du Voyageur')) {
            return THEMES.COZY_SOMBER; // Red sash vibes
        }
        if (holiday.holidayName.includes('Canada Day')) {
            return THEMES.PRAIRIE_GOLD;
        }
    }

    // --- PRIORITY 5: SPECIFIC PHENOMENA ---
    if (ctx.weather.isSunLie) return THEMES.SUN_DOG;
    if (ctx.weather.apparentTemp > 35 && ctx.weather.temp < 30) return THEMES.MOSQUITO_SWARM;

    // --- PRIORITY 6: DELTA SHOCK (Yesterday vs Today) ---
    // Big temperature swing detection
    if (ctx.metrics.deltaShock > 12 && ctx.weather.temp < 0) {
        // It was much colder yesterday, relief!
        return THEMES.HYGGE_MODE; // Could add THAW_RELIEF theme
    }
    if (ctx.metrics.deltaShock < -12) {
        // Sudden cold snap
        return THEMES.DEEP_FREEZE; // Could add COLD_SNAP theme
    }

    // --- PRIORITY 7: SOCIAL MODIFIERS (Jets) ---
    if (ctx.social.jetsStatus === 'VICTORY') {
        return ctx.weather.temp < 0 ? THEMES.VICTORY_COLD : THEMES.VICTORY_PATIO;
    }

    // --- PRIORITY 8: THE GRIND (Multi-day cold streak) ---
    if (ctx.grind.isGrind) {
        // Extra emphasis on warmth messaging when it's been brutal
        return THEMES.BUNKER;
    }

    // --- PRIORITY 9: SEASONAL BASELINE ---

    // False Spring: It's supposed to be cold but it's warm-ish
    if (ctx.temporal.seasonBias === 'optimistic' && ctx.weather.temp > -5) {
        // But not if there's still snow on the ground (Dirty Spring check)
        if (ctx.weather.snowDepth < 5) {
            return THEMES.FALSE_SPRING;
        }
    }

    // Deep Freeze: Colder than normal
    if (ctx.metrics.deviation < -10 && ctx.weather.temp < -25) {
        return THEMES.DEEP_FREEZE;
    }

    // Blizzard / Whiteout
    if (ctx.weather.wmoCode === 75 || (ctx.weather.precipType === 'snow' && ctx.weather.windSpeed > 40)) {
        return THEMES.WHITE_OUT;
    }

    // Beautiful summer
    if (ctx.weather.temp > 20 && ctx.weather.temp < 28) {
        return THEMES.PRAIRIE_GOLD;
    }

    // Slush (Melt phase) - Precip OR melting snow pile
    if (ctx.weather.temp > 0 && ctx.weather.temp < 5 && (ctx.weather.precipType !== 'none' || ctx.weather.snowDepth > 0)) {
        return THEMES.SLUSH;
    }

    // Flood (Rapid melt / Heavy Rain in Spring)
    if (ctx.temporal.seasonBias === 'optimistic' && (ctx.weather.snowDepth > 20 && ctx.weather.temp > 5) || (ctx.weather.wmoCode >= 50 && ctx.temporal.dayOfYear >= 90 && ctx.temporal.dayOfYear <= 150)) {
        return THEMES.FLOOD; // April/May Wet
    }

    // Construction (Summer Weekdays)
    const d = new Date();
    const isSummer = d.getMonth() >= 4 && d.getMonth() <= 8; // May-Sep
    const isWeekday = d.getDay() >= 1 && d.getDay() <= 5;
    if (isSummer && isWeekday && ctx.weather.wmoCode < 3 && ctx.weather.temp > 10) {
        // 10% chance of construction detour theme on nice days
        if (Math.random() < 0.1) return THEMES.CONSTRUCTION;
    }

    // Default Fallbacks by Season
    if (d.getMonth() === 8 || d.getMonth() === 9) return THEMES.AUTUMN; // Sept/Oct

    // Default cozy
    return THEMES.HYGGE_MODE;
}

function getPrecipType(wmoCode: number, temp: number): 'none' | 'snow' | 'rain' | 'ice' {
    if (wmoCode >= 70 && wmoCode <= 79) return 'snow';
    if (wmoCode >= 50 && wmoCode <= 69) return 'rain';
    if (wmoCode >= 80 && wmoCode <= 82) return 'rain'; // Showers
    if (wmoCode >= 85 && wmoCode <= 86) return 'snow'; // Snow showers
    if (wmoCode === 66 || wmoCode === 67 || wmoCode === 56 || wmoCode === 57) return 'ice'; // Freezing rain
    return 'none';
}

// --- Data Fetching ---

interface WeatherData {
    temp: number;
    apparentTemp: number;
    windSpeed: number;
    wmoCode: number;
    cloudCover: number;
    isDay: number;
    deltaShock: number;
    snowDepth: number;
    dailyMins: number[];
}

interface AqiData {
    usAqi: number;
}

async function fetchAqi(): Promise<AqiData> {
    try {
        const url = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=49.89&longitude=-97.14&current=us_aqi';
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            return { usAqi: data.current?.us_aqi ?? 0 };
        }
    } catch (e) {
        console.error('Error fetching AQI:', e);
    }
    return { usAqi: 0 };
}

async function fetchWeather(): Promise<WeatherData> {
    // Default Values
    let temp = -5;
    let apparentTemp = -10;
    let windSpeed = 15;
    let wmoCode = 0;
    let cloudCover = 50;
    let isDay = 1;
    let deltaShock = 0;
    let snowDepth = 0;
    let dailyMins: number[] = [];

    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=49.89&longitude=-97.14&current=temperature_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,snow_depth&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_gusts_10m,pressure_msl,is_day,soil_temperature_0cm,soil_moisture_0_to_1cm,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,precipitation_sum,precipitation_hours,precipitation_probability_max&past_days=10&forecast_days=2&timezone=America%2FWinnipeg';

        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            const current = data.current;

            temp = current.temperature_2m;
            apparentTemp = current.apparent_temperature;
            windSpeed = current.wind_speed_10m;
            wmoCode = current.weather_code;
            cloudCover = current.cloud_cover;
            isDay = current.is_day;
            snowDepth = current.snow_depth ?? 0;

            // Extract daily minimums for Grind calculation
            // with past_days=10, indices 0-9 are past days, 10 is today
            dailyMins = data.daily?.temperature_2m_min?.slice(0, 10) ?? [];

            // Calculate Delta Shock (Today vs Yesterday same hour)
            const currentHour = new Date().getHours();
            // With past_days=10, today starts at index 240 (24 * 10).
            // Yesterday same hour is at index 240 - 24 + currentHour = 216 + currentHour.
            const yesterdayIndex = 216 + currentHour;
            const yesterdayTemp = data.hourly.temperature_2m[yesterdayIndex];

            if (typeof yesterdayTemp === 'number') {
                deltaShock = temp - yesterdayTemp;
            }
        }
    } catch (e) {
        console.error('Error fetching weather:', e);
    }

    return { temp, apparentTemp, windSpeed, wmoCode, cloudCover, isDay, deltaShock, snowDepth, dailyMins };
}

function mapOverrideMode(mode: VibeOverrideMode | undefined): ManualOverride {
    if (!mode || mode === 'AUTO') return 'NONE';
    return mode as ManualOverride;
}

// --- Main Engine ---

export async function getWinnipegContext(overrides?: { temp?: number }): Promise<WinnipegContext> {
    const now = Date.now();
    // Only use cache if no overrides are active
    if (!overrides && cache && (now - cache.timestamp < CACHE_DURATION)) {
        return cache.data;
    }

    const [weather, aqi, jetsStatus, vibeOverride] = await Promise.all([
        fetchWeather(),
        fetchAqi(),
        getJetsContext(),
        getVibeOverride()
    ]);

    let { temp, apparentTemp, windSpeed, wmoCode, cloudCover, isDay, deltaShock, snowDepth, dailyMins } = weather;
    const { usAqi } = aqi;

    // Apply Temperature Override
    if (overrides?.temp !== undefined) {
        temp = overrides.temp;
        // Approximate other values if not provided
        apparentTemp = temp - 5;
        deltaShock = 0; // Reset delta shock on override as it's hard to fake history
    }

    const { viscosity, windForce } = calculatePhysics(temp, windSpeed);

    // Determine Season Bias (Hysteresis)
    const date = new Date();
    const month = date.getMonth();
    // March(2) to August(7) = Optimistic (Spring/Summer energy)
    // Sept(8) to Feb(1) = Pessimistic (Fall/Winter gloom)
    const seasonBias = (month >= 2 && month <= 7) ? 'optimistic' : 'pessimistic';

    // Calculate deviation from seasonal normal
    const dayOfYear = Math.floor((Date.now() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const normalTemp = getWinnipegNormal(dayOfYear);
    const deviation = temp - normalTemp;

    // Check for "The Grind" (multi-day cold streak)
    const isGrind = dailyMins.length >= 3 && dailyMins.every(t => t < -20);
    const coldStreakDays = dailyMins.filter(t => t < -20).length;

    // Holiday context
    const holiday = getHolidayContext(date);

    // Manual override from CSV
    const manualOverride = mapOverrideMode(vibeOverride?.Mode);
    const overrideMessage = vibeOverride?.Message || null;

    // Mental Temperature (with social modifiers)
    let mentalTemp = temp;
    if (jetsStatus === 'VICTORY') mentalTemp += 10;
    if (jetsStatus === 'DEFEAT') mentalTemp -= 5;

    const ctx: WinnipegContext = {
        weather: {
            temp,
            apparentTemp,
            viscosity,
            windForce,
            windSpeed,
            isSunLie: temp < -15 && cloudCover < 20 && isDay === 1,
            isSmoke: usAqi > 150, // Unhealthy AQI = smoke
            precipType: getPrecipType(wmoCode, temp),
            wmoCode,
            cloudCover,
            snowDepth,
            usAqi
        },
        temporal: {
            dayOfYear,
            hour: date.getHours(),
            seasonBias,
            isBlackoutDate: holiday.isBlackout,
            holiday: {
                isHoliday: holiday.isHoliday,
                holidayName: holiday.holidayName
            }
        },
        social: {
            jetsStatus,
            manualOverride,
            overrideMessage
        },
        grind: {
            isGrind,
            coldStreakDays
        },
        metrics: {
            deltaShock,
            deviation,
            mentalTemp
        },
        theme: THEMES.NORMAL // Placeholder, will be overwritten
    };

    ctx.theme = deriveTheme(ctx);

    cache = { data: ctx, timestamp: Date.now() };
    return ctx;
}
