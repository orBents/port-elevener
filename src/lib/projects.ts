import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) => data.published);

  return projects.sort((left, right) => left.data.order - right.data.order || right.data.publishedAt.getTime() - left.data.publishedAt.getTime());
}
