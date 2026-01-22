import { THEMES, type ThemeConfig as Theme } from '../themes';

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
    };
    temporal: {
        dayOfYear: number;
        hour: number;
        seasonBias: 'optimistic' | 'pessimistic';
        isBlackoutDate: boolean;
    };
    social: {
        jetsStatus: 'VICTORY' | 'DEFEAT' | 'GAME_DAY' | 'NONE';
        manualOverride: 'NONE' | 'FORCE_SOMBER' | 'FORCE_PARTY';
    };
    metrics: {
        deltaShock: number;
        deviation: number;
    };
    theme: Theme;
}

type JetsStatus = WinnipegContext['social']['jetsStatus'];
type ManualOverride = WinnipegContext['social']['manualOverride'];

// --- Cache ---
let cache: { data: WinnipegContext; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
        // We attach a catch handler to yesterdayPromise to prevent unhandled rejections if we return early
        const todayPromise = fetch(`https://api-web.nhle.com/v1/score/${todayStr}`);
        const yesterdayPromise = fetch(`https://api-web.nhle.com/v1/score/${yStr}`);
        yesterdayPromise.catch(() => {});

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
    if (ctx.weather.wmoCode >= 90) return THEMES.BUNKER; // Thunderstorm/Severe
    if (ctx.weather.isSmoke) return THEMES.SMOKE;
    if (ctx.weather.precipType === 'ice') return THEMES.NORTH_WIND; // Ice/Freezing Rain

    // --- PRIORITY 2: RESPECT ---
    if (ctx.temporal.isBlackoutDate) return THEMES.NORMAL;

    // --- PRIORITY 3: MANUAL OVERRIDE ---
    if (ctx.social.manualOverride === 'FORCE_SOMBER') return THEMES.BUNKER;
    if (ctx.social.manualOverride === 'FORCE_PARTY') return THEMES.VICTORY_LAP;

    // --- PRIORITY 4: SPECIFIC PHENOMENA ---
    if (ctx.weather.isSunLie) return THEMES.SUN_DOG;
    if (ctx.weather.apparentTemp > 35 && ctx.weather.temp < 30) return THEMES.MOSQUITO_SWARM;

    // --- PRIORITY 5: SOCIAL MODIFIERS ---
    if (ctx.social.jetsStatus === 'VICTORY') {
        return THEMES.VICTORY_LAP;
    }

    // --- PRIORITY 6: BASELINE ---
    if (ctx.temporal.seasonBias === 'optimistic') {
        if (ctx.weather.temp > -5) return THEMES.FALSE_SPRING;
    }

    if (ctx.metrics.deviation < -10 && ctx.weather.temp < -25) return THEMES.DEEP_FREEZE;

    // Blizzard / Whiteout check
    // WMO 75: Heavy snow.
    if (ctx.weather.wmoCode === 75 || (ctx.weather.precipType === 'snow' && ctx.weather.windSpeed > 40)) {
        return THEMES.WHITE_OUT;
    }

    if (ctx.weather.temp > 20) return THEMES.PRAIRIE_GOLD;

    // Slush check (Melt phase)
    if (ctx.weather.temp > 0 && ctx.weather.temp < 5 && ctx.weather.precipType !== 'none') {
        return THEMES.SLUSH;
    }

    return THEMES.NORMAL;
}

function getPrecipType(wmoCode: number, temp: number): 'none' | 'snow' | 'rain' | 'ice' {
    if (wmoCode >= 70 && wmoCode <= 79) return 'snow';
    if (wmoCode >= 50 && wmoCode <= 69) return 'rain';
    if (wmoCode >= 80 && wmoCode <= 82) return 'rain'; // Showers
    if (wmoCode >= 85 && wmoCode <= 86) return 'snow'; // Snow showers
    if (wmoCode === 66 || wmoCode === 67 || wmoCode === 56 || wmoCode === 57) return 'ice'; // Freezing rain
    return 'none';
}

function isBlackoutDate(date: Date): boolean {
    const month = date.getMonth() + 1; // 0-indexed
    const day = date.getDate();
    // Nov 11 (Remembrance Day), Sep 30 (Truth & Reconciliation)
    return (month === 11 && day === 11) || (month === 9 && day === 30);
}

// --- Main Engine ---

interface WeatherData {
    temp: number;
    apparentTemp: number;
    windSpeed: number;
    wmoCode: number;
    cloudCover: number;
    isDay: number;
    deltaShock: number;
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

    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=49.89&longitude=-97.14&current=temperature_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,snow_depth&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_gusts_10m,pressure_msl,is_day,soil_temperature_0cm,soil_moisture_0_to_1cm,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,precipitation_sum,precipitation_hours,precipitation_probability_max&past_days=3&forecast_days=2&timezone=America%2FWinnipeg';

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

            // Calculate Delta Shock (Today vs Yesterday same hour)
            const currentHour = new Date().getHours();
            // OpenMeteo hourly arrays start from past_days.
            // We requested 3 past days. Today starts at index 24 * 3 = 72.
            // Yesterday same hour is at index 72 - 24 + currentHour = 48 + currentHour.
            // Wait, past_days=3 means: Day -3, Day -2, Day -1. Today is Day 0.
            // Indices:
            // Day -3: 0-23
            // Day -2: 24-47
            // Day -1 (Yesterday): 48-71
            // Day 0 (Today): 72-95

            // To be safe, we look at the time array, but assuming standard alignment:
            const yesterdayIndex = 48 + currentHour;
            const yesterdayTemp = data.hourly.temperature_2m[yesterdayIndex];

            if (typeof yesterdayTemp === 'number') {
                deltaShock = temp - yesterdayTemp;
            }
        }
    } catch (e) {
        console.error('Error fetching weather:', e);
    }

    return { temp, apparentTemp, windSpeed, wmoCode, cloudCover, isDay, deltaShock };
}


export async function getWinnipegContext(): Promise<WinnipegContext> {
    const now = Date.now();
    if (cache && (now - cache.timestamp < CACHE_DURATION)) {
        return cache.data;
    }

    const [weather, jetsStatus] = await Promise.all([
        fetchWeather(),
        getJetsContext()
    ]);

    const { temp, apparentTemp, windSpeed, wmoCode, cloudCover, isDay, deltaShock } = weather;
    const { viscosity, windForce } = calculatePhysics(temp, windSpeed);

    // Determine Season Bias
    const date = new Date();
    const month = date.getMonth();
    // Simple heuristic: March/April/May = Optimistic, Sept/Oct/Nov = Pessimistic
    const seasonBias = (month >= 2 && month <= 4) ? 'optimistic' : 'pessimistic';

    const manualOverride = (process.env.MANUAL_OVERRIDE as ManualOverride) || 'NONE';

    const ctx: WinnipegContext = {
        weather: {
            temp,
            apparentTemp,
            viscosity,
            windForce,
            windSpeed,
            isSunLie: temp < -20 && cloudCover < 20 && isDay === 1,
            isSmoke: false, // Need AQI API, defaulting to false for now
            precipType: getPrecipType(wmoCode, temp),
            wmoCode,
            cloudCover
        },
        temporal: {
            dayOfYear: Math.floor((Date.now() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24),
            hour: date.getHours(),
            seasonBias,
            isBlackoutDate: isBlackoutDate(date)
        },
        social: {
            jetsStatus,
            manualOverride
        },
        metrics: {
            deltaShock,
            deviation: 0 // Placeholder
        },
        theme: THEMES.NORMAL // Placeholder, will be overwritten
    };

    ctx.theme = deriveTheme(ctx);

    cache = { data: ctx, timestamp: Date.now() };
    return ctx;
}
