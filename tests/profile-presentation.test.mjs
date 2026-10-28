import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const home = fs.readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");
const about = fs.readFileSync(new URL("../src/pages/about.astro", import.meta.url), "utf8");
const layout = fs.readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
const tokens = fs.readFileSync(new URL("../src/styles/design-tokens.css", import.meta.url), "utf8");

test("uses the managed artist identity instead of a fixed Home title", () => {
  assert.match(home, /\{profile\.professionalTitle\}/);
  assert.match(home, /\{profile\.artisticName\}/);
  assert.doesNotMatch(home, />Obras</);
});

test("keeps the About identity block and direct contacts driven by profile data", () => {
  assert.match(about, /site-about__intro/);
  assert.match(about, /site-about__portrait/);
  assert.match(about, /directContactLinks\(profile\.contacts\)/);
  assert.match(layout, /directContactLinks\(profile\?\.contacts, true\)/);
  assert.match(tokens, /--portrait-radius/);
});
