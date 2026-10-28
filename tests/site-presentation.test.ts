import assert from "node:assert/strict";
import test from "node:test";
import { categoryLabel, categoryNavigationItems, normalizeTheme, publishedProjects, selectedProjects, siteCssVariables, visibleCategories } from "../src/lib/site-presentation.js";

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

test("builds mobile and desktop category links from the same visible category source", () => {
  const links = categoryNavigationItems([
    { slug: "hidden", name: "Oculta", order: 0, visible: false },
    { slug: "sketchbook", name: "Sketchbooks", order: 30, visible: true },
    { slug: "animation", name: "Animações", order: 10, visible: true },
  ]);
  assert.deepEqual(links, [
    { key: "category-animation", label: "Animações", href: "/?categoria=animation", category: "animation" },
    { key: "category-sketchbook", label: "Sketchbooks", href: "/?categoria=sketchbook", category: "sketchbook" },
  ]);
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
  assert.equal(variables["--grid-tablet-columns"], "2");
  assert.equal(variables["--grid-desktop-columns"], "2");
  assert.equal(variables["--card-thumbnail-ratio"], "auto");
  assert.equal(variables["--card-media-fit"], "contain");
  assert.equal(variables["--portrait-radius"], "20px");
});

test("maps compact density and fixed thumbnails to safe grid tokens", () => {
  const theme = normalizeTheme({ layout: { columns: 4, mobileColumns: 2, cardGap: 24, sectionGap: 96, gutter: 32, density: "compact", thumbnailRatio: "wide" } });
  const variables = siteCssVariables(theme);
  assert.equal(variables["--grid-desktop-columns"], "4");
  assert.equal(variables["--grid-tablet-columns"], "2");
  assert.equal(variables["--grid-mobile-columns"], "2");
  assert.equal(variables["--layout-card-gap"], "18px");
  assert.equal(variables["--layout-section-gap"], "72px");
  assert.equal(variables["--layout-gutter"], "24px");
  assert.equal(variables["--card-thumbnail-ratio"], "16 / 9");
  assert.equal(variables["--card-media-fit"], "cover");
  assert.equal(variables["--card-image-height"], "100%");
});

test("supports every configured desktop column count and thumbnail ratio", () => {
  const ratios = { original: ["auto", "contain", "auto"], square: ["1 / 1", "cover", "100%"], wide: ["16 / 9", "cover", "100%"] } as const;
  for (const columns of [1, 2, 3, 4]) {
    for (const [ratio, expected] of Object.entries(ratios)) {
      const variables = siteCssVariables({ layout: { columns, thumbnailRatio: ratio } });
      assert.equal(variables["--grid-desktop-columns"], String(columns));
      assert.equal(variables["--grid-tablet-columns"], String(Math.min(columns, 2)));
      assert.equal(variables["--card-thumbnail-ratio"], expected[0]);
      assert.equal(variables["--card-media-fit"], expected[1]);
      assert.equal(variables["--card-image-height"], expected[2]);
    }
  }
});
