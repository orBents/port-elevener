import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import yaml from "js-yaml";

const config = yaml.load(fs.readFileSync(new URL("../public/admin/config.yml", import.meta.url), "utf8"));

test("defines unique, task-oriented CMS areas", () => {
  assert.deepEqual(config.collections.map((collection) => collection.name), ["projects", "categories", "home", "about", "appearance"]);
  const fileNames = config.collections.flatMap((collection) => collection.files || []).map((file) => file.name);
  assert.equal(new Set(fileNames).size, fileNames.length);
});

test("uses typed project media and relation-driven categories", () => {
  const projects = config.collections.find((collection) => collection.name === "projects");
  const category = projects.fields.find((field) => field.name === "category");
  const media = projects.fields.find((field) => field.name === "media");
  assert.equal(category.widget, "relation");
  assert.deepEqual(media.types.map((type) => type.name), ["image", "youtube", "gif", "vimeo"]);
});

test("protects category deletion and exposes native project organization controls", () => {
  const projects = config.collections.find((collection) => collection.name === "projects");
  const categories = config.collections.find((collection) => collection.name === "categories");
  assert.equal(categories.delete, false);
  assert.deepEqual(projects.view_filters.map((filter) => filter.field), ["published", "published"]);
  assert.deepEqual(projects.view_groups, [{ label: "Por categoria", field: "category" }]);
});

test("exposes one global grid control with responsive columns, thumbnails and density", () => {
  const appearance = config.collections.find((collection) => collection.name === "appearance");
  const theme = appearance.files.find((file) => file.name === "appearance");
  const layout = theme.fields.find((field) => field.name === "layout");
  const names = layout.fields.map((field) => field.name);
  assert.deepEqual(names, ["container", "columns", "mobileColumns", "thumbnailRatio", "density", "cardGap", "sectionGap", "gutter"]);
  assert.deepEqual(layout.fields.find((field) => field.name === "columns").options.map((option) => option.value), [1, 2, 3, 4]);
  assert.deepEqual(layout.fields.find((field) => field.name === "thumbnailRatio").options.map((option) => option.value), ["original", "square", "wide"]);
  assert.deepEqual(layout.fields.find((field) => field.name === "density").options.map((option) => option.value), ["compact", "comfortable"]);
});
