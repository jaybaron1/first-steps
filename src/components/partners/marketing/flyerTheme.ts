/**
 * Shared visual system for all partner flyers.
 * Palette inspired by Margarita's partner deck — cream paper, navy ink, warm gold accent.
 */

export const FLYER_THEME = {
  paper: "#F5EFE0",        // warm cream
  paperEdge: "#EFE7D2",    // slightly deeper cream for footer band
  ink: "#1F3A5F",          // deep navy
  inkSoft: "#3F5878",      // softer navy for sub-text
  accent: "#B8956C",       // warm gold (brand)
  accentSoft: "#C9A984",
  body: "#4A4536",         // soft umber for italic body
  bodyMuted: "#7A7460",
  hairline: "#D9CFB8",
  hairlineSoft: "#E5DDC8",
} as const;

export const FLYER_FONTS = {
  display: "'Playfair Display', Georgia, serif",
  body: "'Inter', system-ui, sans-serif",
} as const;

/** Common label style — letter-spaced caps in gold. */
export const labelCaps = (color = FLYER_THEME.accent): React.CSSProperties => ({
  fontSize: 9,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  fontWeight: 600,
  color,
  margin: 0,
  fontFamily: FLYER_FONTS.body,
});

import type React from "react";
