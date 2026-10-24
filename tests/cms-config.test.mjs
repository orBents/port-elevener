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
  assert.deepEqual(media.types.map((type) => type.name), ["image", "youtube", "vimeo"]);
});
