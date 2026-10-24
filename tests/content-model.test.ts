import assert from "node:assert/strict";
import test from "node:test";
import { displayCategory, embedVideoUrl, isSafeMediaSource, missingCategoryReferences, plainText, selectBySlug } from "../src/lib/content-model.js";

test("accepts managed media paths and public URLs only", () => {
  assert.equal(isSafeMediaSource("/uploads/work.jpg"), true);
  assert.equal(isSafeMediaSource("https://example.com/work.jpg"), true);
  assert.equal(isSafeMediaSource("Arquivo"), false);
});

test("normalizes supported video providers without embedding arbitrary URLs", () => {
  assert.equal(embedVideoUrl("youtube", "https://www.youtube.com/watch?v=abc123"), "https://www.youtube-nocookie.com/embed/abc123");
  assert.equal(embedVideoUrl("vimeo", "https://vimeo.com/123456"), "https://player.vimeo.com/video/123456");
  assert.equal(embedVideoUrl("youtube", "https://example.com/video"), undefined);
});

test("preserves configured project order and has a safe category fallback", () => {
  const items = [{ data: { slug: "first" } }, { data: { slug: "second" } }];
  assert.deepEqual(selectBySlug(items, ["second", "missing", "first"]).map((item) => item.data.slug), ["second", "first"]);
  assert.equal(displayCategory("new-category", new Map()), "new category");
});

test("renders legacy markdown frontmatter as readable plain text", () => {
  assert.equal(plainText("Sou formado em **Design**.\n\n[Site](https://example.com)"), "Sou formado em Design.\n\nSite");
});

test("identifies published work that references a missing category", () => {
  assert.deepEqual(missingCategoryReferences([{ data: { slug: "work", category: "unknown" } }], [{ data: { slug: "illustration" } }]), ["work → unknown"]);
});
