import assert from "node:assert/strict";
import test from "node:test";
import { assertContentIntegrity, categoryChangeMessage, createIntegrityIssues, findCategoryDependencies, type ContentIntegritySnapshot } from "../src/lib/content-integrity.js";

const valid: ContentIntegritySnapshot = {
  categories: [{ slug: "animation", name: "Animações" }, { slug: "illustration", name: "Ilustrações" }],
  projects: [{ slug: "loop", title: "Loop", category: "animation" }],
  homeSections: [{ type: "gallery", title: "Seleção", categories: ["animation"] }, { type: "featured", projects: ["loop"] }],
};

test("accepts valid project, category and Home references", () => {
  assert.deepEqual(createIntegrityIssues(valid), []);
  assert.doesNotThrow(() => assertContentIntegrity(valid));
});

test("reports missing project and Home references", () => {
  const issues = createIntegrityIssues({
    ...valid,
    projects: [...valid.projects, { slug: "orphan", title: "Órfã", category: "missing-category" }],
    homeSections: [{ type: "gallery", categories: ["missing-category"] }, { type: "featured", projects: ["missing-project"] }],
  });
  assert.deepEqual(issues.map((issue) => issue.code), ["missing-project-category", "missing-home-category", "missing-home-project"]);
});

test("reports duplicate slugs", () => {
  const issues = createIntegrityIssues({
    ...valid,
    categories: [...valid.categories, { slug: "animation", name: "Duplicada" }],
    projects: [...valid.projects, { slug: "loop", title: "Duplicada", category: "animation" }],
  });
  assert.deepEqual(issues.map((issue) => issue.code), ["duplicate-category-slug", "duplicate-project-slug"]);
});

test("blocks renaming a category while projects or Home sections reference it", () => {
  const dependencies = findCategoryDependencies(valid, "animation");
  assert.deepEqual(dependencies.map((dependency) => dependency.kind), ["project", "home"]);
  assert.match(categoryChangeMessage(valid, "animation", "motion") ?? "", /Loop/);
  assert.equal(categoryChangeMessage(valid, "illustration", "art"), undefined);
});

test("allows a rename only after every reference was removed", () => {
  const withoutReferences: ContentIntegritySnapshot = {
    ...valid,
    projects: [],
    homeSections: [],
  };
  assert.equal(categoryChangeMessage(withoutReferences, "animation", "motion"), undefined);
});
