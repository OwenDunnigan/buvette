import { defineMiddleware } from 'astro/middleware';
import { getWinnipegContext } from './utils/vibeEngine';
import { THEMES, type ThemeKey } from './themes';

export const onRequest = defineMiddleware(async (context, next) => {
    const rawVibe = await getWinnipegContext();

    // Shallow clone to avoid mutating the shared cache
    const vibe = { ...rawVibe };

    const themeOverride = context.url.searchParams.get('theme');
    if (themeOverride && themeOverride in THEMES) {
        vibe.theme = THEMES[themeOverride as ThemeKey];
    }

    context.locals.vibe = vibe;
    return next();
});
