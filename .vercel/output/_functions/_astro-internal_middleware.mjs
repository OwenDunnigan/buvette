import { d as defineMiddleware, s as sequence } from './chunks/index_3ajT-fPB.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_ZxfdP2UT.mjs';
import 'piccolore';
import './chunks/astro/server_CH2CU_Hd.mjs';
import 'clsx';

const THEMES = {
  BUNKER_STORM: {
    id: "BUNKER_STORM",
    mode: "dark",
    palette: { primary: "#4A4A4A", background: "#1A1A1A", text: "#E0E0E0" },
    visuals: { contrast: 0.8, blur: "2px" }
  },
  HAZE_DYSTOPIA: {
    id: "HAZE_DYSTOPIA",
    mode: "dark",
    palette: { primary: "#D4A017", background: "#2C241B", text: "#F5E6CC" },
    visuals: { contrast: 0.6, blur: "4px" }
  },
  ICE_SHELL: {
    id: "ICE_SHELL",
    mode: "light",
    palette: { primary: "#A5F2F3", background: "#F0FFFF", text: "#003366" },
    visuals: { contrast: 0.9, blur: "1px" }
  },
  NEUTRAL_RESPECTFUL: {
    id: "NEUTRAL_RESPECTFUL",
    mode: "light",
    palette: { primary: "#555555", background: "#F5F5F5", text: "#111111" },
    visuals: { contrast: 0.5, blur: "0px" }
  },
  COZY_SOMBER: {
    id: "COZY_SOMBER",
    mode: "dark",
    palette: { primary: "#8B4513", background: "#2B1B17", text: "#D2B48C" },
    visuals: { contrast: 0.7, blur: "0px" }
  },
  MANIC_PARTY: {
    id: "MANIC_PARTY",
    mode: "light",
    palette: { primary: "#FF00FF", background: "#FFF0F5", text: "#000000" },
    visuals: { contrast: 1, blur: "0px" }
  },
  SUN_DOG_GLARE: {
    id: "SUN_DOG_GLARE",
    mode: "light",
    palette: { primary: "#FFFFFF", background: "#FFFFFF", text: "#000000" },
    visuals: { contrast: 1, blur: "5px" }
  },
  SWAMP_HUMIDITY: {
    id: "SWAMP_HUMIDITY",
    mode: "light",
    palette: { primary: "#2E8B57", background: "#F0FFF0", text: "#006400" },
    visuals: { contrast: 0.6, blur: "3px" }
  },
  VICTORY_COLD: {
    id: "VICTORY_COLD",
    mode: "dark",
    palette: { primary: "#004C97", background: "#001F3F", text: "#FFFFFF" },
    // Jets Blue
    visuals: { contrast: 0.9, blur: "0px" }
  },
  VICTORY_PATIO: {
    id: "VICTORY_PATIO",
    mode: "light",
    palette: { primary: "#004C97", background: "#E6F3FF", text: "#002244" },
    visuals: { contrast: 0.9, blur: "0px" }
  },
  FALSE_SPRING: {
    id: "FALSE_SPRING",
    mode: "light",
    palette: { primary: "#FF69B4", background: "#FFF0F5", text: "#333333" },
    visuals: { contrast: 0.8, blur: "0px" }
  },
  DEEP_FREEZE_GRIND: {
    id: "DEEP_FREEZE_GRIND",
    mode: "dark",
    palette: { primary: "#708090", background: "#2F4F4F", text: "#E0FFFF" },
    visuals: { contrast: 0.9, blur: "0px" }
  },
  PRAIRIE_GOLD: {
    id: "PRAIRIE_GOLD",
    mode: "light",
    palette: { primary: "#FFD700", background: "#FFFACD", text: "#5D4037" },
    visuals: { contrast: 0.8, blur: "0px" }
  },
  HYGGE_MODE: {
    id: "HYGGE_MODE",
    mode: "light",
    palette: { primary: "#DEB887", background: "#FAF0E6", text: "#4A3B32" },
    visuals: { contrast: 0.7, blur: "0px" }
  }
};

let cache = null;
const CACHE_DURATION = 5 * 60 * 1e3;
function calculatePhysics(temp, windSpeed) {
  const rawViscosity = temp < -20 ? 2.5 : temp > 30 ? 0.8 : 1 + (20 - temp) * 0.03;
  const viscosity = Math.min(Math.max(rawViscosity, 0.8), 2.5);
  const windForce = Math.min(windSpeed / 50, 1);
  return { viscosity, windForce };
}
async function getJetsContext() {
  try {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const res = await fetch(`https://api-web.nhle.com/v1/score/${todayStr}`);
    if (!res.ok) return "NONE";
    const data = await res.json();
    const todaysGame = data.games.find(
      (g) => g.homeTeam.abbrev === "WPG" || g.awayTeam.abbrev === "WPG"
    );
    if (todaysGame) {
      if (todaysGame.gameState === "FINAL") {
        const isWin = todaysGame.homeTeam.abbrev === "WPG" && todaysGame.homeTeam.score > todaysGame.awayTeam.score || todaysGame.awayTeam.abbrev === "WPG" && todaysGame.awayTeam.score > todaysGame.homeTeam.score;
        return isWin ? "VICTORY" : "DEFEAT";
      }
      return "GAME_DAY";
    }
    const yesterday = /* @__PURE__ */ new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];
    const yRes = await fetch(`https://api-web.nhle.com/v1/score/${yStr}`);
    if (!yRes.ok) return "NONE";
    const yData = await yRes.json();
    const lastGame = yData.games.find(
      (g) => g.homeTeam.abbrev === "WPG" || g.awayTeam.abbrev === "WPG"
    );
    if (lastGame && lastGame.gameState === "FINAL") {
      const isWin = lastGame.homeTeam.abbrev === "WPG" && lastGame.homeTeam.score > lastGame.awayTeam.score || lastGame.awayTeam.abbrev === "WPG" && lastGame.awayTeam.score > lastGame.homeTeam.score;
      return isWin ? "VICTORY" : "DEFEAT";
    }
    return "NONE";
  } catch (e) {
    console.error("Error fetching Jets status:", e);
    return "NONE";
  }
}
function deriveTheme(ctx) {
  if (ctx.weather.wmoCode >= 90) return THEMES.BUNKER_STORM;
  if (ctx.weather.isSmoke) return THEMES.HAZE_DYSTOPIA;
  if (ctx.weather.precipType === "ice") return THEMES.ICE_SHELL;
  if (ctx.temporal.isBlackoutDate) return THEMES.NEUTRAL_RESPECTFUL;
  if (ctx.social.manualOverride === "FORCE_SOMBER") return THEMES.COZY_SOMBER;
  if (ctx.social.manualOverride === "FORCE_PARTY") return THEMES.MANIC_PARTY;
  if (ctx.weather.isSunLie) return THEMES.SUN_DOG_GLARE;
  if (ctx.weather.apparentTemp > 35 && ctx.weather.temp < 30) return THEMES.SWAMP_HUMIDITY;
  if (ctx.social.jetsStatus === "VICTORY") {
    return ctx.weather.temp < 0 ? THEMES.VICTORY_COLD : THEMES.VICTORY_PATIO;
  }
  if (ctx.temporal.seasonBias === "optimistic") {
    if (ctx.weather.temp > -5) return THEMES.FALSE_SPRING;
  }
  if (ctx.metrics.deviation < -10 && ctx.weather.temp < -25) return THEMES.DEEP_FREEZE_GRIND;
  if (ctx.weather.temp > 20) return THEMES.PRAIRIE_GOLD;
  return THEMES.HYGGE_MODE;
}
function getPrecipType(wmoCode, temp) {
  if (wmoCode >= 70 && wmoCode <= 79) return "snow";
  if (wmoCode >= 50 && wmoCode <= 69) return "rain";
  if (wmoCode >= 80 && wmoCode <= 82) return "rain";
  if (wmoCode >= 85 && wmoCode <= 86) return "snow";
  if (wmoCode === 66 || wmoCode === 67 || wmoCode === 56 || wmoCode === 57) return "ice";
  return "none";
}
function isBlackoutDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return month === 11 && day === 11 || month === 9 && day === 30;
}
async function getWinnipegContext() {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }
  let temp = -5;
  let apparentTemp = -10;
  let windSpeed = 15;
  let wmoCode = 0;
  let cloudCover = 50;
  let isDay = 1;
  let deltaShock = 0;
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=49.89&longitude=-97.14&current=temperature_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,snow_depth&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_gusts_10m,pressure_msl,is_day,soil_temperature_0cm,soil_moisture_0_to_1cm,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,precipitation_sum,precipitation_hours,precipitation_probability_max&past_days=3&forecast_days=2&timezone=America%2FWinnipeg";
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
      const currentHour = (/* @__PURE__ */ new Date()).getHours();
      const yesterdayIndex = 48 + currentHour;
      const yesterdayTemp = data.hourly.temperature_2m[yesterdayIndex];
      if (typeof yesterdayTemp === "number") {
        deltaShock = temp - yesterdayTemp;
      }
    }
  } catch (e) {
    console.error("Error fetching weather:", e);
  }
  const { viscosity, windForce } = calculatePhysics(temp, windSpeed);
  const jetsStatus = await getJetsContext();
  const date = /* @__PURE__ */ new Date();
  const month = date.getMonth();
  const seasonBias = month >= 2 && month <= 4 ? "optimistic" : "pessimistic";
  const manualOverride = process.env.MANUAL_OVERRIDE || "NONE";
  const ctx = {
    weather: {
      temp,
      apparentTemp,
      viscosity,
      windForce,
      isSunLie: temp < -20 && cloudCover < 20 && isDay === 1,
      isSmoke: false,
      // Need AQI API, defaulting to false for now
      precipType: getPrecipType(wmoCode),
      wmoCode,
      cloudCover
    },
    temporal: {
      dayOfYear: Math.floor((Date.now() - new Date(date.getFullYear(), 0, 0).getTime()) / 1e3 / 60 / 60 / 24),
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
      deviation: 0
      // Placeholder
    },
    theme: THEMES.HYGGE_MODE
    // Placeholder, will be overwritten
  };
  ctx.theme = deriveTheme(ctx);
  cache = { data: ctx, timestamp: Date.now() };
  return ctx;
}

const onRequest$1 = defineMiddleware(async (context, next) => {
  const vibe = await getWinnipegContext();
  context.locals.vibe = vibe;
  return next();
});

const onRequest = sequence(

	onRequest$1

);

export { onRequest };
