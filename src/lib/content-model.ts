export function isSafeMediaSource(source: string | undefined): source is string {
  return Boolean(source && (source.startsWith("/") || /^https?:\/\//.test(source)));
}

export function embedVideoUrl(provider: "youtube" | "vimeo", source: string): string | undefined {
  const youtube = source.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/)?.[1];
  const vimeo = source.match(/vimeo\.com\/(\d+)/)?.[1];
  if (provider === "youtube" && youtube) return `https://www.youtube-nocookie.com/embed/${youtube}`;
  if (provider === "vimeo" && vimeo) return `https://player.vimeo.com/video/${vimeo}`;
  return undefined;
}

export function displayCategory(slug: string, labels: Map<string, string>): string {
  return labels.get(slug) ?? slug.replace(/[-_]+/g, " ");
}

/** Converts legacy frontmatter written by the Markdown widget into safe plain text. */
export function plainText(value: string): string {
  return value.replace(/!?(?:\[([^\]]*)\]\([^)]*\))/g, "$1").replace(/[*_`>#]/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

export function selectBySlug<T extends { data: { slug: string } }>(items: T[], slugs: string[]): T[] {
  const bySlug = new Map(items.map((item) => [item.data.slug, item]));
  return slugs.map((slug) => bySlug.get(slug)).filter((item): item is T => Boolean(item));
}

export function missingCategoryReferences(projects: Array<{ data: { category: string; slug: string } }>, categories: Array<{ data: { slug: string } }>): string[] {
  const known = new Set(categories.map((category) => category.data.slug));
  return projects.filter((project) => !known.has(project.data.category)).map((project) => `${project.data.slug} → ${project.data.category}`);
}
