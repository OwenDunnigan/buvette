import { e as createComponent, f as createAstro, l as defineStyleVars, r as renderTemplate, h as addAttribute, k as renderComponent, n as renderHead, o as renderSlot } from './astro/server_BZHMmTXm.mjs';
import 'piccolore';
/* empty css                         */
import 'clsx';

const THEMES = {
  // --- 1. THE DEFAULT (Baseline) ---
  "NORMAL": {
    label: "Winnipeg, MB",
    colors: { bg: "#F5F5F0", text: "#1A1A1A", accent: "#0055FF", surface: "#FFFFFF" },
    physics: { viscosity: 1, cursor: "default" },
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 100, blur: "0px", noise: 0.03, saturate: 100 }
  },
  // --- 2. THE BUNKER (High Anxiety / Extreme Cold) ---
  "BUNKER": {
    label: "Shelter Mode",
    colors: {
      bg: "#0F0E0E",
      // Obsidian
      text: "#E0DACC",
      // Warm Bone
      accent: "#FF4400",
      // Emergency Orange (dimmed)
      surface: "#1C1B1B"
      // Dark Grey
    },
    physics: { viscosity: 2.2, cursor: "default" },
    // Very slow interactions
    typography: { casual: 0, slant: 0, weight: 700 },
    // Stiff, heavy fonts
    effects: { contrast: 130, blur: "0.5px", noise: 0.15, saturate: 80 }
    // High grain, gritty
  },
  // --- 3. SUN DOG (The Beautiful Lie) ---
  "SUN_DOG": {
    label: "Sundog Glare",
    colors: {
      bg: "#FFFFFF",
      text: "#002244",
      // Deep Blue text (high contrast needed against glare)
      accent: "#00AACC",
      // Cyan Ice
      surface: "#F0FBFF"
      // Very pale blue
    },
    physics: { viscosity: 1.8, cursor: "crosshair" },
    // Sharp, brittle feel
    typography: { casual: 0, slant: 0, weight: 600 },
    effects: { contrast: 150, blur: "0px", noise: 0, saturate: 120 }
    // Sharp, blown-out highlights
  },
  // --- 4. SLUSH REALITY (The "Dirty Spring") ---
  "SLUSH": {
    label: "Melt Phase",
    colors: {
      bg: "#C4C2BC",
      // Wet Concrete
      text: "#2A2926",
      // Muddy Charcoal
      accent: "#5C4830",
      // Leather Boot Brown
      surface: "#D6D4D0"
    },
    physics: { viscosity: 1.4, cursor: "progress" },
    // Draggy
    typography: { casual: 0.2, slant: -2, weight: 500 },
    // Slightly messy
    effects: { contrast: 90, blur: "1px", noise: 0.08, saturate: 60 }
    // Muted, damp feel
  },
  // --- 5. PRAIRIE GOLD (Perfect Summer) ---
  "PRAIRIE_GOLD": {
    label: "Golden Hour",
    colors: {
      bg: "#FFF8E1",
      // Warm Wheat
      text: "#3E2723",
      // Coffee
      accent: "#FFB300",
      // Canola Gold
      surface: "#FFFFFF"
    },
    physics: { viscosity: 0.9, cursor: "default" },
    // Fluid, easy
    typography: { casual: 1, slant: 0, weight: 400 },
    // Relaxed, curvy fonts
    effects: { contrast: 100, blur: "0px", noise: 0.02, saturate: 110 }
    // Warm, rich
  },
  // --- 6. MOSQUITO SWARM (High Humidity + Heat) ---
  "MOSQUITO_SWARM": {
    label: "Humidex Warning",
    colors: {
      bg: "#E8F5E9",
      // Swamp Green tint
      text: "#1B5E20",
      // Dark Forest
      accent: "#D50000",
      // Blood Red (Subtle nod)
      surface: "#FFFFFF"
    },
    physics: { viscosity: 1.2, cursor: "default" },
    // Sticky air
    typography: { casual: 0.8, slant: 2, weight: 500 },
    // Jittery?
    effects: { contrast: 100, blur: "2px", noise: 0.05, saturate: 130 }
    // Hazy, sweaty blur
  },
  // --- 7. CONSTRUCTION SEASON (The "Other" Season) ---
  "CONSTRUCTION": {
    label: "Detour Ahead",
    colors: {
      bg: "#FFF3E0",
      // Dust
      text: "#212121",
      // Asphalt
      accent: "#FF6F00",
      // Pylon Orange
      surface: "#FFFFFF"
    },
    physics: { viscosity: 1, cursor: "help" },
    // Confused cursor?
    typography: { casual: 0, slant: 0, weight: 900 },
    // Heavy "Warning" type
    effects: { contrast: 110, blur: "0px", noise: 0.1, saturate: 100 }
    // Dusty grain
  },
  // --- 8. VICTORY LAP (Jets Win) ---
  "VICTORY_LAP": {
    label: "WPG Victory",
    colors: {
      bg: "#F0F4F8",
      // Ice White
      text: "#041E42",
      // Jets Blue
      accent: "#C8102E",
      // Jets Red
      surface: "#FFFFFF"
    },
    physics: { viscosity: 0.8, cursor: "default" },
    // Fast, exciting
    typography: { casual: 0.1, slant: -10, weight: 800 },
    // Fast, leaning forward
    effects: { contrast: 120, blur: "0px", noise: 0, saturate: 110 }
    // Crisp TV signal
  },
  // --- 9. NORTH WIND (Arctic Blast) ---
  "NORTH_WIND": {
    label: "Windchill -40",
    colors: {
      bg: "#E0F7FA",
      // Icy Blue
      text: "#006064",
      // Deep Cyan
      accent: "#00BCD4",
      // Cyan
      surface: "#FFFFFF"
    },
    physics: { viscosity: 0.6, cursor: "crosshair" },
    // Very fast, piercing
    typography: { casual: 0, slant: -15, weight: 600 },
    // Extreme wind lean
    effects: { contrast: 110, blur: "0.5px", noise: 0.05, saturate: 90 }
    // Cold clarity
  },
  // --- 10. SMOKE (Forest Fires) ---
  "SMOKE": {
    label: "Air Quality 10+",
    colors: {
      bg: "#D7CCC8",
      // Hazy Grey/Brown
      text: "#3E2723",
      // Dark Brown
      accent: "#FF5722",
      // Dim Orange Sun
      surface: "#EFEBE9"
    },
    physics: { viscosity: 1.1, cursor: "not-allowed" },
    // Choking
    typography: { casual: 0.5, slant: 0, weight: 500 },
    effects: { contrast: 80, blur: "3px", noise: 0.05, saturate: 120 }
    // Hazy, diffuse
  },
  // --- 11. WHITE OUT (Blizzard) ---
  "WHITE_OUT": {
    label: "Zero Visibility",
    colors: {
      bg: "#FAFAFA",
      // White
      text: "#212121",
      // Black (Contrast needed)
      accent: "#9E9E9E",
      // Grey
      surface: "#F5F5F5"
    },
    physics: { viscosity: 1.5, cursor: "wait" },
    // Struggling to move
    typography: { casual: 0, slant: 5, weight: 700 },
    // Buffeting
    effects: { contrast: 60, blur: "4px", noise: 0.4, saturate: 0 }
    // Can't see anything
  },
  // --- 12. FLOOD (Spring Rising) ---
  "FLOOD": {
    label: "Sandbag Duty",
    colors: {
      bg: "#8D6E63",
      // Mud
      text: "#EFEBE9",
      // Light Sand
      accent: "#795548",
      // Darker Mud
      surface: "#A1887F"
    },
    physics: { viscosity: 3, cursor: "move" },
    // Trudging through water
    typography: { casual: 0.3, slant: -1, weight: 600 },
    effects: { contrast: 90, blur: "1px", noise: 0.1, saturate: 80 }
    // Murky
  },
  // Fallbacks...
  "DEEP_FREEZE": {
    label: "Deep Freeze",
    colors: { bg: "#263238", text: "#ECEFF1", accent: "#0288D1", surface: "#37474F" },
    physics: { viscosity: 2, cursor: "default" },
    typography: { casual: 0, slant: 0, weight: 700 },
    effects: { contrast: 120, blur: "0px", noise: 0.1, saturate: 80 }
  },
  "FALSE_SPRING": {
    label: "Fool's Spring",
    colors: { bg: "#FFFDE7", text: "#33691E", accent: "#C6FF00", surface: "#FFFFFF" },
    physics: { viscosity: 0.9, cursor: "default" },
    typography: { casual: 0.8, slant: 0, weight: 400 },
    effects: { contrast: 105, blur: "0px", noise: 0.02, saturate: 115 }
  }
};

const $$Astro$1 = createAstro();
const $$VibeInjector = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$VibeInjector;
  const { currentTheme, windSpeed } = Astro2.props;
  const config = THEMES[currentTheme] || THEMES["NORMAL"];
  const windForce = Math.min(windSpeed / 50, 1);
  const finalSlant = config.typography.slant - windForce * 10;
  const finalWeight = config.typography.weight + windForce * 100;
  const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E`;
  defineStyleVars([{
    "theme-bg": config.colors.bg,
    "theme-text": config.colors.text,
    "theme-accent": config.colors.accent,
    "theme-surface": config.colors.surface,
    "phys-viscosity": `${config.physics.viscosity}s`,
    "phys-cursor": config.physics.cursor,
    "type-casual": config.typography.casual,
    "type-slant": finalSlant,
    "type-weight": finalWeight,
    "fx-contrast": `${config.effects.contrast}%`,
    "fx-blur": config.effects.blur,
    "fx-noise": config.effects.noise,
    "fx-saturate": `${config.effects.saturate}%`,
    "noise-url": `url("${noiseSvg}")`
  }]);
  return renderTemplate`<!-- Import Recursive Font --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,MONO@-15..0,300..1000,0..1,0..1&display=swap" rel="stylesheet">`;
}, "/app/src/components/VibeInjector.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const { vibe } = Astro2.locals;
  const { viscosity, windForce, temp } = vibe.weather;
  const theme = vibe.theme;
  const tempMood = Math.min(Math.max((temp + 30) / 60, 0), 1);
  return renderTemplate`<html lang="en"${addAttribute(`--viscosity: ${viscosity}s; --wind-force: ${windForce}; --temp-mood: ${tempMood}; --primary-color: ${theme.palette.primary}; --contrast-level: ${theme.visuals.contrast}; --blur-amount: ${theme.visuals.blur};`, "style")}> <head>${renderComponent($$result, "VibeInjector", $$VibeInjector, { "currentTheme": theme, "windSpeed": windSpeed })}<meta charset="UTF-8"><meta name="description" content="Buvette Restaurant"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="theme-color"${addAttribute(theme.palette.primary, "content")}><title>${title} | Buvette</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Recursive:slnt,wght,CASL,MONO@-15..0,300..1000,0..1,0..1&display=swap" rel="stylesheet">${renderHead()}</head> <body${addAttribute(`font-mono text-stone-800 bg-stone-50 flex flex-col min-h-screen ${theme.mode}`, "class")}> <header class="py-6 border-b border-stone-200"> <div class="container mx-auto px-4 flex justify-between items-center"> <a href="/" class="text-3xl font-display font-bold tracking-tight">Buvette</a> <nav> <ul class="flex justify-center space-x-6 text-sm font-bold uppercase"> <li><a href="/" class="hover:bg-black hover:text-white px-1 transition-colors">Home</a></li> <li><a href="/menu" class="hover:bg-black hover:text-white px-1 transition-colors">Menu</a></li> <li><a href="/about" class="hover:bg-black hover:text-white px-1 transition-colors">About</a></li> </ul> </nav> </div></header> <main class="p-6 min-h-[400px]"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="p-6 border-t-2 border-dashed border-stone-900 relative"> <!-- Location & Hours Section (Moved from Home) --> <div class="grid grid-cols-2 gap-4 mb-8 text-[10px] uppercase"> <div> <h3 class="font-bold mb-1 border-b border-stone-300 inline-block">Location</h3> <p>42 Grove St</p> <p>New York, NY 10014</p> <p class="mt-2 text-[10px] underline cursor-pointer">Get Directions</p> </div> <div> <h3 class="font-bold mb-1 border-b border-stone-300 inline-block">Hours</h3> <div class="flex justify-between"> <span>M-F</span> <span>08:00-00:00</span> </div> <div class="flex justify-between"> <span>S-S</span> <span>09:00-00:00</span> </div> </div> </div> <div class="text-center"> <p class="font-bold uppercase text-lg mb-2">Thank You!</p> <p class="text-xs uppercase mb-2">Please Come Again</p> <p class="text-[10px] uppercase">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Buvette EST.</p> </div> <div class="mt-6 flex justify-center overflow-hidden"> <!-- Barcode simulation --> <div class="h-12 flex items-end gap-[2px]"> ${Array.from({ length: 50 }).map(() => renderTemplate`<div class="bg-black"${addAttribute({
    width: Math.random() > 0.5 ? "2px" : "4px",
    height: `${Math.floor(Math.random() * 60) + 40}%`
  }, "style")}></div>`)} </div> </div> </footer> <!-- Jagged bottom edge using CSS gradient --> <div class="absolute left-0 right-0 h-4"${addAttribute({
    bottom: "-16px",
    background: "linear-gradient(45deg, transparent 33.333%, #f5f5f4 33.333%, #f5f5f4 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #f5f5f4 33.333%, #f5f5f4 66.667%, transparent 66.667%)",
    backgroundSize: "20px 40px",
    backgroundPosition: "0 -20px"
  }, "style")}></div> <main class="flex-grow container mx-auto px-4 py-8"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="bg-stone-900 text-stone-100 py-12"> <div class="container mx-auto px-4 text-center"> <p class="font-display text-xl mb-4">Buvette</p> <p class="text-stone-400 text-sm mb-2">The Forks Market, Winnipeg, MB</p> <p class="text-stone-400 text-sm">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Buvette. All rights reserved.</p> </div> </footer> </body></html>`;
}, "/app/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
