import React from "react";

/**
 * Page wrapper sized in pixels @ 96 DPI.
 * - a4:     210 × 297 mm  → 794 × 1123 px
 * - letter: 8.5 × 11 in   → 816 × 1056 px
 */
type Size = "a4" | "letter";

const DIMS: Record<Size, { w: number; h: number }> = {
  a4: { w: 794, h: 1123 },
  letter: { w: 816, h: 1056 },
};

const FlyerFrame = React.forwardRef<HTMLDivElement, { children: React.ReactNode; id?: string; size?: Size }>(
  ({ children, id, size = "a4" }, ref) => {
    const { w, h } = DIMS[size];
    return (
      <div
        ref={ref}
        id={id}
        data-flyer-size={size}
        style={{
          width: `${w}px`,
          height: `${h}px`,
          background: "#ffffff",
          overflow: "hidden",
          position: "relative",
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "#0f172a",
        }}
      >
        {children}
      </div>
    );
  },
);
FlyerFrame.displayName = "FlyerFrame";

export default FlyerFrame;
export const FLYER_DIMS = DIMS;
