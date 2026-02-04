import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import visitorTracking from "@/lib/visitorTracking";

// Make tracking globally available for manual event tracking
declare global {
  interface Window {
    galavanteerTracking: typeof visitorTracking;
  }
}

window.galavanteerTracking = visitorTracking;

// Tracking starts automatically when visitorTracking is imported!
console.log("✅ Galavanteer visitor tracking initialized");

// Rebuild v2
createRoot(document.getElementById("root")!).render(<App />);
