import { defineMiddleware } from 'astro/middleware';
import { getWinnipegContext } from './utils/vibeEngine';

export const onRequest = defineMiddleware(async (context, next) => {
    const vibe = await getWinnipegContext();
    context.locals.vibe = vibe;
    return next();
});
