import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export async function generateQrDataUrl(url: string, color = "#0f172a"): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 0,
    width: 512,
    color: { dark: color, light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
}

/**
 * Render a flyer DOM node to a single-page PDF and trigger download.
 * Page format keys off the element's `data-flyer-size` attribute ("letter" | "a4").
 */
export async function exportFlyerToPdf(element: HTMLElement, filename: string) {
  const size = (element.getAttribute("data-flyer-size") as "letter" | "a4" | null) ?? "a4";
  const isLetter = size === "letter";

  // Clone the flyer into an off-screen container at NATIVE size so the preview
  // wrapper's transform: scale() doesn't distort or corrupt the capture.
  const nativeWidth = isLetter ? 816 : 794;   // px @ 96dpi
  const nativeHeight = isLetter ? 1056 : 1123;

  const stage = document.createElement("div");
  stage.style.position = "fixed";
  stage.style.left = "-10000px";
  stage.style.top = "0";
  stage.style.width = `${nativeWidth}px`;
  stage.style.height = `${nativeHeight}px`;
  stage.style.background = "#ffffff";
  stage.style.zIndex = "-1";
  stage.style.pointerEvents = "none";

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.width = `${nativeWidth}px`;
  clone.style.height = `${nativeHeight}px`;
  stage.appendChild(clone);
  document.body.appendChild(stage);

  try {
    // Wait one frame so cloned <img> tags have a chance to be picked up
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      width: nativeWidth,
      height: nativeHeight,
      windowWidth: nativeWidth,
      windowHeight: nativeHeight,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: isLetter ? "letter" : "a4",
    });
    if (isLetter) {
      pdf.addImage(imgData, "JPEG", 0, 0, 215.9, 279.4, undefined, "FAST");
    } else {
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }
    pdf.save(filename);
  } finally {
    document.body.removeChild(stage);
  }
}

export const PARTNER_REFERRAL_BASE = "https://galavanteer.lovable.app/r";

export function buildReferralUrl(slug: string | null | undefined): string {
  if (!slug) return "https://galavanteer.lovable.app";
  return `${PARTNER_REFERRAL_BASE}/${slug}`;
}

/** URL the QR code should encode — opens the lead capture form directly. */
export function buildReferralCaptureUrl(slug: string | null | undefined): string {
  if (!slug) return "https://galavanteer.lovable.app";
  return `${PARTNER_REFERRAL_BASE}/${slug}/connect`;
}
