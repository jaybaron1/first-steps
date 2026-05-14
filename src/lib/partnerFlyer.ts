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
 * Render an A4-sized DOM node to a single-page PDF and trigger download.
 * The element should be sized to A4 (210 × 297 mm at 96 DPI ≈ 794 × 1123 px).
 */
export async function exportFlyerToPdf(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
  pdf.save(filename);
}

export const PARTNER_REFERRAL_BASE = "https://galavanteer.lovable.app/r";

export function buildReferralUrl(slug: string | null | undefined): string {
  if (!slug) return "https://galavanteer.lovable.app";
  return `${PARTNER_REFERRAL_BASE}/${slug}`;
}
