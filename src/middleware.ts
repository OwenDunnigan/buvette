import { defineMiddleware } from 'astro:middleware';
import { deriveTheme } from './utils/vibe';

import type { ThemeKey } from './themes';

export const onRequest = defineMiddleware((context, next) => {
    const vibe = deriveTheme();

    let theme = vibe.theme;
    let windSpeed = vibe.windSpeed;

    // Allow override via query params for debugging/testing
    const url = new URL(context.request.url);
    const themeOverride = url.searchParams.get('theme');
    if (themeOverride) {
        theme = themeOverride as ThemeKey;
    }

    // Inject into locals so pages/layouts can access it
    context.locals.theme = theme;
    context.locals.windSpeed = windSpeed;

    return next();
});
