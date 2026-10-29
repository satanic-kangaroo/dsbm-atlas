/** Continent-level grouping used by the tile map filters (kept apart from the data contract: it is presentation, not data). */
export const REGION_KEYS = ["europe", "namerica", "samerica", "asia", "africa", "oceania"] as const;
export type Region = (typeof REGION_KEYS)[number];

const R: Record<Region, string> = {
  europe: "ISL NOR SWE FIN RUS IRL GBR DNK EST LVA NLD DEU POL LTU BLR FRA BEL CZE SVK HUN UKR PRT ESP CHE AUT SVN ROU MDA GIB ITA HRV BIH SRB BGR TUR MKD GRC GEO ARM",
  namerica: "USA CAN MEX CUB GTM HND PRI SLV NIC CRI",
  samerica: "COL VEN ECU PER BRA BOL PRY CHL ARG",
  asia: "IRN SYR IRQ JOR LBN ISR SAU KAZ UZB TJK MNG CHN KOR JPN HKG TWN IND BGD LKA THA VNM PHL MYS SGP IDN",
  africa: "EGY MAR DZA TUN AGO ZAF",
  oceania: "AUS NZL",
};
const BY = new Map<string, Region>();
for (const [k, v] of Object.entries(R)) for (const c of v.split(" ")) BY.set(c, k as Region);
export const regionOf = (iso3: string): Region | null => BY.get(iso3) ?? null;

export const REGION_NAMES: Record<"en" | "fa", Record<Region, string>> = {
  en: { europe: "Europe", namerica: "North America", samerica: "South America", asia: "Asia", africa: "Africa", oceania: "Oceania" },
  fa: { europe: "اروپا", namerica: "آمریکای شمالی", samerica: "آمریکای جنوبی", asia: "آسیا", africa: "آفریقا", oceania: "اقیانوسیه" },
};
