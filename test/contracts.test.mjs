import assert from "node:assert/strict";
import test from "node:test";
import { CustomException, locales, resolveLocale } from "../dist/index.js";

test("maintains Harbor Lens locale coverage and RTL choices", () => {
  assert.equal(new Set(locales.map(({ code }) => code)).size, 25);
  assert.deepEqual(locales.filter(({ dir }) => dir === "rtl").map(({ code }) => code).sort(), ["ar", "he-IL", "ur-PK"]);
  assert.equal(resolveLocale(["pt-BR"]), "pt-BR");
  assert.equal(resolveLocale(["zh-CN"]), "zh-Hans");
  assert.equal(resolveLocale(["**", "ar-SA"]), "ar");
  assert.equal(resolveLocale(["nl-NL"]), "en-GB");
});

test("retains the transport-neutral exception contract", () => {
  const info = { code: "CASE_NOT_FOUND", module: "cases", messageKey: "cases.notFound", category: "not-found" };
  const failure = new CustomException(info);
  assert.deepEqual(failure.info, info);
  assert.equal(failure.message, "cases.notFound");
});
