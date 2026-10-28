import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const layout = fs.readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
const tokens = fs.readFileSync(new URL("../src/styles/design-tokens.css", import.meta.url), "utf8");

test("uses one ordered category source for desktop navigation and the mobile drawer", () => {
  assert.match(layout, /categoryNavigationItems\(categories\)/);
  assert.equal((layout.match(/navigationItems\.map\(/g) ?? []).length, 2);
  assert.match(layout, /data-category-link=\{item\.category\}/);
});

test("declares accessible drawer controls and keyboard close behavior", () => {
  assert.match(layout, /aria-expanded="false"/);
  assert.match(layout, /aria-controls="mobile-navigation"/);
  assert.match(layout, /role="dialog" aria-modal="true"/);
  assert.match(layout, /event\.key === "Escape"/);
  assert.match(layout, /document\.body\.classList\.add\("has-navigation-overlay"\)/);
  assert.match(layout, /lastFocusedElement\?\.focus\(\)/);
});

test("keeps the desktop menu and makes the drawer available only on small viewports", () => {
  assert.match(tokens, /@media \(max-width:699px\) \{ \.site-navigation__links \{ display:none; \}/);
  assert.match(tokens, /\.site-menu-toggle \{ display:inline-flex; \}/);
  assert.match(tokens, /@media \(max-width:374px\) \{ \.site-grid \{ --responsive-mobile-columns:1; \}/);
  assert.match(tokens, /--responsive-gutter:min\(var\(--layout-gutter\),clamp\(16px,5vw,24px\)\)/);
});
