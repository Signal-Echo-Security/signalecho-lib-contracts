import { CustomException } from "./index.js";

export const scamKinds = ["bank", "delivery", "other"] as const;
export type ScamKind = (typeof scamKinds)[number];

export interface CommunitySubmission {
  readonly id: string;
  readonly kind: ScamKind;
  readonly summary: string;
}

export interface PublishedAlert extends CommunitySubmission {
  readonly publishedAt: string;
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const identifiers = /https?:\/\/|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\d[\s().-]*){8,}/i;

export function parseCommunitySubmission(value: unknown): CommunitySubmission {
  if (typeof value !== "object" || value === null) throw invalid();
  const { id, kind, summary } = value as Record<string, unknown>;
  if (typeof id !== "string" || !uuid.test(id) || !isScamKind(kind) || typeof summary !== "string") {
    throw invalid();
  }
  const cleaned = summary.normalize("NFKC").trim().replace(/\s+/gu, " ");
  if (cleaned.length < 20 || cleaned.length > 500 || identifiers.test(cleaned)) throw invalid();
  return { id: id.toLowerCase(), kind, summary: cleaned };
}

export function parsePublishedAlerts(value: unknown): PublishedAlert[] {
  if (!Array.isArray(value) || value.length > 50) throw invalid();
  return value.map((item: unknown) => {
    const submission = parseCommunitySubmission(item);
    const { publishedAt } = item as Record<string, unknown>;
    if (typeof publishedAt !== "string" || !Number.isFinite(Date.parse(publishedAt))) throw invalid();
    return { ...submission, publishedAt };
  });
}

function isScamKind(value: unknown): value is ScamKind {
  return scamKinds.some((kind) => kind === value);
}

function invalid(): CustomException {
  return new CustomException({
    code: "INVALID_COMMUNITY_ALERT",
    module: "community",
    category: "validation",
    messageKey: "community.invalid",
  });
}
