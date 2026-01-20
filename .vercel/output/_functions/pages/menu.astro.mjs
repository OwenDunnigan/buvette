/* empty css                                 */
import { e as createComponent, f as createAstro, m as maybeRenderHead, r as renderTemplate, k as renderComponent } from '../chunks/astro/server_WahAFePi.mjs';
import { $ as $$Layout } from '../chunks/Layout_D9C_BpK-.mjs';
import 'clsx';
import Papa from 'papaparse';
import fs from 'node:fs';
import nodePath from 'node:path';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$MenuItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$MenuItem;
  const { name, description, price } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="mb-6 break-inside-avoid"> <div class="flex justify-between items-baseline mb-1 border-b border-stone-200 pb-1 border-dotted"> <h3 class="text-lg font-display font-semibold text-stone-900">${name}</h3> <span class="text-base font-medium ml-4 text-stone-700">${price}</span> </div> ${description && renderTemplate`<p class="text-[10px] text-stone-500 mt-1 uppercase leading-tight max-w-[90%]">${description}</p>`} </div>`;
}, "/app/src/components/MenuItem.astro", void 0);

const $$Astro = createAstro();
const $$MenuSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MenuSection;
  const { title, items } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="mb-12"> <div class="text-center mb-8"> <h2 class="text-2xl font-display font-bold uppercase tracking-widest inline-block border-b-2 border-stone-300 pb-2">${title}</h2> </div> <div class="flex flex-col"> ${items.map((item) => renderTemplate`${renderComponent($$result, "MenuItem", $$MenuItem, { "name": item.Name, "description": item.Description, "price": item.Price })}`)} </div> </section>`;
}, "/app/src/components/MenuSection.astro", void 0);

async function getMenuData() {
  let csvText = "";
  {
    try {
      console.log("No MENU_CSV_URL provided, reading from public/menu.csv");
      const localPath = nodePath.resolve("./public/menu.csv");
      csvText = fs.readFileSync(localPath, "utf-8");
    } catch (error) {
      console.error("Error reading local CSV:", error);
      return {};
    }
  }
  const { data, errors } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  if (errors.length > 0) {
    console.warn("CSV Parsing errors:", errors);
  }
  const grouped = data.reduce((acc, item) => {
    const category = item.Category?.trim();
    if (category) {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
    }
    return acc;
  }, {});
  return grouped;
}

const $$Menu = createComponent(async ($$result, $$props, $$slots) => {
  const menuData = await getMenuData();
  const categories = Object.keys(menuData);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Menu" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-display font-bold mb-4">Menu</h1> <p class="text-stone-500 italic">Seasonal & Fresh</p> </div> ${categories.length > 0 ? categories.map((category) => renderTemplate`${renderComponent($$result2, "MenuSection", $$MenuSection, { "title": category, "items": menuData[category] })}`) : renderTemplate`<div class="text-center py-12"> <p class="text-sm uppercase border-2 border-black inline-block px-4 py-2">No menu items found</p> </div>`}<div class="mt-12 pt-4 border-t-4 border-double border-black flex justify-between items-end uppercase font-bold"> <div class="text-left"> <p class="text-[10px] font-normal">Service Charge</p> <p class="text-[10px] font-normal">Tax</p> <p class="text-lg mt-1">Total</p> </div> <div class="text-right"> <p class="text-[10px] font-normal">Included</p> <p class="text-[10px] font-normal">Included</p> <p class="text-lg mt-1">$ Priceless</p> </div> </div> ` })}`;
}, "/app/src/pages/menu.astro", void 0);

const $$file = "/app/src/pages/menu.astro";
const $$url = "/menu";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Menu,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
