import React from "react";

const LOGO_SRC = "/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png";

interface Props {
  color?: string;
  size?: number;
  showWordmark?: boolean;
  invert?: boolean;
}

/**
 * Small Galavanteer brand lockup for flyer footers.
 * - Logo image + "Galavanteer · The Roundtable" wordmark.
 */
const GalavanteerMark: React.FC<Props> = ({ color = "#0f172a", size = 22, showWordmark = true, invert = false }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
    <img
      src={LOGO_SRC}
      alt="Galavanteer"
      crossOrigin="anonymous"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        filter: invert ? "brightness(0) invert(1)" : "none",
      }}
    />
    {showWordmark && (
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color,
          fontWeight: 700,
        }}
      >
        Galavanteer · The Roundtable
      </span>
    )}
  </div>
);

export default GalavanteerMark;
