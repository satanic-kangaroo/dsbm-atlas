import "server-only";
import { atlas } from "./data";
import type { Locale } from "./i18n";

/** English country name -> name in the given language (International/Unknown included). */
export function countryNames(locale: Locale): Record<string, string> {
  const o: Record<string, string> = locale === "fa" ? { International: "بین‌المللی", Unknown: "نامشخص" } : {};
  for (const c of atlas.countries) o[c.name] = locale === "fa" ? c.fa : c.name;
  return o;
}
