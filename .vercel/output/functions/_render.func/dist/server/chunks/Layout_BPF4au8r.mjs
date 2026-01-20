import { e as createComponent, f as createAstro, h as addAttribute, l as renderHead, n as renderSlot, r as renderTemplate } from './astro/server_gaODcwwG.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const { vibe } = Astro2.locals;
  const { viscosity, windForce, temp } = vibe.weather;
  const theme = vibe.theme;
  const tempMood = Math.min(Math.max((temp + 30) / 60, 0), 1);
  return renderTemplate`<html lang="en"${addAttribute(`--viscosity: ${viscosity}s; --wind-force: ${windForce}; --temp-mood: ${tempMood}; --primary-color: ${theme.palette.primary}; --contrast-level: ${theme.visuals.contrast}; --blur-amount: ${theme.visuals.blur};`, "style")}> <head><meta charset="UTF-8"><meta name="description" content="Buvette Restaurant"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="theme-color"${addAttribute(theme.palette.primary, "content")}><title>${title} | Buvette</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Recursive:slnt,wght,CASL,MONO@-15..0,300..1000,0..1,0..1&display=swap" rel="stylesheet">${renderHead()}</head> <body${addAttribute(`font-mono text-stone-800 bg-stone-50 flex flex-col min-h-screen ${theme.mode}`, "class")}> <header class="py-6 border-b border-stone-200"> <div class="container mx-auto px-4 flex justify-between items-center"> <a href="/" class="text-3xl font-display font-bold tracking-tight">Buvette</a> <nav> <ul class="flex space-x-6 text-sm font-medium uppercase tracking-widest"> <li><a href="/" class="hover:text-stone-500 transition-colors">Home</a></li> <li><a href="/menu" class="hover:text-stone-500 transition-colors">Menu</a></li> </ul> </nav> </div> </header> <main class="flex-grow container mx-auto px-4 py-8"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="bg-stone-900 text-stone-100 py-12"> <div class="container mx-auto px-4 text-center"> <p class="font-display text-xl mb-4">Buvette</p> <p class="text-stone-400 text-sm mb-2">The Forks Market, Winnipeg, MB</p> <p class="text-stone-400 text-sm">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Buvette. All rights reserved.</p> </div> </footer> </body></html>`;
}, "/app/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
