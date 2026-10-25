# Cinematic developer portfolio

Build a polished, responsive portfolio for Nisha Bharti at the home page, using the uploaded brief as the source of truth. No reference image was included, so create the described cinematic space-launch composition from its written specification.

## What will be built
- A dark starfield opening with a layered shuttle-launch illustration, pink/lavender light, editorial headline, navigation, mobile menu, and featured-project links.
- A custom accessible cat cursor on pointer devices, reduced-motion support, replay/skip intro controls, and subtle reveal/parallax motion.
- About, skills, project case studies, experience, achievements, contact, and footer sections using only the supplied facts and verified links.
- A validated contact form that opens a prefilled email because no message-sending service is configured; no false send-success claim.
- Unique metadata for the home page, semantic design tokens, and responsive behavior.

## Technical approach
- Implement the portfolio in `src/routes/index.tsx` and establish the visual system in `src/styles.css`.
- Use a generated cinematic space asset as one visual layer, with independent CSS/React rocket and exhaust animation layers; keep important text as real HTML.
- Keep data, navigation, form behavior, accessibility, and motion contained in the home page; avoid adding unnecessary libraries or routes.
- Verify the home-page flow, responsive rendering, route metadata, tests, and preview build status.
