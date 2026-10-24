import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) => data.published);

  return projects.sort((left, right) => left.data.order - right.data.order || right.data.publishedAt.getTime() - left.data.publishedAt.getTime());
}

export async function getVisibleCategories() {
  const categories = await getCollection("categories", ({ data }) => data.visible);
  return categories.sort((left, right) => left.data.order - right.data.order || left.data.name.localeCompare(right.data.name, "pt-BR"));
}
