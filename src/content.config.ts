import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { contrastMessage, defaultColors, defaultComponents, defaultLayout, defaultTypography, hexPattern } from "./lib/design-system";

const mediaItem = z.object({
  type: z.enum(["image", "youtube", "vimeo"]),
  source: z.string().min(1),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

const linkItem = z.object({ label: z.string().min(1), url: z.string().url() });
const hex = z.string().regex(hexPattern, "Use uma cor HEX no formato #RRGGBB.");
const typeStyle = z.object({ family: z.enum(["sans", "serif", "mono"]), size: z.number().min(12).max(112), weight: z.number().int().min(300).max(800), lineHeight: z.number().min(0.9).max(2), letterSpacing: z.number().min(-0.1).max(0.2) });

const projects = defineCollection({
  loader: glob({ base: "./src/data/projects", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.enum(["animation", "storyboard", "sketchbook", "illustration", "authorial"]),
    summary: z.string().min(1),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().int().min(0).default(0),
    publishedAt: z.coerce.date(),
    cover: z.string().optional(),
    media: z.array(mediaItem).default([]),
  }),
});

const siteSchema = z.discriminatedUnion("type", [
    z.object({
      type: z.literal("about"),
      artisticName: z.string().min(1),
      professionalTitle: z.string().min(1),
      profileImage: z.string().optional(),
      shortBio: z.string().min(1),
      fullBio: z.string().optional(),
      education: z.array(z.object({ title: z.string(), institution: z.string().optional(), year: z.string().optional() })).default([]),
      experience: z.array(z.object({ title: z.string(), organization: z.string().optional(), period: z.string().optional(), description: z.string().optional() })).default([]),
      specialties: z.array(z.string()).default([]),
      links: z.array(linkItem).default([]),
      resume: z.string().optional(),
      sections: z.object({ education: z.boolean().default(true), experience: z.boolean().default(true), specialties: z.boolean().default(true), links: z.boolean().default(true) }).default({}),
    }),
    z.object({
      type: z.literal("theme"),
      colors: z.object({ background: hex.default(defaultColors.background), surface: hex.default(defaultColors.surface), text: hex.default(defaultColors.text), mutedText: hex.default(defaultColors.mutedText), heading: hex.default(defaultColors.heading), link: hex.default(defaultColors.link), border: hex.default(defaultColors.border), button: hex.default(defaultColors.button), accent: hex.default(defaultColors.accent) }).default(defaultColors),
      typography: z.object({ hero: typeStyle.default(defaultTypography.hero), section: typeStyle.default(defaultTypography.section), body: typeStyle.default(defaultTypography.body), caption: typeStyle.default(defaultTypography.caption) }).default(defaultTypography),
      layout: z.object({ container: z.number().int().min(960).max(1600).default(defaultLayout.container), columns: z.number().int().min(2).max(4).default(defaultLayout.columns), cardGap: z.number().int().min(12).max(48).default(defaultLayout.cardGap), sectionGap: z.number().int().min(48).max(160).default(defaultLayout.sectionGap), gutter: z.number().int().min(16).max(64).default(defaultLayout.gutter) }).default(defaultLayout),
      components: z.object({ radius: z.number().int().min(0).max(40).default(defaultComponents.radius), borderWidth: z.number().int().min(0).max(3).default(defaultComponents.borderWidth), shadow: z.enum(["none", "soft", "strong"]).default(defaultComponents.shadow) }).default(defaultComponents),
      aboutLayout: z.object({ contentWidth: z.number().int().min(560).max(960).default(720), portraitSize: z.number().int().min(96).max(320).default(160) }).default({ contentWidth: 720, portraitSize: 160 }),
      primaryColor: z.enum(["violet", "blue", "green", "orange", "rose"]).default("violet"),
      secondaryColor: z.enum(["slate", "stone", "zinc"]).default("zinc"),
      background: z.enum(["light", "warm", "dark"]).default("light"),
      font: z.enum(["system", "serif", "mono"]).default("system"),
      galleryColumns: z.enum(["2", "3", "4"]).default("2"),
      coverStyle: z.enum(["rounded", "square", "soft"]).default("rounded"),
      spacing: z.enum(["compact", "comfortable", "generous"]).default("comfortable"),
      heroImage: z.string().optional(),
      footerText: z.string().optional(),
      footerLinks: z.array(linkItem).default([]),
    }),
    /*
      const tests = [[value.colors.text, value.colors.background, "Texto e fundo"], [value.colors.heading, value.colors.background, "Títulos e fundo"], [value.colors.link, value.colors.background, "Links e fundo"]] as const;
      for (const [foreground, background, label] of tests) { const message = contrastMessage(foreground, background, label); if (message) context.addIssue({ code: z.ZodIssueCode.custom, message, path: ["colors"] }); }
    */
  ]).superRefine((value, context) => {
    if (value.type !== "theme") return;
    const pairs = [["text", value.colors.text, "background", value.colors.background, 4.5], ["text", value.colors.text, "surface", value.colors.surface, 4.5], ["mutedText", value.colors.mutedText, "background", value.colors.background, 4.5], ["link", value.colors.link, "background", value.colors.background, 4.5], ["heading", value.colors.heading, "background", value.colors.background, 3], ["button", value.colors.button, "background", value.colors.background, 3]] as const;
    for (const [foregroundName, foreground, backgroundName, background, minimum] of pairs) {
      const message = contrastMessage(foreground, background, `${foregroundName} sobre ${backgroundName}`, minimum);
      if (message) context.addIssue({ code: z.ZodIssueCode.custom, message, path: ["colors", foregroundName] });
    }
  });

const site = defineCollection({
  loader: glob({ base: "./src/data/site", pattern: "**/*.{md,json}" }),
  schema: siteSchema,
});

export const collections = { projects, site };
