import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const mediaItem = z.object({
  type: z.enum(["image", "youtube", "vimeo"]),
  source: z.string().min(1),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

const linkItem = z.object({ label: z.string().min(1), url: z.string().url() });

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

const site = defineCollection({
  loader: glob({ base: "./src/data/site", pattern: "**/*.{md,json}" }),
  schema: z.discriminatedUnion("type", [
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
  ]),
});

export const collections = { projects, site };
