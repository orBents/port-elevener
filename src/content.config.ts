import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const mediaItem = z.object({
  type: z.enum(["image", "youtube", "vimeo"]),
  source: z.string().min(1),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ base: "./src/data/projects", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.enum(["animation", "storyboard", "sketchbook", "illustration", "authorial"]),
    summary: z.string().min(1),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    cover: z.string().optional(),
    media: z.array(mediaItem).default([]),
  }),
});

export const collections = { projects };
