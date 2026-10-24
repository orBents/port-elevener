import assert from "node:assert/strict";
import test from "node:test";
import { contrastMessage, contrastRatio, hexPattern, typographyStyle } from "../src/lib/design-system.js";

test("accepts valid HEX and accessible defaults", () => {
  assert.equal(hexPattern.test("#FFFFFF"), true);
  assert.equal(contrastMessage("#18181B", "#FFFFFF", "text/background"), undefined);
});

test("rejects invalid HEX and insufficient normal text contrast", () => {
  assert.equal(hexPattern.test("#FFF"), false);
  assert.match(contrastMessage("#FFFFFF", "#FFFFFF", "text/background") ?? "", /1\.00:1.*4\.5:1/);
});

test("rejects dark text on dark background and supports large text threshold", () => {
  assert.match(contrastMessage("#18181B", "#09090B", "heading/background", 3) ?? "", /3:1/);
  assert.equal(contrastMessage("#777777", "#FFFFFF", "large", 3), undefined);
  assert.ok(contrastRatio("#000000", "#FFFFFF") > 20);
});

test("normalizes responsive typography without unsafe values", () => {
  const style = typographyStyle({ family: "serif", size: 72, weight: 700, lineHeight: 1, letterSpacing: -0.04 });
  assert.equal(style.family, "Georgia, serif");
  assert.match(style.size, /^clamp\(/);
});
