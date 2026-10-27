import assert from "node:assert/strict";
import test from "node:test";
import { categoryLabel, normalizeTheme, publishedProjects, selectedProjects, siteCssVariables, visibleCategories } from "../src/lib/site-presentation.js";

test("uses the same ordering rules for visible categories and published works", () => {
  const categories = visibleCategories([
    { slug: "hidden", name: "Oculta", order: 0, visible: false },
    { slug: "b", name: "Beta", order: 20, visible: true },
    { slug: "a", name: "Alfa", order: 10, visible: true },
  ]);
  assert.deepEqual(categories.map((category) => category.slug), ["a", "b"]);

  const projects = publishedProjects([
    { slug: "later", published: true, order: 20, publishedAt: "2026-01-01" },
    { slug: "first", published: true, order: 10, publishedAt: "2025-01-01" },
    { slug: "draft", published: false, order: 0, publishedAt: "2027-01-01" },
  ]);
  assert.deepEqual(projects.map((project) => project.slug), ["first", "later"]);
});

test("resolves labels, explicit selections and safe theme defaults", () => {
  const categories = [{ slug: "story-board", name: "Storyboards", order: 0, visible: true }];
  assert.equal(categoryLabel(categories, "story-board"), "Storyboards");
  assert.equal(categoryLabel(categories, "not-found"), "not found");
  assert.deepEqual(selectedProjects([{ slug: "two" }, { slug: "one" }], ["one"] as string[]).map((project) => project.slug), ["one"]);

  const theme = normalizeTheme({ colors: { background: "#000000" }, layout: { columns: 2 } });
  const variables = siteCssVariables(theme);
  assert.equal(variables["--color-bg"], "#000000");
  assert.equal(variables["--preview-columns"], undefined);
  assert.equal(variables["--grid-mobile-columns"], "1");
});
