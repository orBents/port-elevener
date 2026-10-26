import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { contrastMessage, defaultColors, defaultComponents, defaultLayout, defaultTypography, hexPattern } from "./lib/design-system";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use letras minúsculas, números e hífens.");
const urlOrPath = z.string().refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Use uma URL pública ou um arquivo enviado pelo painel.");
const videoUrl = z.string().url().refine((value) => /(?:youtube\.com|youtu\.be|vimeo\.com)/.test(value), "Use uma URL pública do YouTube ou Vimeo.");
const mediaItem = z.discriminatedUnion("type", [
  z.object({ type: z.literal("image"), source: urlOrPath, alt: z.string().optional(), caption: z.string().optional() }),
  z.object({ type: z.literal("gif"), source: urlOrPath, alt: z.string().optional(), caption: z.string().optional() }),
  z.object({ type: z.literal("youtube"), source: videoUrl, caption: z.string().optional() }),
  z.object({ type: z.literal("vimeo"), source: videoUrl, caption: z.string().optional() }),
]);
const linkItem = z.object({ label: z.string().min(1), url: z.string().url() });
const hex = z.string().regex(hexPattern, "Use uma cor HEX no formato #RRGGBB.");
const typeStyle = z.object({ family: z.enum(["sans", "serif", "mono"]), size: z.number().min(12).max(112), weight: z.number().int().min(300).max(800), lineHeight: z.number().min(0.9).max(2), letterSpacing: z.number().min(-0.1).max(0.2) });
const sectionBase = { visible: z.boolean().default(true), title: z.string().max(120).optional(), eyebrow: z.string().max(80).optional(), alignment: z.enum(["start", "center"]).default("start") };
const homeSection = z.discriminatedUnion("type", [
  z.object({ type: z.literal("gallery"), ...sectionBase, categories: z.array(slug).default([]), limit: z.number().int().min(1).max(24).default(8) }),
  z.object({ type: z.literal("featured"), ...sectionBase, projects: z.array(slug).default([]), limit: z.number().int().min(1).max(12).default(4) }),
  z.object({ type: z.literal("categories"), ...sectionBase, categories: z.array(slug).default([]) }),
  z.object({ type: z.literal("editorial"), ...sectionBase, content: z.string().min(1), tone: z.enum(["plain", "surface"]).default("plain") }),
  z.object({ type: z.literal("image"), ...sectionBase, image: urlOrPath, alt: z.string().min(1), caption: z.string().optional(), fit: z.enum(["contain", "cover"]).default("contain") }),
  z.object({ type: z.literal("video"), ...sectionBase, provider: z.enum(["youtube", "vimeo"]), url: videoUrl, caption: z.string().optional() }),
  z.object({ type: z.literal("cta"), ...sectionBase, content: z.string().min(1), buttonLabel: z.string().min(1).max(60), buttonUrl: z.string().refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Use um link interno iniciado por / ou uma URL https://.") }),
]);

const projects = defineCollection({
  loader: glob({ base: "./src/data/projects", pattern: "**/*.md" }),
  schema: z.object({ title: z.string().min(1), slug, category: slug, summary: z.string().min(1), published: z.boolean().default(false), featured: z.boolean().default(false), order: z.number().int().min(0).default(0), publishedAt: z.coerce.date(), cover: urlOrPath.optional(), media: z.array(mediaItem).default([]) }),
});

const categories = defineCollection({
  loader: glob({ base: "./src/data/categories", pattern: "**/*.json" }),
  schema: z.object({ name: z.string().min(1), slug, description: z.string().optional(), order: z.number().int().min(0).default(0), visible: z.boolean().default(true) }),
});

const siteSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("about"), artisticName: z.string().min(1), professionalTitle: z.string().min(1), profileImage: urlOrPath.optional(), shortBio: z.string().min(1), fullBio: z.string().optional(),
    education: z.array(z.object({ title: z.string(), institution: z.string().optional(), year: z.string().optional() })).default([]), experience: z.array(z.object({ title: z.string(), organization: z.string().optional(), period: z.string().optional(), description: z.string().optional() })).default([]), specialties: z.array(z.string()).default([]), links: z.array(linkItem).default([]), resume: urlOrPath.optional(), sections: z.object({ education: z.boolean().default(true), experience: z.boolean().default(true), specialties: z.boolean().default(true), links: z.boolean().default(true) }).default({}),
  }),
  z.object({ type: z.literal("home"), sections: z.array(homeSection).default([]) }),
  z.object({
    type: z.literal("theme"),
    colors: z.object({ background: hex.default(defaultColors.background), surface: hex.default(defaultColors.surface), text: hex.default(defaultColors.text), mutedText: hex.default(defaultColors.mutedText), heading: hex.default(defaultColors.heading), link: hex.default(defaultColors.link), border: hex.default(defaultColors.border), button: hex.default(defaultColors.button), accent: hex.default(defaultColors.accent) }).default(defaultColors),
    typography: z.object({ hero: typeStyle.default(defaultTypography.hero), section: typeStyle.default(defaultTypography.section), body: typeStyle.default(defaultTypography.body), caption: typeStyle.default(defaultTypography.caption) }).default(defaultTypography),
    layout: z.object({ container: z.number().int().min(960).max(1600).default(defaultLayout.container), columns: z.number().int().min(2).max(4).default(defaultLayout.columns), mobileColumns: z.number().int().min(1).max(2).default(1), cardGap: z.number().int().min(12).max(48).default(defaultLayout.cardGap), sectionGap: z.number().int().min(48).max(160).default(defaultLayout.sectionGap), gutter: z.number().int().min(16).max(64).default(defaultLayout.gutter), coverFit: z.enum(["contain", "cover"]).default("contain") }).default({ ...defaultLayout, mobileColumns: 1, coverFit: "contain" }),
    components: z.object({ radius: z.number().int().min(0).max(40).default(defaultComponents.radius), borderWidth: z.number().int().min(0).max(3).default(defaultComponents.borderWidth), shadow: z.enum(["none", "soft", "strong"]).default(defaultComponents.shadow) }).default(defaultComponents),
    aboutLayout: z.object({ contentWidth: z.number().int().min(560).max(960).default(720), portraitSize: z.number().int().min(96).max(320).default(160) }).default({ contentWidth: 720, portraitSize: 160 }),
    showContactLink: z.boolean().default(true), showFooter: z.boolean().default(true), footerText: z.string().optional(), footerLinks: z.array(linkItem).default([]),
    primaryColor: z.enum(["violet", "blue", "green", "orange", "rose"]).optional(), secondaryColor: z.enum(["slate", "stone", "zinc"]).optional(), background: z.enum(["light", "warm", "dark"]).optional(), font: z.enum(["system", "serif", "mono"]).optional(), galleryColumns: z.enum(["2", "3", "4"]).optional(), coverStyle: z.enum(["rounded", "square", "soft"]).optional(), spacing: z.enum(["compact", "comfortable", "generous"]).optional(), heroImage: urlOrPath.optional(),
  }),
]).superRefine((value, context) => {
  if (value.type !== "theme") return;
  const pairs = [["text", value.colors.text, "background", value.colors.background, 4.5], ["text", value.colors.text, "surface", value.colors.surface, 4.5], ["mutedText", value.colors.mutedText, "background", value.colors.background, 4.5], ["link", value.colors.link, "background", value.colors.background, 4.5], ["heading", value.colors.heading, "background", value.colors.background, 3], ["button", value.colors.button, "background", value.colors.background, 3]] as const;
  for (const [foregroundName, foreground, backgroundName, background, minimum] of pairs) {
    const message = contrastMessage(foreground, background, `${foregroundName} sobre ${backgroundName}`, minimum);
    if (message) context.addIssue({ code: z.ZodIssueCode.custom, message, path: ["colors", foregroundName] });
  }
});

const site = defineCollection({ loader: glob({ base: "./src/data/site", pattern: "**/*.{md,json}" }), schema: siteSchema });

export const collections = { projects, categories, site };
