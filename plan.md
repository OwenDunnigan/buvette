1. **Add `PRIDE` theme to `src/themes.ts`**
   - Add `PRIDE` to `ThemeKey`.
   - Add `PRIDE` theme config in `THEMES`. The default colors will be calm, but the injected CSS will handle the animation. To avoid it being overwhelming, the base background colors will be a bit muted/pastel, but the animation will still rotate.
2. **Add Pride to `src/utils/holidays.ts`**
   - Add a range holiday for Pride month (June 1 - 30). Name: `Pride Month`, theme: `PRIDE`.
3. **Add Pride Message to `src/utils/tempColors.ts`**
   - Add a grand, professional message: "Happy Pride Month! 🏳️‍🌈✨ Wishing you a beautiful and joyful June. We are so proud to celebrate our vibrant community."
4. **Implement Text Color Transition and Gradient Title**
   - In `src/components/VibeInjector.astro`, add CSS for `.theme-PRIDE`.
   - The hero text `.hero-text` gets a background clip text with the progress pride flag gradient.
   - For the background and text color transition, we will use a keyframe animation that slowly crossfades the background and text colors (using muted/pastel versions of the rainbow so it's not gaudy, while still honoring the colors: Red, Orange, Yellow, Green, Blue, Purple).
   - `background-color` and `color` can be animated directly in CSS.
5. **Verify and Pre-commit**
