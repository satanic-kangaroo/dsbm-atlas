import type { MetadataRoute } from "next";
import { bandIds, countrySlugs } from "@/lib/data";
import { locales } from "@/lib/i18n";

export const dynamic = "force-static";
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "method/", ...countrySlugs().map((s) => `country/${s}/`), ...bandIds().map((i) => `band/${i}/`)];
  return locales.flatMap((l) => paths.map((p) => ({ url: `${BASE}/${l}/${p}`, alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${BASE}/${x}/${p}`])) } })));
}
