import { defaultColors, defaultComponents, defaultLayout, defaultTypography, typographyStyle } from "./design-system.js";

type ThemeInput = Record<string, any>;
type ProjectLike = { published?: boolean; order?: number; publishedAt?: string | Date; slug: string; [key: string]: any };
type CategoryLike = { visible?: boolean; order?: number; name: string; slug: string; [key: string]: any };

const shadowValue = (shadow: string) =>
  shadow === "strong" ? "0 20px 45px rgb(0 0 0 / .18)" : shadow === "none" ? "none" : "0 12px 30px rgb(24 24 27 / .10)";

export function normalizeTheme(theme: ThemeInput = {}) {
  return {
    colors: { ...defaultColors, ...(theme.colors || {}) },
    typography: {
      hero: { ...defaultTypography.hero, ...(theme.typography?.hero || {}) },
      section: { ...defaultTypography.section, ...(theme.typography?.section || {}) },
      body: { ...defaultTypography.body, ...(theme.typography?.body || {}) },
      caption: { ...defaultTypography.caption, ...(theme.typography?.caption || {}) },
    },
    layout: { ...defaultLayout, ...(theme.layout || {}) },
    components: { ...defaultComponents, ...(theme.components || {}) },
    aboutLayout: { contentWidth: 720, portraitSize: 160, ...(theme.aboutLayout || {}) },
    showContactLink: theme.showContactLink !== false,
    showFooter: theme.showFooter !== false,
    footerText: theme.footerText || "",
    footerLinks: Array.isArray(theme.footerLinks) ? theme.footerLinks : [],
  };
}

export function siteCssVariables(rawTheme: ThemeInput = {}): Record<string, string> {
  const theme = normalizeTheme(rawTheme);
  const hero = typographyStyle(theme.typography.hero);
  const section = typographyStyle(theme.typography.section);
  const body = typographyStyle(theme.typography.body);
  const caption = typographyStyle(theme.typography.caption);

  const density = theme.layout.density === "compact" ? 0.75 : 1;
  const thumbnailRatio = theme.layout.thumbnailRatio === "square" ? "1 / 1" : theme.layout.thumbnailRatio === "wide" ? "16 / 9" : "auto";
  const desktopColumns = Math.min(4, Math.max(1, theme.layout.columns));
  const tabletColumns = Math.min(2, desktopColumns);

  return {
    "--color-bg": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-text": theme.colors.text,
    "--color-muted": theme.colors.mutedText,
    "--color-heading": theme.colors.heading,
    "--color-link": theme.colors.link,
    "--color-border": theme.colors.border,
    "--color-button": theme.colors.button,
    "--color-accent": theme.colors.accent,
    "--layout-container": `${theme.layout.container}px`,
    "--layout-gutter": `${Math.max(16, Math.round(theme.layout.gutter * density))}px`,
    "--layout-section-gap": `${Math.max(48, Math.round(theme.layout.sectionGap * density))}px`,
    "--layout-card-gap": `${Math.max(12, Math.round(theme.layout.cardGap * density))}px`,
    "--grid-mobile-columns": String(theme.layout.mobileColumns),
    "--grid-tablet-columns": String(tabletColumns),
    "--grid-desktop-columns": String(desktopColumns),
    "--card-content-padding": theme.layout.density === "compact" ? "0.7rem" : "1rem",
    "--card-thumbnail-ratio": thumbnailRatio,
    "--radius": `${theme.components.radius}px`,
    "--border-width": `${theme.components.borderWidth}px`,
    "--shadow": shadowValue(theme.components.shadow),
    "--card-media-fit": theme.layout.thumbnailRatio === "original" ? "contain" : "cover",
    "--card-image-height": theme.layout.thumbnailRatio === "original" ? "auto" : "100%",
    "--font-hero": hero.family,
    "--font-section": section.family,
    "--font-body": body.family,
    "--font-caption": caption.family,
    "--size-hero": hero.size,
    "--weight-hero": String(hero.weight),
    "--leading-hero": String(hero.lineHeight),
    "--tracking-hero": hero.tracking,
    "--size-section": section.size,
    "--weight-section": String(section.weight),
    "--leading-section": String(section.lineHeight),
    "--tracking-section": section.tracking,
    "--size-body": body.size,
    "--weight-body": String(body.weight),
    "--leading-body": String(body.lineHeight),
    "--tracking-body": body.tracking,
    "--size-caption": caption.size,
    "--weight-caption": String(caption.weight),
    "--leading-caption": String(caption.lineHeight),
    "--tracking-caption": caption.tracking,
    "--about-width": `${theme.aboutLayout.contentWidth}px`,
    "--portrait-size": `${theme.aboutLayout.portraitSize}px`,
  };
}

export function siteCssText(theme: ThemeInput = {}) {
  return Object.entries(siteCssVariables(theme)).map(([name, value]) => `${name}:${value};`).join("");
}

export function visibleCategories<T extends CategoryLike>(categories: T[]): T[] {
  return categories
    .filter((category) => category.visible !== false)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.name.localeCompare(right.name, "pt-BR"));
}

export function publishedProjects<T extends ProjectLike>(projects: T[]): T[] {
  return projects
    .filter((project) => project.published)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0) || new Date(right.publishedAt ?? 0).getTime() - new Date(left.publishedAt ?? 0).getTime());
}

export function categoryLabel(categories: CategoryLike[], slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? slug.replace(/[-_]+/g, " ");
}

export function selectedProjects<T extends ProjectLike>(projects: T[], slugs: string[] = [], featured = false, limit?: number): T[] {
  const selected = slugs.length
    ? slugs.map((slug) => projects.find((project) => project.slug === slug)).filter((project): project is T => Boolean(project))
    : featured ? projects.filter((project) => project.featured) : projects;
  return typeof limit === "number" ? selected.slice(0, limit) : selected;
}
