export const locales = [
  { code: "en-GB", label: "English (UK)", dir: "ltr" },
  { code: "en-US", label: "English (US)", dir: "ltr" },
  { code: "es-ES", label: "Español", dir: "ltr" },
  { code: "ca-ES", label: "Català", dir: "ltr" },
  { code: "pt-PT", label: "Português (Portugal)", dir: "ltr" },
  { code: "pt-BR", label: "Português (Brasil)", dir: "ltr" },
  { code: "it-IT", label: "Italiano", dir: "ltr" },
  { code: "ru-RU", label: "Русский", dir: "ltr" },
  { code: "de-DE", label: "Deutsch", dir: "ltr" },
  { code: "fr-FR", label: "Français", dir: "ltr" },
  { code: "uk-UA", label: "Українська", dir: "ltr" },
  { code: "et-EE", label: "Eesti", dir: "ltr" },
  { code: "pl-PL", label: "Polski", dir: "ltr" },
  { code: "bg-BG", label: "Български", dir: "ltr" },
  { code: "zh-Hans", label: "简体中文", dir: "ltr" },
  { code: "hi-IN", label: "हिन्दी", dir: "ltr" },
  { code: "ja-JP", label: "日本語", dir: "ltr" },
  { code: "he-IL", label: "עברית", dir: "rtl" },
  { code: "ur-PK", label: "اردو", dir: "rtl" },
  { code: "af-ZA", label: "Afrikaans", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "ko-KR", label: "한국어", dir: "ltr" },
  { code: "tr-TR", label: "Türkçe", dir: "ltr" },
  { code: "id-ID", label: "Bahasa Indonesia", dir: "ltr" },
  { code: "vi-VN", label: "Tiếng Việt", dir: "ltr" },
] as const;

export type Locale = (typeof locales)[number]["code"];
export const defaultLocale: Locale = "en-GB";

export function resolveLocale(candidates: readonly string[]): Locale {
  for (const candidate of candidates) {
    let requested: Intl.Locale;
    try {
      requested = new Intl.Locale(candidate);
    } catch {
      continue;
    }
    const exact = locales.find(({ code }) => code === requested.baseName);
    if (exact) return exact.code;
    const match = locales.find(({ code }) => new Intl.Locale(code).language === requested.language);
    if (match) return match.code;
  }
  return defaultLocale;
}

export type ErrorCategory =
  "validation" | "unauthenticated" | "forbidden" | "not-found" |
  "conflict" | "rate-limited" | "unavailable" | "internal";

type SafeValue = string | number | boolean;
export interface CustomExceptionInfo {
  readonly code: string;
  readonly module: string;
  readonly messageKey: string;
  readonly category: ErrorCategory;
  readonly args?: Readonly<Record<string, SafeValue>>;
  readonly details?: Readonly<Record<string, SafeValue>>;
}

export class CustomException extends Error {
  readonly info: CustomExceptionInfo;

  constructor(info: CustomExceptionInfo) {
    super(info.messageKey);
    this.name = "CustomException";
    this.info = info;
  }
}

export * from "./community.js";
