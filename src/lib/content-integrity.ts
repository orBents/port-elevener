export type CategoryReference = {
  slug: string;
  name: string;
  path?: string;
};

export type ProjectReference = {
  slug: string;
  title: string;
  category: string;
};

export type HomeSectionReference = {
  type?: string;
  title?: string;
  categories?: string[];
  projects?: string[];
};

export type ContentIntegritySnapshot = {
  categories: CategoryReference[];
  projects: ProjectReference[];
  homeSections: HomeSectionReference[];
};

export type IntegrityIssue = {
  code: "duplicate-category-slug" | "duplicate-project-slug" | "missing-project-category" | "missing-home-category" | "missing-home-project";
  message: string;
};

export type CategoryDependency = {
  kind: "project" | "home";
  label: string;
};

const unique = <T>(items: T[]) => [...new Set(items)];

const sectionLabel = (section: HomeSectionReference, index: number) =>
  `Seção ${index + 1}${section.title ? ` (${section.title})` : ` (${section.type ?? "sem tipo"})`}`;

export function findCategoryDependencies(snapshot: ContentIntegritySnapshot, slug: string): CategoryDependency[] {
  const projects = snapshot.projects
    .filter((project) => project.category === slug)
    .map((project) => ({ kind: "project" as const, label: `${project.title} (${project.slug})` }));
  const home = snapshot.homeSections.flatMap((section, index) =>
    (section.categories ?? []).includes(slug)
      ? [{ kind: "home" as const, label: sectionLabel(section, index) }]
      : [],
  );

  return [...projects, ...home];
}

export function createIntegrityIssues(snapshot: ContentIntegritySnapshot): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const categorySlugs = snapshot.categories.map((category) => category.slug);
  const projectSlugs = snapshot.projects.map((project) => project.slug);
  const knownCategories = new Set(categorySlugs);
  const knownProjects = new Set(projectSlugs);

  unique(categorySlugs.filter((slug, index) => categorySlugs.indexOf(slug) !== index)).forEach((slug) => {
    issues.push({ code: "duplicate-category-slug", message: `Há mais de uma categoria usando o identificador "${slug}".` });
  });
  unique(projectSlugs.filter((slug, index) => projectSlugs.indexOf(slug) !== index)).forEach((slug) => {
    issues.push({ code: "duplicate-project-slug", message: `Há mais de uma obra usando o endereço "${slug}".` });
  });
  snapshot.projects.forEach((project) => {
    if (!knownCategories.has(project.category)) {
      issues.push({ code: "missing-project-category", message: `A obra "${project.title}" (${project.slug}) usa a categoria inexistente "${project.category}".` });
    }
  });
  snapshot.homeSections.forEach((section, index) => {
    (section.categories ?? []).forEach((slug) => {
      if (!knownCategories.has(slug)) {
        issues.push({ code: "missing-home-category", message: `${sectionLabel(section, index)} referencia a categoria inexistente "${slug}".` });
      }
    });
    (section.projects ?? []).forEach((slug) => {
      if (!knownProjects.has(slug)) {
        issues.push({ code: "missing-home-project", message: `${sectionLabel(section, index)} referencia a obra inexistente "${slug}".` });
      }
    });
  });

  return issues;
}

export function formatIntegrityIssues(issues: IntegrityIssue[]): string {
  return issues.map((issue) => `• ${issue.message}`).join("\n");
}

export function assertContentIntegrity(snapshot: ContentIntegritySnapshot): void {
  const issues = createIntegrityIssues(snapshot);
  if (issues.length) throw new Error(`Integridade do conteúdo inválida:\n${formatIntegrityIssues(issues)}`);
}

export function categoryChangeMessage(snapshot: ContentIntegritySnapshot, previousSlug: string, nextSlug: string): string | undefined {
  if (previousSlug === nextSlug) return undefined;
  const dependencies = findCategoryDependencies(snapshot, previousSlug);
  if (!dependencies.length) return undefined;
  const projects = dependencies.filter((dependency) => dependency.kind === "project").map((dependency) => dependency.label);
  const home = dependencies.filter((dependency) => dependency.kind === "home").map((dependency) => dependency.label);
  const details = [
    projects.length ? `Obras: ${projects.join(", ")}.` : "",
    home.length ? `Página inicial: ${home.join(", ")}.` : "",
  ].filter(Boolean).join(" ");
  return `Não é possível alterar o identificador da categoria "${previousSlug}" para "${nextSlug}" enquanto houver referências. ${details} Atualize essas referências primeiro.`;
}
