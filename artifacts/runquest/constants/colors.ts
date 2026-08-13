/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // RunQuest identity: midnight route map + electric trail + warm reward accents
    text: '#F4F7F2',
    tint: '#C7F36B',

    // Core surfaces
    background: '#0B1020',
    foreground: '#F4F7F2',

    // Cards / elevated surfaces
    card: '#131B31',
    cardForeground: '#F4F7F2',

    // Primary action color (buttons, links, active states)
    primary: '#C7F36B',
    primaryForeground: '#0B1020',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#202A45',
    secondaryForeground: '#F4F7F2',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#1A2540',
    mutedForeground: '#94A0B8',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#FF7A63',
    accentForeground: '#0B1020',

    // Destructive actions (delete, error states)
    destructive: '#FF6B6B',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#293552',
    input: '#293552',
  },

  dark: {
    text: '#F4F7F2',
    tint: '#C7F36B',
    background: '#0B1020',
    foreground: '#F4F7F2',
    card: '#131B31',
    cardForeground: '#F4F7F2',
    primary: '#C7F36B',
    primaryForeground: '#0B1020',
    secondary: '#202A45',
    secondaryForeground: '#F4F7F2',
    muted: '#1A2540',
    mutedForeground: '#94A0B8',
    accent: '#FF7A63',
    accentForeground: '#0B1020',
    destructive: '#FF6B6B',
    destructiveForeground: '#FFFFFF',
    border: '#293552',
    input: '#293552',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
