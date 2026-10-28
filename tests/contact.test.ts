import assert from "node:assert/strict";
import test from "node:test";
import { directContactLinks, normalizeEmail, normalizeWhatsApp } from "../src/lib/contact.js";

test("normalizes optional direct contacts into safe links", () => {
  assert.equal(normalizeEmail(" Enzo@Example.COM "), "enzo@example.com");
  assert.equal(normalizeWhatsApp("+55 (11) 99999-0000"), "5511999990000");
  assert.deepEqual(directContactLinks({ email: "enzo@example.com", whatsapp: "+55 (11) 99999-0000" }), [
    { label: "E-mail", href: "mailto:enzo@example.com", external: false },
    { label: "WhatsApp", href: "https://wa.me/5511999990000", external: true },
  ]);
});

test("does not render empty, invalid or disabled footer contacts", () => {
  assert.equal(normalizeEmail("not-an-email"), undefined);
  assert.equal(normalizeWhatsApp("123"), undefined);
  assert.deepEqual(directContactLinks({ email: "enzo@example.com", whatsapp: "5511999990000", showEmailInFooter: false, showWhatsAppInFooter: false }, true), []);
  assert.deepEqual(directContactLinks({}, true), []);
});
