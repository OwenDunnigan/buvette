/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_WahAFePi.mjs';
import { $ as $$Layout } from '../chunks/Layout_C1GYdvZ9.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="text-center mb-8 pb-4 border-b-2 border-black border-dashed"> <h1 class="text-3xl font-bold uppercase tracking-[0.2em]">About Us</h1> <p class="text-[10px] uppercase mt-2">Est. 2024</p> </div> <div class="font-mono text-sm space-y-6 text-justify uppercase"> <p>
Buvette is a celebration of the European tradition of "eating and drinking."
      We are dedicated to the joy of gathering, serving fresh, seasonal ingredients
      prepared with simplicity and heart.
</p> <div class="border-l-2 border-black pl-4 italic normal-case">
"It's not just about the food, it's about the moment."
</div> <p>
Our menu changes daily, reflecting the best of what the market has to offer.
      From our morning espressos to our late-night cocktails, everything is crafted
      with care.
</p> </div> <div class="mt-8 text-center"> <div class="inline-block border-2 border-black p-2 rotate-2"> <p class="text-xs font-bold">Chef's Table</p> <p class="text-[10px]">Available by request</p> </div> </div> ` })}`;
}, "/app/src/pages/about.astro", void 0);

const $$file = "/app/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
