import React from "react";

interface Props {
  src: string;
  imageStyle?: "photo" | "logo";
  /** Bounding box for the image. Photos render as a circle of size×size. Logos fit-contain inside this box. */
  size: number;
  /** Optional border color for photo mode. */
  borderColor?: string;
  /** Logos can render up to this multiple of `size` in width to accommodate wide marks. */
  logoWidthMultiplier?: number;
  style?: React.CSSProperties;
}

/**
 * Renders a partner's photo (circular crop) or logo (contained within a flexible box).
 * Lets wide rectangular logos display at their natural aspect ratio without distortion.
 */
const FlyerBrandImage: React.FC<Props> = ({
  src,
  imageStyle = "photo",
  size,
  borderColor,
  logoWidthMultiplier = 2.6,
  style,
}) => {
  if (imageStyle === "logo") {
    return (
      <img
        src={src}
        crossOrigin="anonymous"
        style={{
          maxHeight: size,
          maxWidth: size * logoWidthMultiplier,
          width: "auto",
          height: "auto",
          objectFit: "contain",
          display: "block",
          ...style,
        }}
      />
    );
  }
  return (
    <img
      src={src}
      crossOrigin="anonymous"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: borderColor ? `2px solid ${borderColor}` : undefined,
        display: "block",
        ...style,
      }}
    />
  );
};

export default FlyerBrandImage;
