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
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const isLetter = size === "letter";
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: isLetter ? "letter" : "a4",
  });
  if (isLetter) {
    // 8.5 × 11 in → 215.9 × 279.4 mm
    pdf.addImage(imgData, "JPEG", 0, 0, 215.9, 279.4, undefined, "FAST");
  } else {
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
  }
  pdf.save(filename);
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
