export const hexPattern = /^#[0-9A-Fa-f]{6}$/;

export const defaultColors = {
  background: "#FFFFFF", surface: "#F4F4F5", text: "#18181B", mutedText: "#52525B",
  heading: "#09090B", link: "#6D28D9", border: "#D4D4D8", button: "#18181B", accent: "#8B5CF6",
} as const;

export const defaultTypography = {
  hero: { family: "sans", size: 72, weight: 700, lineHeight: 0.98, letterSpacing: -0.06 },
  section: { family: "sans", size: 42, weight: 650, lineHeight: 1.05, letterSpacing: -0.035 },
  body: { family: "sans", size: 18, weight: 400, lineHeight: 1.6, letterSpacing: 0 },
  caption: { family: "sans", size: 13, weight: 600, lineHeight: 1.35, letterSpacing: 0.08 },
} as const;

export const defaultLayout = { container: 1280, columns: 3, cardGap: 24, sectionGap: 96, gutter: 32 } as const;
export const defaultComponents = { radius: 20, borderWidth: 1, shadow: "soft" } as const;

function luminance(hex: string) {
  const values = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const [r, g, b] = values.map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(first: string, second: string) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

export function contrastMessage(foreground: string, background: string, label: string, minimum = 4.5) {
  const ratio = contrastRatio(foreground, background);
  return ratio >= minimum ? undefined : `${label}: contraste ${ratio.toFixed(2)}:1; mínimo exigido ${minimum}:1. Escureça o primeiro token ou clareie o segundo.`;
}

export function typographyStyle(item: { family: string; size: number; weight: number; lineHeight: number; letterSpacing: number }) {
  const family = item.family === "serif" ? "Georgia, serif" : item.family === "mono" ? "ui-monospace, monospace" : "system-ui, sans-serif";
  return { family, size: `clamp(${Math.round(item.size * 0.68)}px, ${item.size / 1440 * 100}vw, ${item.size}px)`, weight: item.weight, lineHeight: item.lineHeight, tracking: `${item.letterSpacing}em` };
}
