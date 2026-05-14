import React from "react";

/**
 * A4 page wrapper sized in pixels (210 × 297 mm at ~96 DPI).
 * Render at full size off-screen for PDF export, or scale via parent transform for preview.
 */
const FlyerFrame = React.forwardRef<HTMLDivElement, { children: React.ReactNode; id?: string }>(
  ({ children, id }, ref) => (
    <div
      ref={ref}
      id={id}
      style={{
        width: "794px",
        height: "1123px",
        background: "#ffffff",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#0f172a",
      }}
    >
      {children}
    </div>
  ),
);
FlyerFrame.displayName = "FlyerFrame";

export default FlyerFrame;
