import assert from "node:assert/strict";
import test from "node:test";
import { CustomException, parseCommunitySubmission, parsePublishedAlerts } from "../dist/index.js";

const id = "b44b0087-aa1e-4f98-b5a8-a56cd505c059";
const kind = "delivery";
const summary = "A delivery notice asked for a second delivery fee.";

test("keeps only validated community fields and a published timestamp", () => {
  assert.deepEqual(parseCommunitySubmission({ id, kind, summary: "  " + summary + "  ", privateDraft: "secret" }),
    { id, kind, summary });
  const publishedAt = "2026-11-23T11:00:00.000Z";
  assert.deepEqual(parsePublishedAlerts([{ id, kind, summary, publishedAt }]), [{ id, kind, summary, publishedAt }]);
});

test("rejects common contact identifiers and malformed submissions", () => {
  for (const extra of ["email person@example.invalid", "phone 612 123 456", "https://example.invalid"]) {
    assert.throws(() => parseCommunitySubmission({ id, kind, summary: summary + " " + extra }), CustomException);
  }
  assert.throws(() => parseCommunitySubmission({ id, kind: "wrong", summary }), CustomException);
  assert.throws(() => parsePublishedAlerts([{ id, kind, summary }]), CustomException);
});
