/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CH2CU_Hd.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D-A06w7E.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { vibe } = Astro2.locals;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home", "useDefaultContainer": false }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex flex-col md:flex-row min-h-screen"> <!-- LEFT COLUMN: Hero Video (Sticky on Desktop) --> <!-- On Desktop, this takes 50% width and is sticky to the top of the viewport. --> <!-- On Mobile, this is just a block at the top. --> <div class="w-full md:w-1/2 h-[60vh] md:h-screen md:sticky md:top-0 relative overflow-hidden bg-stone-900 border-b md:border-b-0 md:border-r border-stone-200"> <!-- Video Container with Parallax Hook --> <div class="parallax-video-container absolute inset-0 w-full h-full z-0"> <!--
                 PLACEHOLDER VIDEO STRATEGY:
                 1. We use a high-quality 'poster' image (Unsplash) that loads immediately.
                 2. We try to load a video. If it fails or doesn't exist, the poster remains.
                 3. We add a generic opacity overlay to ensure text readability.
               --> <video class="w-full h-full object-cover opacity-60 transition-transform duration-100 ease-linear will-change-transform" autoplay loop muted playsinline poster="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80"> <!-- Replace the src below with your actual video file path in public/ e.g., src="/videos/kitchen-ambience.mp4" --> <source src="/kitchen-loop.mp4" type="video/mp4"> </video> </div> <!-- Hero Content Overlay --> <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 text-stone-50 pointer-events-none"> <h1 class="hero-text text-6xl md:text-8xl font-display font-bold mb-4 drop-shadow-md">Buvette</h1> <p class="text-xl md:text-2xl font-light tracking-wide drop-shadow-sm max-w-md">
Inspired by European traditions.
</p> </div> </div> <!-- RIGHT COLUMN: Scrollable Content --> <div class="w-full md:w-1/2 bg-stone-50"> <!-- Content Container --> <div class="p-8 md:p-16 md:py-32 flex flex-col justify-center min-h-[50vh] space-y-16"> <!-- Introduction --> <div class="text-center md:text-left space-y-8"> <p class="text-2xl md:text-3xl font-light leading-relaxed text-stone-800">
Dedicated to the joy of <span class="italic font-display">eating</span> and <span class="italic font-display">drinking</span>.
</p> <p class="text-stone-600 font-mono text-sm leading-7 max-w-prose">
Buvette is a place to gather, to share, and to enjoy the simple pleasures of life.
                       Our menu reflects the changing seasons and the best ingredients we can find.
</p> <div> <a href="/menu" class="inline-block bg-stone-900 text-stone-50 px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-stone-700 hover:scale-105 transition-all duration-300">
View Menu
</a> </div> </div> <!-- Hours & Location Grid --> <div class="grid grid-cols-1 xl:grid-cols-2 gap-8"> <div class="bg-white p-8 shadow-sm border border-stone-200 hover:border-stone-900 transition-colors"> <h2 class="font-display text-2xl mb-4">Hours</h2> <p class="mb-1"><strong>Mon - Fri:</strong> 8am - 12am</p> <p class="mb-1"><strong>Sat - Sun:</strong> 9am - 12am</p> <p class="mt-4 italic text-xs text-stone-500">Walk-ins always welcome.</p> </div> <div class="bg-white p-8 shadow-sm border border-stone-200 hover:border-stone-900 transition-colors"> <h2 class="font-display text-2xl mb-4">Location</h2> <p class="mb-1">The Forks Market</p> <p class="mb-1">Winnipeg, MB</p> <p class="mt-4"><a href="#" class="underline text-stone-600 hover:text-stone-900">Get Directions &rarr;</a></p> </div> </div> <!-- Vibe Engine Debug (Preserved) --> <div class="weather-display bg-stone-200 p-6 font-mono text-xs border border-stone-300 opacity-70 hover:opacity-100 transition-opacity"> <h3 class="font-display text-lg mb-4">Vibe Engine Debug</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <p><strong>Temp:</strong> <span class="temp-number">${vibe.weather.temp}°C</span></p> <p><strong>Wind:</strong> ${vibe.weather.windForce.toFixed(2)}</p> <p><strong>Viscosity:</strong> ${vibe.weather.viscosity.toFixed(2)}s</p> </div> <div> <p><strong>Theme:</strong> ${vibe.theme.id}</p> <p><strong>Season:</strong> ${vibe.temporal.seasonBias}</p> </div> </div> <details class="mt-4"> <summary class="cursor-pointer font-bold">Raw Context</summary> <pre class="mt-2 text-[10px] overflow-x-auto p-2 bg-stone-100">${JSON.stringify(vibe, null, 2)}</pre> </details> </div> </div> </div> </div> ` })} ${renderScript($$result, "/app/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/src/pages/index.astro", void 0);

const $$file = "/app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
