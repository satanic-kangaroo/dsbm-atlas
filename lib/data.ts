import "server-only";
import raw from "@/data/atlas.json";
import type { Atlas, Band, Country } from "./types";

export const atlas = raw as unknown as Atlas;
import { countrySlug } from "./slug";
export { countrySlug };

const countryBySlug = new Map<string, Country>(atlas.countries.map((c) => [countrySlug(c.name), c]));
const bandById = new Map<number, Band>(atlas.bands.map((b) => [b.id, b]));
const bandsByCountry = new Map<string, Band[]>();
for (const b of atlas.bands) (bandsByCountry.get(b.c) ?? bandsByCountry.set(b.c, []).get(b.c)!).push(b);

export const getCountry = (slug: string) => countryBySlug.get(slug);
export const getBand = (id: number) => bandById.get(id);
export const bandsOf = (c: Country) => bandsByCountry.get(c.name) ?? [];
export const countrySlugs = () => [...countryBySlug.keys()];
export const bandIds = () => atlas.bands.map((b) => String(b.id));
