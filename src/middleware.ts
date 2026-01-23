import { defineMiddleware } from 'astro/middleware';
import { getWinnipegContext } from './utils/vibeEngine';
import { THEMES, type ThemeKey } from './themes';

export const onRequest = defineMiddleware(async (context, next) => {
    // Parse mockTemp from URL
    const mockTempStr = context.url.searchParams.get('mockTemp');
    const mockTemp = mockTempStr ? parseFloat(mockTempStr) : undefined;

    const vibe = await getWinnipegContext({ temp: mockTemp });

    const themeOverride = context.url.searchParams.get('theme');
    if (themeOverride && themeOverride in THEMES) {
        vibe.theme = THEMES[themeOverride as ThemeKey];
    }

    context.locals.vibe = vibe;
    return next();
});
