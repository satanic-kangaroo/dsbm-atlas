import type { Locale } from "./i18n";

/**
 * Content of the Method page: what the analysis does, in the order it runs, with the real numbers.
 * Deliberately says nothing about HOW data was gathered (that is outside this page by design).
 * Numbers are copied from the project's 04_results files. Persian strings are written with ASCII digits;
 * the page converts them to Persian digits at render time (text inside `backticks` is left alone).
 */
export type Block =
  | { t: "p"; x: string }
  | { t: "ul"; x: string[] }
  | { t: "ol"; x: string[] }
  | { t: "table"; head: string[]; rows: string[][]; cap?: string }
  | { t: "note"; x: string }
  | { t: "code"; x: string }
  | { t: "h"; x: string };
export interface Sec { id: string; title: string; lead?: string; blocks: Block[] }
export interface MethodDoc {
  title: string; lead: string; tocTitle: string; tldrTitle: string; tldr: string[];
  dl: { title: string; body: string; button: string; size: string; contains: string[]; excluded: string; file: string };
  sections: Sec[];
}

const en: MethodDoc = {
  title: "Method, step by step",
  lead: "How the numbers on this site were calculated, in the order the analysis runs, with the real figures and the checks that were applied. This page covers the analysis only.",
  tocTitle: "On this page",
  tldrTitle: "In short",
  tldr: [
    "The analysis starts from 2,186 bands listed under Depressive Black Metal on Metal Archives, their discographies and the release dates of 10,781 albums, and adds country-level temperature (Berkeley Earth) and GDP and internet use (World Bank).",
    "Every statistic is computed by the scripts in the source package (Python: pandas, numpy, scipy). Nothing on the site is typed in by hand.",
    "Where a result is weak or depends on choices, the site says so. Several earlier numbers were corrected along the way; they are listed at the end.",
  ],
  dl: {
    title: "Download the analysis source",
    body: "The scripts, the aggregated results and the figures behind every number on this site. Re-running them with tables in the documented format reproduces the results exactly.",
    button: "Download (.zip)", size: "1.4 MB", file: "/downloads/dsbm-analysis-source.zip",
    contains: ["Analysis scripts (cleaning, regression, themes, survival, release formats, calendar) and the small statistics library they use", "All result tables and figures (aggregated by country, period or weekday)", "Country-level temperature and World Bank inputs, and a data-validation script", "INPUT_SCHEMA.md describing the input tables"],
    excluded: "Not included: the band, release and album tables themselves. They are a copy of Metal Archives data and belong to Metal Archives and its contributors.",
  },
  sections: [
    {
      id: "scope", title: "1. What this page covers",
      blocks: [
        { t: "p", x: "The Method page follows the analysis from the finished tables to the published numbers: how raw fields were cleaned and defined, how country-level data were built, which tests were run, with which parameters, and how far each result can be trusted." },
        { t: "p", x: "It does not describe how the underlying records were obtained. The bands, discographies and release dates come from Metal Archives; temperature comes from Berkeley Earth; GDP per person and internet use come from the World Bank." },
        { t: "note", x: "Band logos and photos are never stored here. They are shown by link from their original location and belong to the artists and labels." },
      ],
    },
    {
      id: "data", title: "2. The data the analysis starts from",
      lead: "Three band-level tables and three country-level inputs.",
      blocks: [
        { t: "table", head: ["Table", "One row is", "Size", "Main fields"], rows: [
          ["Bands", "a band", "2,186", "country, formation year, status, genres, lyrical themes, years active, current or last label"],
          ["Discography", "a release listed under a band", "11,130 rows (10,786 unique releases)", "title, type, year, month, album id"],
          ["Album details", "an album page", "10,781 albums", "release date as written, parsed year, month, day, and the precision (day / month / year)"],
          ["Temperature", "a country", "91 countries", "average temperature (Berkeley Earth)"],
          ["Economy", "a country", "91 countries", "GDP per person (current US$), internet users (% of population), World Bank"],
          ["Population", "a country", "91 countries", "millions, about 2023, a table kept in `common.py`"],
        ] },
        { t: "p", x: "Why 11,130 rows but 10,786 releases: a split release is listed under both bands that share it. When an album id exists, rows are merged into one release; this removes 344 duplicates. Band pages show each band's own listing, so they add up to 11,130." },
      ],
    },
    {
      id: "clean", title: "3. Cleaning and definitions",
      lead: "Every definition below is applied identically everywhere on the site.",
      blocks: [
        { t: "ul", x: [
          "Formation year: the four-digit year in the 'formed in' field. 590 bands (27.0%) have none and are left out of anything that needs a year.",
          "Status: active, split-up, unknown, changed name, on hold or disputed, as listed. 72.3% of bands are active.",
          "Country: the country on the band's own page. Spelling variants are merged ('Türkiye' becomes 'Turkey', 'Korea, South' becomes 'South Korea'). Bands listed as International (86) or Unknown (16) are kept in band counts but excluded from every country comparison. That leaves 91 countries.",
          "Themes: the listed lyrical themes, lower-cased and split on commas, slashes and semicolons. 735 bands (33.6%) list none; they are kept out of theme shares rather than counted as 'no theme'.",
          "Pure DSBM: every genre label of the band is a plain DSBM spelling ('Depressive Black Metal', 'Depressive Suicidal Black Metal', 'DSBM', ...). Anything else ('Depressive/Post-Black Metal', 'Raw Depressive Black Metal', and so on) is a hybrid. 62.4% of bands (1,363) are pure.",
          "Companion genres: the labels left after removing every DSBM spelling and bracketed qualifiers such as '(early)' or '(later)', grouped into families (atmospheric black metal, post-black metal, ambient, raw black metal, doom metal, shoegaze, ...). 793 bands have at least one.",
          "Years active: ranges like '1992-2000 (as X), 2005-present' are parsed into a first year and a last year; 'present' or '?' means still active. If a range cannot be parsed, the formation year is used as the start.",
          "Reference year: the current calendar year (2026) is used where an age is needed, and the running year is treated as incomplete.",
          "Fixed periods: 1992-2009, 2010-2014, 2015-2019 and 2020 onward. Decades were rejected because only 9 bands were formed in the 1990s.",
        ] },
      ],
    },
    {
      id: "external", title: "4. Temperature, economy and population",
      blocks: [
        { t: "ul", x: [
          "Temperature: for each country, the average of its yearly mean temperatures over 1991-2013. The source file used ends in 2013, so the window is 1991-2013, not 1991-2020. The yearly means are averaged (rather than all months pooled) so that years with missing months do not weigh more.",
          "Where Berkeley Earth has a separate 'X (Europe)' series, it is used, because the plain series for a country can include distant territories (Denmark including Greenland came out at -16.9 °C).",
          "Two temperatures are flagged 'suspect' and are kept but tested separately: Norway (the series may include Svalbard) and Georgia (9.25 °C looks too close to Germany's 9.23 °C, so the series match is uncertain). A flag 'bad' would exclude a country; none remained.",
          "GDP per person and internet use: the latest non-empty value between 2018 and 2023 for each country, with the year kept.",
          "Population: a table in millions for about 2023, rounded. Figures for a few small places are approximate.",
        ] },
      ],
    },
    {
      id: "country", title: "5. The country table",
      blocks: [
        { t: "p", x: "For every country: number of bands (all bands of that country, including those with no formation year), population, and bands per million = bands / population in millions." },
        { t: "ul", x: [
          "Rankings per million only include countries with at least 5 bands (48 countries), because one or two bands in a tiny country give extreme rates (Gibraltar: 1 band = 29.4 per million; Iceland: 3 bands = 7.7).",
          "Finland is first with 39 bands = 7.09 per million, then Sweden 5.52, Moldova 2.69, Lithuania 2.41 and Norway 2.18. By raw count the order is the United States 415, Russia 219, Germany 128, Brazil 115.",
          "Map colours use fixed steps: bands 1 / 3 / 10 / 30 / 100; per million 0.05 / 0.2 / 0.5 / 1.5 / 3; temperature 0 / 5 / 10 / 15 / 20 °C.",
        ] },
        { t: "note", x: "An earlier version counted only bands with a formation year, which silently dropped about 27% of bands overall and about 35% of those in the United States. All bands are counted now." },
      ],
    },
    {
      id: "growth", title: "6. Growth over time",
      blocks: [
        { t: "p", x: "Bands are counted by formation year from 1985. The running year (2026, 35 bands so far) is drawn as partial and not read as a drop. The busiest formation years are 2023 (125 bands), 2024 (123) and 2013 (95). Bands without a formation year are not in this chart." },
      ],
    },
    {
      id: "climate", title: "7. Does climate matter? The temperature test",
      lead: "Run in two stages: a simple comparison, then a set of controls and robustness checks.",
      blocks: [
        { t: "p", x: "Stage 1 compares each country's average temperature with its bands per million." },
        { t: "table", head: ["Countries", "n", "Pearson r", "Spearman ρ", "OLS slope per °C", "p (robust)"], rows: [
          ["All with a temperature", "90", "-0.542", "-0.644", "-0.085 bands per million", "< 0.001"],
          ["At least 10 bands", "32", "-0.455", "-0.548", "-0.086", "0.031"],
        ] },
        { t: "p", x: "The OLS standard errors are heteroskedasticity-robust (HC3). A count model was also fitted: a Poisson model of the number of bands with log(population) as the offset and robust standard errors, because counts of bands are over-dispersed (dispersion 34 to 90). It gives about -7.9% bands per extra °C for all 90 countries (p = 0.001) and about -2.9% for the 32 larger scenes (p = 0.31)." },
        { t: "p", x: "Stage 2 adds GDP per person (per 10,000 US$) and internet use (per 10 percentage points) as controls (89 countries with complete data) and re-tests the temperature coefficient under nine specifications. A result is only called solid if it survives most of them." },
        { t: "table", head: ["Specification", "n", "Temperature effect", "p (robust)"], rows: [
          ["S0 legacy count (bands with a year only)", "89", "-0.045", "0.0009"],
          ["S1 all bands counted", "89", "-0.068", "0.0004"],
          ["S2 OLS, known-bad temperatures removed (primary OLS)", "89", "-0.068", "0.0004"],
          ["S3 only countries with at least 10 bands", "32", "-0.070", "0.106"],
          ["S4 OLS on log(rate)", "89", "-0.089", "< 0.0001"],
          ["S5 Poisson count model (primary count model)", "89", "-0.041 (about -4% per °C)", "0.244"],
          ["S6 Poisson, at least 10 bands", "32", "-0.034", "0.531"],
          ["S7 OLS without Norway and Georgia", "87", "-0.068", "0.0008"],
          ["S8 Poisson without Norway and Georgia", "87", "-0.041", "0.251"],
        ], cap: "Temperature coefficient in bands per million per °C (OLS) or on the log scale (Poisson)." },
        { t: "p", x: "Also checked: standardised effects in S2 are temperature -0.43, GDP +0.28, internet -0.01. Dropping any single country (leave-one-out) keeps the temperature coefficient between -0.074 and -0.058 with p below 0.001 every time. Correlations among the predictors are sizeable (temperature with GDP -0.40, with internet -0.47, GDP with internet 0.59)." },
        { t: "p", x: "Reading: the direction is the same in every model. The OLS result holds up to controls and to dropping any one country, but it is not significant in the count models and not among countries with at least ten bands. It is a pattern between countries, not a cause: wealth, internet access, how well a scene is documented on Metal Archives, and the history of Nordic metal all differ between countries and all travel with temperature." },
      ],
    },
    {
      id: "themes", title: "8. Lyrical themes over time",
      blocks: [
        { t: "ol", x: [
          "Bands are grouped by formation period (the four fixed periods) and only bands with a formation year and at least one theme are used (n = 1,271 for the trend tests; 1,451 bands list themes at all).",
          "For each of 8 key themes (suicide, depression, mental illness, self-harm, nature, misanthropy, nihilism, isolation) the share of bands in each period that list it is computed. The denominator is bands that list any theme, not all bands.",
          "Each share has a 95% Wilson confidence interval, and the number of bands is shown on every point.",
          "Trend: Spearman correlation between formation year and whether a band lists the theme.",
          "Because 8 themes are tested, a Bonferroni threshold is used: p < 0.05 / 8 = 0.00625.",
        ] },
        { t: "table", head: ["Theme", "Spearman ρ", "p", "Survives Bonferroni?"], rows: [
          ["self-harm", "+0.152", "< 0.001", "yes (rising)"],
          ["nature", "-0.100", "0.0004", "yes (falling)"],
          ["mental illness", "+0.087", "0.0019", "yes (rising)"],
          ["depression", "+0.074", "0.0084", "no"],
          ["suicide", "+0.059", "0.034", "no"],
          ["isolation", "+0.027", "0.34", "no"],
          ["nihilism", "-0.038", "0.17", "no"],
          ["misanthropy", "-0.020", "0.47", "no"],
        ] },
        { t: "p", x: "Reading: effects are small (|ρ| at most 0.15). Depression and suicide are the most common themes in every period and did not fall. The share of bands with no listed theme rises from 10.2% (1992-2009) to 26.7% (2020 onward), so newer bands are probably less completely described and the shares for recent periods are less certain." },
      ],
    },
    {
      id: "lifespan", title: "9. How long bands last",
      blocks: [
        { t: "p", x: "Comparing the ages of active and split-up bands would be misleading, because active bands have not ended yet. The analysis therefore uses survival analysis, in which still-active bands are 'censored' (known to have lasted at least this long)." },
        { t: "ol", x: [
          "Start = first year in the years-active field, or the formation year if that field cannot be parsed.",
          "Only bands with status active or split-up are used. A split-up band needs a usable end year; if it has none, its duration is unknown and the band is dropped.",
          "Duration = end year - start year + 1 for split-up bands, and current year - start year + 1 for active bands (censored). Durations under 1 year are dropped.",
          "Kaplan-Meier survival curves are estimated separately for pure DSBM and hybrid bands, and compared with a log-rank test.",
        ] },
        { t: "table", head: ["Group", "Bands", "Split up", "Still active (censored)", "Survival at 5 years", "Survival at 10 years"], rows: [
          ["Pure DSBM", "853", "197", "656", "80.2%", "73.2%"],
          ["Hybrid", "517", "77", "440", "88.0%", "83.7%"],
        ], cap: "1,370 bands, 274 observed endings. The median is not reached by year 20 in either group." },
        { t: "p", x: "Log-rank test, pure versus hybrid: chi-square = 16.55, p = 0.00005. Reading: hybrid bands last longer in this data. Caution: the genre label is whatever is listed today, and bands with a short recorded history have little follow-up." },
      ],
    },
    {
      id: "formats", title: "10. Release formats over time",
      blocks: [
        { t: "p", x: "Releases are de-duplicated first (one row per album id; rows without an id are de-duplicated on band, title, type and year), giving 10,786 unique releases. Each is assigned to a period by release year and its type (full-length, EP, demo, split, single, compilation, other) is taken from the album's own page where available." },
        { t: "table", head: ["Period", "Releases", "Full-length", "EP", "Demo", "Split", "Single", "Compilation"], rows: [
          ["1992-2009", "469", "20.3%", "7.5%", "52.9%", "14.7%", "2.8%", "1.7%"],
          ["2010-2014", "1,442", "26.1%", "16.3%", "29.3%", "16.5%", "7.8%", "2.9%"],
          ["2015-2019", "2,197", "31.7%", "22.3%", "15.1%", "10.2%", "16.1%", "3.5%"],
          ["2020 onward", "6,678", "23.7%", "23.9%", "10.0%", "5.8%", "32.4%", "2.1%"],
        ], cap: "Shares sum to about 100% (a small 'other' type is not shown)." },
        { t: "p", x: "Reading: demos fall from more than half of releases to about one in ten, and singles rise from almost none to about a third. The timing fits the move to digital release, but this data does not test why." },
      ],
    },
    {
      id: "calendar", title: "11. Months and weekdays",
      blocks: [
        { t: "p", x: "Of 10,781 albums with a date page, 10,375 have a month (96.2%) and 10,103 have an exact day (93.7%). One release dated in the future is excluded. Month coverage is not uniform: 70.8% before 2010, 86.4% in 2010-2014, 98.4% in 2015-2019, 99.4% from 2020. Because of that, the months are tested only on recent, complete years." },
        { t: "h", x: "Months" },
        { t: "ul", x: [
          "Primary test: complete years 2015-2025 only (7,986 releases). The running year is incomplete and releases per year have grown strongly, so pooling all years would over-weight the recent, busy ones.",
          "Expected counts are proportional to the days in each month (February counted as 28.25 days), then a chi-square test is run.",
          "A second, growth-proof check compares each year with its own total and pools the chi-square values.",
          "Winter share (December to February) is compared with its expected share by a binomial test.",
        ] },
        { t: "table", head: ["Test", "n", "chi-square", "p"], rows: [
          ["Months, complete years 2015-2025 (primary)", "7,986", "22.96", "0.018"],
          ["Months, complete years 2020-2025", "5,824", "15.57", "0.158"],
          ["Pooled within-year test", "-", "178.7 (121 df)", "< 0.001"],
          ["Winter share: 25.1% against 24.7% expected", "7,986", "-", "0.41"],
        ] },
        { t: "p", x: "Reading: the month effect is weak and unstable. It is significant for 2015 onward and gone for 2020 onward, with the busiest and quietest months differing by only about 17%. The idea that winter is the release season is not supported." },
        { t: "h", x: "Weekdays" },
        { t: "ul", x: [
          "Only albums with an exact day are used (complete years 2015-2025: 7,929). If releases fell evenly on the seven weekdays, each would get 14.3%.",
          "Friday gets 21.0% (95% interval 20.2% to 22.0%; binomial p about 10^-59). The result is unchanged without the 1st of each month (21.0%), a day over-represented at 5.4% against about 3.3% expected, probably because some dates are only approximate.",
          "By type: full-lengths 24.2% on Fridays, singles 20.7%, EPs 18.9%, demos 14.8% (no excess, p = 0.62). By period: 22.5% from 2020 on, against 14.7% in 2010-2014.",
        ] },
      ],
    },
    {
      id: "site", title: "12. What the site itself computes",
      blocks: [
        { t: "p", x: "A few things on the site are calculated when it is built, from the same tables, using fixed rules:" },
        { t: "ul", x: [
          "Key findings cards: values are read from the results above (for example the correlation of -0.54 is recomputed from the 90-country scatter).",
          "Hall of records: oldest bands by formation year, most releases, longest-running active bands and newest bands, ties broken by number of releases.",
          "Similar bands: two bands are similar if they share at least two listed themes. Ranking: 10 points per shared theme, +3 for the same country, +1 for the same purity, and a very small bonus for number of releases (capped). It is a description of shared tags, not of how the music sounds.",
          "Country page ranks: rank by band count among 91 countries; rank per million among the 48 countries with at least 5 bands; comparison with the median rate of those 48.",
          "Standout themes in a country: only for countries with at least 12 bands that list themes. A theme is shown if it appears in at least 4 of the country's bands and its share is at least 1.35 times its share worldwide.",
          "Explorer filters: the decade chips use formation year; themes use the first eight listed themes of each band.",
        ] },
      ],
    },
    {
      id: "quality", title: "13. Data checks",
      blocks: [
        { t: "p", x: "Before any analysis result is accepted, a validation script checks the tables (it fails on errors, and lists warnings):" },
        { t: "ul", x: [
          "no duplicate band ids; the cleaned band table matches the source table row for row;",
          "every discography band exists in the band table; release years fall between 1985 and now;",
          "no duplicate album ids; every album detail belongs to a listed release;",
          "temperatures lie between -40 and 35 °C; a band missing from the discography table is reported;",
          "the share of bands with no listed release stays near zero (it is 1 band of 2,186).",
        ] },
        { t: "table", head: ["Known gap", "Size"], rows: [
          ["No formation year", "590 bands (27.0%)"],
          ["No listed themes", "735 bands (33.6%)"],
          ["International or unknown country", "102 bands"],
          ["Release rows without an album id", "5 rows (0.04%)"],
          ["Release dated more than a year before formation", "1"],
          ["Albums with only a year or month in the date", "406 year-only, 272 month-only"],
        ] },
      ],
    },
    {
      id: "limits", title: "14. Limits you should keep in mind",
      blocks: [
        { t: "ul", x: [
          "The data come from one catalogue. Bands that are not listed, or were listed late, are missing, and themes for new bands are described less completely. Catalogue coverage differs between countries.",
          "Country results are averages across a country. A country-level pattern says nothing about any individual (the ecological fallacy). Correlation is not causation.",
          "Temperature is a 1991-2013 average; GDP and internet are recent values. They do not describe the years when older bands formed.",
          "Many tests were run. Only results that survive correction or hold in most specifications are described as strong; weak ones are described as weak.",
          "Older release dates are less complete and exact days are sometimes only approximate.",
          "Population figures for a few small countries are approximate.",
        ] },
      ],
    },
    {
      id: "corrections", title: "15. Corrections made along the way",
      lead: "Earlier versions of this analysis had problems. They were found, fixed and are listed so that nothing is silently different.",
      blocks: [
        { t: "ul", x: [
          "Country counts dropped bands without a formation year (about 27%); now all bands are counted.",
          "The temperature window was labelled 1991-2020 but the data end in 2013; the label is now correct (1991-2013).",
          "Some countries' temperatures included remote territories (Denmark -16.9 °C with Greenland); the European series is used instead.",
          "Seasonality was first tested on all releases pooled; this was biased by the running year and by growth, and is now tested on complete years only.",
          "Theme shares first divided by all bands; the denominator is now bands that list themes, with confidence intervals and a multiple-testing threshold.",
          "'Longevity' first compared mean ages of active and split-up bands; it now uses survival analysis with censoring.",
          "'Releases' counted a split twice; the home page now shows unique releases (10,786), and 'countries' no longer counts 'International' and 'Unknown' (91, not 93).",
        ] },
      ],
    },
    {
      id: "repro", title: "16. Reproducing it",
      blocks: [
        { t: "p", x: "The source package runs the whole analysis in a fixed order. With band, release and album tables in the format described in INPUT_SCHEMA.md, it recomputes every table and figure; running it on the original tables gives byte-identical results." },
        { t: "code", x: "pip install -r requirements.txt\nbash run_all.sh" },
        { t: "ol", x: [
          "analyze_01: cleaning and descriptive tables",
          "build_regression_dataset: the country table (bands, temperature, economy)",
          "validate_data: integrity checks",
          "analyze_02 and analyze_03: temperature tests, controls, robustness grid, leave-one-out",
          "analyze_04: theme trends",
          "analyze_05: survival analysis, companion genres, themes by country",
          "analyze_06: release formats",
          "analyze_07: months and weekdays",
          "generate_summary: a written summary of all results",
        ] },
      ],
    },
  ],
};

const fa: MethodDoc = {
  title: "روش کار، گام‌به‌گام",
  lead: "اعداد این سایت چطور محاسبه شده‌اند: به همان ترتیبی که تحلیل اجرا می‌شود، با عددهای واقعی و بررسی‌هایی که روی آن‌ها انجام شده. این صفحه فقط درباره‌ی خود تحلیل است.",
  tocTitle: "در این صفحه",
  tldrTitle: "خلاصه",
  tldr: [
    "تحلیل از ۲٬۱۸۶ بندی شروع می‌شود که در Metal Archives زیر ژانر «Depressive Black Metal» ثبت شده‌اند، همراه دیسکوگرافی‌شان و تاریخ انتشار ۱۰٬۷۸۱ آلبوم. دمای کشورها (Berkeley Earth) و تولید ناخالص داخلی سرانه و استفاده از اینترنت (بانک جهانی) هم به آن اضافه شده است.",
    "هر آماره را اسکریپت‌های بسته‌ی سورس حساب می‌کنند (پایتون: pandas، numpy و scipy). هیچ عددی در سایت دستی نوشته نشده است.",
    "هر جا نتیجه ضعیف است یا به انتخاب‌ها بستگی دارد، سایت همین را می‌گوید. چند عدد قبلی در مسیر اصلاح شده‌اند و در پایان صفحه فهرست شده‌اند.",
  ],
  dl: {
    title: "دانلود سورس تحلیل",
    body: "اسکریپت‌ها، نتایج تجمیعی و نمودارهای پشت هر عدد سایت. اگر جدول‌ها را با همان قالبِ توضیح‌داده‌شده بدهید، دقیقاً همین نتایج دوباره ساخته می‌شود.",
    button: "دانلود (zip.)", size: "۱٫۴ مگابایت", file: "/downloads/dsbm-analysis-source.zip",
    contains: ["اسکریپت‌های تحلیل (پاکسازی، رگرسیون، مضامین، بقا، فرمت انتشار، تقویم) و کتابخانه‌ی کوچک آماری‌ای که استفاده می‌کنند", "همه‌ی جدول‌ها و نمودارهای نتیجه (تجمیع‌شده بر اساس کشور، دوره یا روز هفته)", "ورودی‌های سطح کشور (دما و بانک جهانی) و اسکریپت اعتبارسنجی داده", "فایل INPUT_SCHEMA.md که قالب جدول‌های ورودی را شرح می‌دهد"],
    excluded: "همراه نیست: خود جدول‌های بند، انتشار و آلبوم. آن‌ها نسخه‌ای از داده‌های Metal Archives هستند و متعلق به Metal Archives و مشارکت‌کنندگانش.",
  },
  sections: [
    {
      id: "scope", title: "۱. این صفحه چه چیزی را پوشش می‌دهد",
      blocks: [
        { t: "p", x: "صفحه‌ی روش مسیر تحلیل را از جدول‌های آماده تا عددهای منتشرشده دنبال می‌کند: فیلدهای خام چطور پاکسازی و تعریف شدند، داده‌ی سطح کشور چطور ساخته شد، چه آزمون‌هایی با چه پارامترهایی اجرا شد و هر نتیجه تا چه حد قابل اعتماد است." },
        { t: "p", x: "درباره‌ی اینکه خود رکوردها چگونه به دست آمده‌اند توضیحی نمی‌دهد. بندها، دیسکوگرافی‌ها و تاریخ‌های انتشار از Metal Archives آمده‌اند؛ دما از Berkeley Earth؛ تولید ناخالص داخلی سرانه و استفاده از اینترنت از بانک جهانی." },
        { t: "note", x: "لوگو و عکس بندها هرگز در این سایت ذخیره نمی‌شود. با لینک از جای اصلی‌شان نمایش داده می‌شود و متعلق به هنرمندان و لیبل‌هاست." },
      ],
    },
    {
      id: "data", title: "۲. داده‌ای که تحلیل از آن شروع می‌شود",
      lead: "سه جدول در سطح بند و سه ورودی در سطح کشور.",
      blocks: [
        { t: "table", head: ["جدول", "هر ردیف", "اندازه", "فیلدهای اصلی"], rows: [
          ["بندها", "یک بند", "2,186", "کشور، سال تأسیس، وضعیت، ژانرها، مضامین شعری، سال‌های فعالیت، لیبل فعلی یا آخرین لیبل"],
          ["دیسکوگرافی", "یک انتشار فهرست‌شده برای یک بند", "11,130 ردیف (10,786 انتشار یکتا)", "عنوان، نوع، سال، ماه، شناسه‌ی آلبوم"],
          ["جزئیات آلبوم", "صفحه‌ی یک آلبوم", "10,781 آلبوم", "تاریخ انتشار به‌صورتی که نوشته شده، سال و ماه و روزِ استخراج‌شده و دقت تاریخ (روز / ماه / سال)"],
          ["دما", "یک کشور", "91 کشور", "میانگین دما (Berkeley Earth)"],
          ["اقتصاد", "یک کشور", "91 کشور", "تولید ناخالص داخلی سرانه (دلار جاری)، درصد کاربران اینترنت، بانک جهانی"],
          ["جمعیت", "یک کشور", "91 کشور", "میلیون نفر، حدود ۲۰۲۳، جدولی که در `common.py` نگه‌داری می‌شود"],
        ] },
        { t: "p", x: "چرا 11,130 ردیف ولی 10,786 انتشار: آلبومِ مشترک (اسپلیت) زیر هر دو بندی که در آن هستند فهرست شده است. وقتی شناسه‌ی آلبوم موجود باشد، ردیف‌ها به یک انتشار ادغام می‌شوند و این 344 تکرار را حذف می‌کند. صفحه‌ی هر بند فهرست خودش را نشان می‌دهد، پس جمعشان 11,130 می‌شود." },
      ],
    },
    {
      id: "clean", title: "۳. پاکسازی و تعریف‌ها",
      lead: "هر تعریف زیر در همه‌ی بخش‌های سایت یکسان به کار رفته است.",
      blocks: [
        { t: "ul", x: [
          "سال تأسیس: عدد چهاررقمی فیلد «formed in». 590 بند (27.0%) سال تأسیس ندارند و در هر چیزی که سال می‌خواهد کنار گذاشته می‌شوند.",
          "وضعیت: فعال، منحل‌شده، نامشخص، تغییر نام، متوقف یا مورد اختلاف، همان‌طور که ثبت شده. 72.3% بندها فعال‌اند.",
          "کشور: کشور صفحه‌ی خودِ بند. املاهای مختلف یکی می‌شوند («Türkiye» می‌شود «Turkey» و «Korea, South» می‌شود «South Korea»). بندهای International (86) و Unknown (16) در شمارش بندها می‌مانند ولی از همه‌ی مقایسه‌های کشوری بیرون‌اند. نتیجه 91 کشور است.",
          "مضامین: مضمون‌های شعریِ ثبت‌شده، با حروف کوچک و جداشده با ویرگول، اسلش و نقطه‌ویرگول. 735 بند (33.6%) هیچ مضمونی ثبت نکرده‌اند؛ آن‌ها از سهم‌های مضمون بیرون می‌مانند و «بدون مضمون» شمرده نمی‌شوند.",
          "DSBM خالص: همه‌ی برچسب‌های ژانر بند املای ساده‌ی DSBM باشند («Depressive Black Metal»، «Depressive Suicidal Black Metal»، «DSBM» و ...). هر چیز دیگر («Depressive/Post-Black Metal»، «Raw Depressive Black Metal» و مانند آن) ترکیبی است. 62.4% بندها (1,363) خالص‌اند.",
          "ژانرهای همراه: برچسب‌هایی که بعد از حذف همه‌ی املاهای DSBM و توضیح‌های داخل پرانتز مثل «(early)» یا «(later)» می‌مانند، در خانواده‌هایی گروه‌بندی شده‌اند (اتمسفریک بلک‌متال، پست‌بلک‌متال، امبیانت، راو بلک‌متال، دوم‌متال، شوگیز و ...). 793 بند دست‌کم یکی دارند.",
          "سال‌های فعالیت: بازه‌هایی مثل «1992-2000 (as X), 2005-present» به یک سال شروع و یک سال پایان تبدیل می‌شوند؛ «present» یا «?» یعنی هنوز فعال. اگر بازه خوانده نشود، سال تأسیس به‌جای شروع می‌نشیند.",
          "سال مرجع: هر جا سن لازم باشد، سال جاری (2026) به کار می‌رود و سال در حال گذر ناقص حساب می‌شود.",
          "دوره‌های ثابت: 1992-2009، 2010-2014، 2015-2019 و 2020 به بعد. دهه‌ها کنار گذاشته شدند چون در دهه‌ی ۱۹۹۰ فقط 9 بند تأسیس شده است.",
        ] },
      ],
    },
    {
      id: "external", title: "۴. دما، اقتصاد و جمعیت",
      blocks: [
        { t: "ul", x: [
          "دما: برای هر کشور، میانگینِ دمای میانگین سالانه در بازه‌ی 1991-2013. فایل منبعِ استفاده‌شده در 2013 تمام می‌شود، پس بازه 1991-2013 است، نه 1991-2020. میانگین سالانه‌ها گرفته می‌شود (نه همه‌ی ماه‌ها با هم) تا سال‌هایی که ماه کم دارند وزن بیشتری پیدا نکنند.",
          "هر جا Berkeley Earth سری جداگانه‌ی «X (Europe)» دارد از همان استفاده شده، چون سری ساده‌ی یک کشور ممکن است سرزمین‌های دور را هم شامل شود (دانمارک با گرینلند منفی 16.9 درجه شد).",
          "دمای دو کشور با برچسب «suspect» نگه داشته شد ولی جدا آزموده می‌شود: نروژ (سری ممکن است سوالبارد را شامل شود) و گرجستان (9.25 درجه بیش از حد به آلمان با 9.23 نزدیک است و تطبیق نام سری نامطمئن است). برچسب «bad» کشور را کنار می‌گذاشت؛ هیچ کشوری نماند.",
          "تولید ناخالص داخلی سرانه و اینترنت: آخرین مقدار غیرخالیِ هر کشور بین 2018 و 2023، با ثبت سال آن.",
          "جمعیت: جدولی به میلیون نفر برای حدود 2023، گردشده. عدد چند جای کوچک تقریبی است.",
        ] },
      ],
    },
    {
      id: "country", title: "۵. جدول کشورها",
      blocks: [
        { t: "p", x: "برای هر کشور: تعداد بندها (همه‌ی بندهای آن کشور، با احتساب بندهای بدون سال تأسیس)، جمعیت، و بند به‌ازای هر میلیون نفر = تعداد بند ÷ جمعیت به میلیون." },
        { t: "ul", x: [
          "رتبه‌بندی به‌ازای هر میلیون فقط کشورهای دست‌کم 5 بندی را دربرمی‌گیرد (48 کشور)، چون یک یا دو بند در یک کشور کوچک نرخ‌های افراطی می‌سازد (جبل‌طارق: 1 بند = 29.4 به‌ازای هر میلیون؛ ایسلند: 3 بند = 7.7).",
          "فنلاند با 39 بند و 7.09 به‌ازای هر میلیون اول است، بعد سوئد 5.52، مولداوی 2.69، لیتوانی 2.41 و نروژ 2.18. در شمارش خام ترتیب این است: آمریکا 415، روسیه 219، آلمان 128، برزیل 115.",
          "رنگ‌های نقشه پله‌های ثابت دارند: بند 1 / 3 / 10 / 30 / 100؛ به‌ازای هر میلیون 0.05 / 0.2 / 0.5 / 1.5 / 3؛ دما 0 / 5 / 10 / 15 / 20 درجه.",
        ] },
        { t: "note", x: "نسخه‌ی قبلی فقط بندهای دارای سال تأسیس را می‌شمرد و بی‌صدا حدود 27% از همه‌ی بندها و حدود 35% از بندهای آمریکا را حذف می‌کرد. حالا همه‌ی بندها شمرده می‌شوند." },
      ],
    },
    {
      id: "growth", title: "۶. رشد در طول زمان",
      blocks: [
        { t: "p", x: "بندها بر اساس سال تأسیس از 1985 شمرده می‌شوند. سال در حال گذر (2026، تا اینجا 35 بند) ناقص رسم می‌شود و افت خوانده نمی‌شود. شلوغ‌ترین سال‌های تأسیس 2023 (125 بند)، 2024 (123) و 2013 (95) هستند. بندهای بدون سال تأسیس در این نمودار نیستند." },
      ],
    },
    {
      id: "climate", title: "۷. آیا اقلیم نقش دارد؟ آزمون دما",
      lead: "در دو مرحله اجرا شده: یک مقایسه‌ی ساده، بعد مجموعه‌ای از کنترل‌ها و بررسی‌های پایداری.",
      blocks: [
        { t: "p", x: "مرحله‌ی اول، میانگین دمای هر کشور را با بند به‌ازای هر میلیونِ آن مقایسه می‌کند." },
        { t: "table", head: ["کشورها", "n", "پیرسون r", "اسپیرمن ρ", "شیب OLS به‌ازای هر درجه", "p (مقاوم)"], rows: [
          ["همه‌ی کشورهای دارای دما", "90", "-0.542", "-0.644", "-0.085 بند به‌ازای هر میلیون", "< 0.001"],
          ["دست‌کم 10 بند", "32", "-0.455", "-0.548", "-0.086", "0.031"],
        ] },
        { t: "p", x: "خطای استاندارد OLS در برابر ناهمواریانسی مقاوم است (HC3). یک مدل شمارشی هم برازش شد: مدل پواسون برای تعداد بندها با لگاریتم جمعیت به‌عنوان offset و خطای استاندارد مقاوم، چون شمارش بندها پراکندگی بیش از حد دارد (پراکندگی 34 تا 90). برای هر 90 کشور حدود منفی 7.9% بند به‌ازای هر درجه‌ی بیشتر می‌دهد (p = 0.001) و برای 32 صحنه‌ی بزرگ‌تر حدود منفی 2.9% (p = 0.31)." },
        { t: "p", x: "مرحله‌ی دوم، تولید ناخالص داخلی سرانه (به‌ازای هر 10,000 دلار) و استفاده از اینترنت (به‌ازای هر 10 درصد) را به‌عنوان کنترل اضافه می‌کند (89 کشور با داده‌ی کامل) و ضریب دما را در نُه حالت دوباره می‌آزماید. نتیجه فقط وقتی «محکم» نامیده می‌شود که در بیشترشان دوام بیاورد." },
        { t: "table", head: ["حالت", "n", "اثر دما", "p (مقاوم)"], rows: [
          ["S0 شمارش قدیمی (فقط بندهای دارای سال)", "89", "-0.045", "0.0009"],
          ["S1 همه‌ی بندها شمرده شده", "89", "-0.068", "0.0004"],
          ["S2 OLS، دماهای نادرستِ شناخته‌شده حذف (OLS اصلی)", "89", "-0.068", "0.0004"],
          ["S3 فقط کشورهای دست‌کم 10 بندی", "32", "-0.070", "0.106"],
          ["S4 OLS روی لگاریتم نرخ", "89", "-0.089", "< 0.0001"],
          ["S5 مدل شمارشی پواسون (مدل شمارشی اصلی)", "89", "-0.041 (حدود منفی 4% به‌ازای هر درجه)", "0.244"],
          ["S6 پواسون، دست‌کم 10 بند", "32", "-0.034", "0.531"],
          ["S7 OLS بدون نروژ و گرجستان", "87", "-0.068", "0.0008"],
          ["S8 پواسون بدون نروژ و گرجستان", "87", "-0.041", "0.251"],
        ], cap: "ضریب دما: بند به‌ازای هر میلیون به‌ازای هر درجه (OLS) یا در مقیاس لگاریتم (پواسون)." },
        { t: "p", x: "بررسی‌های دیگر: اثرهای استانداردشده در S2 عبارت‌اند از دما -0.43، تولید ناخالص +0.28 و اینترنت -0.01. حذف تک‌تک کشورها (leave-one-out) ضریب دما را هر بار بین -0.074 و -0.058 و با p کمتر از 0.001 نگه می‌دارد. همبستگی بین پیش‌بین‌ها قابل‌توجه است (دما با تولید ناخالص -0.40، دما با اینترنت -0.47، تولید ناخالص با اینترنت 0.59)." },
        { t: "p", x: "برداشت: جهت رابطه در همه‌ی مدل‌ها یکی است. نتیجه‌ی OLS در برابر کنترل‌ها و حذف هر یک از کشورها پایدار می‌ماند، ولی در مدل‌های شمارشی و در کشورهای دست‌کم 10 بندی معنادار نیست. این یک الگوی بین کشورهاست، نه علت: ثروت، دسترسی به اینترنت، میزان ثبت یک صحنه در Metal Archives و تاریخچه‌ی متال شمال اروپا همه بین کشورها فرق دارند و همگی همراه دما حرکت می‌کنند." },
      ],
    },
    {
      id: "themes", title: "۸. مضامین شعری در طول زمان",
      blocks: [
        { t: "ol", x: [
          "بندها بر اساس دوره‌ی تأسیس (همان چهار دوره‌ی ثابت) گروه‌بندی می‌شوند و فقط بندهایی که هم سال تأسیس و هم دست‌کم یک مضمون دارند به کار می‌روند (n = 1,271 برای آزمون روند؛ 1,451 بند اصلاً مضمون دارند).",
          "برای هر یک از 8 مضمونِ کلیدی (خودکشی، افسردگی، بیماری روانی، آسیب به خود، طبیعت، انسان‌گریزی، نیهیلیسم، انزوا) سهم بندهایی که آن را ثبت کرده‌اند در هر دوره محاسبه می‌شود. مخرج، بندهایی است که هر مضمونی ثبت کرده‌اند، نه همه‌ی بندها.",
          "هر سهم یک بازه‌ی اطمینان 95% ویلسون دارد و تعداد بندها روی هر نقطه نشان داده می‌شود.",
          "روند: همبستگی اسپیرمن بین سال تأسیس و اینکه بند آن مضمون را ثبت کرده یا نه.",
          "چون 8 مضمون آزموده می‌شود، آستانه‌ی بونفرونی به کار می‌رود: p < 0.05 ÷ 8 = 0.00625.",
        ] },
        { t: "table", head: ["مضمون", "اسپیرمن ρ", "p", "از بونفرونی می‌گذرد؟"], rows: [
          ["آسیب به خود (self-harm)", "+0.152", "< 0.001", "بله (صعودی)"],
          ["طبیعت (nature)", "-0.100", "0.0004", "بله (نزولی)"],
          ["بیماری روانی (mental illness)", "+0.087", "0.0019", "بله (صعودی)"],
          ["افسردگی (depression)", "+0.074", "0.0084", "خیر"],
          ["خودکشی (suicide)", "+0.059", "0.034", "خیر"],
          ["انزوا (isolation)", "+0.027", "0.34", "خیر"],
          ["نیهیلیسم (nihilism)", "-0.038", "0.17", "خیر"],
          ["انسان‌گریزی (misanthropy)", "-0.020", "0.47", "خیر"],
        ] },
        { t: "p", x: "برداشت: اثرها کوچک‌اند (|ρ| حداکثر 0.15). افسردگی و خودکشی در هر دوره رایج‌ترین مضمون‌ها هستند و کم نشده‌اند. سهم بندهای بدون مضمون از 10.2% (1992-2009) به 26.7% (از 2020 به بعد) می‌رسد، پس بندهای تازه احتمالاً ناقص‌تر توصیف شده‌اند و سهم‌های دوره‌های اخیر قطعیت کمتری دارند." },
      ],
    },
    {
      id: "lifespan", title: "۹. بندها چقدر دوام می‌آورند",
      blocks: [
        { t: "p", x: "مقایسه‌ی سن بندهای فعال و منحل‌شده گمراه‌کننده است، چون بندهای فعال هنوز تمام نشده‌اند. پس از تحلیل بقا استفاده می‌شود که در آن بندهای هنوز فعال «سانسور شده» حساب می‌شوند (دانسته است که دست‌کم این‌قدر دوام آورده‌اند)." },
        { t: "ol", x: [
          "شروع = اولین سال در فیلد سال‌های فعالیت، یا سال تأسیس اگر آن فیلد خوانده نشود.",
          "فقط بندهای با وضعیت فعال یا منحل‌شده به کار می‌روند. بند منحل‌شده باید سال پایانِ قابل استفاده داشته باشد؛ اگر نداشته باشد مدت آن مجهول است و بند کنار گذاشته می‌شود.",
          "مدت = سال پایان - سال شروع + 1 برای بندهای منحل‌شده، و سال جاری - سال شروع + 1 برای بندهای فعال (سانسورشده). مدت‌های کمتر از یک سال کنار می‌روند.",
          "منحنی بقای کاپلان–مایر جداگانه برای DSBM خالص و بندهای ترکیبی برآورد می‌شود و با آزمون لگ‌رنک مقایسه می‌شود.",
        ] },
        { t: "table", head: ["گروه", "بند", "منحل‌شده", "هنوز فعال (سانسورشده)", "بقا در 5 سال", "بقا در 10 سال"], rows: [
          ["DSBM خالص", "853", "197", "656", "80.2%", "73.2%"],
          ["ترکیبی", "517", "77", "440", "88.0%", "83.7%"],
        ], cap: "1,370 بند، 274 پایانِ مشاهده‌شده. میانه تا سال بیستم در هیچ‌کدام از دو گروه نمی‌رسد." },
        { t: "p", x: "آزمون لگ‌رنک، خالص در برابر ترکیبی: کای‌دو = 16.55، p = 0.00005. برداشت: در این داده بندهای ترکیبی بیشتر دوام می‌آورند. احتیاط: برچسب ژانر همان چیزی است که امروز ثبت شده، و بندهای با تاریخچه‌ی کوتاه پیگیری کمی دارند." },
      ],
    },
    {
      id: "formats", title: "۱۰. فرمت انتشار در طول زمان",
      blocks: [
        { t: "p", x: "ابتدا تکرارها حذف می‌شوند (یک ردیف برای هر شناسه‌ی آلبوم؛ ردیف‌های بدون شناسه بر اساس بند، عنوان، نوع و سال یکتا می‌شوند) که 10,786 انتشار یکتا می‌دهد. هر انتشار بر اساس سال انتشار به یک دوره می‌رود و نوعش (آلبوم بلند، EP، دمو، اسپلیت، تک‌آهنگ، گردآوری، دیگر) تا جایی که ممکن بوده از صفحه‌ی خود آلبوم گرفته شده است." },
        { t: "table", head: ["دوره", "انتشار", "آلبوم بلند", "EP", "دمو", "اسپلیت", "تک‌آهنگ", "گردآوری"], rows: [
          ["1992-2009", "469", "20.3%", "7.5%", "52.9%", "14.7%", "2.8%", "1.7%"],
          ["2010-2014", "1,442", "26.1%", "16.3%", "29.3%", "16.5%", "7.8%", "2.9%"],
          ["2015-2019", "2,197", "31.7%", "22.3%", "15.1%", "10.2%", "16.1%", "3.5%"],
          ["2020 به بعد", "6,678", "23.7%", "23.9%", "10.0%", "5.8%", "32.4%", "2.1%"],
        ], cap: "سهم‌ها حدود 100% می‌شوند (نوع کوچکِ «دیگر» نشان داده نشده)." },
        { t: "p", x: "برداشت: دمو از بیش از نیمی از انتشارها به حدود یک‌دهم می‌رسد و تک‌آهنگ از تقریباً هیچ به حدود یک‌سوم. زمان‌بندی با گذار به انتشار دیجیتال هم‌خوان است، ولی این داده دلیلش را آزمون نمی‌کند." },
      ],
    },
    {
      id: "calendar", title: "۱۱. ماه‌ها و روزهای هفته",
      blocks: [
        { t: "p", x: "از 10,781 آلبومِ دارای تاریخ، 10,375 ماه دارند (96.2%) و 10,103 روز دقیق (93.7%). یک انتشار با تاریخ آینده کنار گذاشته شد. پوشش ماه یکنواخت نیست: 70.8% پیش از 2010، 86.4% در 2010-2014، 98.4% در 2015-2019 و 99.4% از 2020. به همین دلیل ماه‌ها فقط روی سال‌های اخیرِ کامل آزمون می‌شوند." },
        { t: "h", x: "ماه‌ها" },
        { t: "ul", x: [
          "آزمون اصلی: فقط سال‌های کامل 2015-2025 (7,986 انتشار). سال جاری ناقص است و انتشار سالانه به‌شدت رشد کرده، پس جمع کردن همه‌ی سال‌ها سال‌های شلوغ اخیر را بیش از اندازه وزن می‌داد.",
          "تعداد مورد انتظار متناسب با تعداد روزهای هر ماه است (بهمن/فوریه 28.25 روز)، بعد آزمون کای‌دو اجرا می‌شود.",
          "بررسی دوم که در برابر رشد ایمن است، هر سال را با مجموع خودش مقایسه می‌کند و مقدارهای کای‌دو را جمع می‌کند.",
          "سهم زمستان (دسامبر تا فوریه) با آزمون دوجمله‌ای با سهم مورد انتظارش مقایسه می‌شود.",
        ] },
        { t: "table", head: ["آزمون", "n", "کای‌دو", "p"], rows: [
          ["ماه‌ها، سال‌های کامل 2015-2025 (اصلی)", "7,986", "22.96", "0.018"],
          ["ماه‌ها، سال‌های کامل 2020-2025", "5,824", "15.57", "0.158"],
          ["آزمون تجمیعیِ درون‌سالی", "-", "178.7 (121 درجه آزادی)", "< 0.001"],
          ["سهم زمستان: 25.1% در برابر 24.7% مورد انتظار", "7,986", "-", "0.41"],
        ] },
        { t: "p", x: "برداشت: اثر ماه ضعیف و ناپایدار است. از 2015 به بعد معنادار است و از 2020 به بعد از بین می‌رود، و شلوغ‌ترین و خلوت‌ترین ماه فقط حدود 17% با هم فرق دارند. این فکر که زمستان فصل انتشار است تأیید نمی‌شود." },
        { t: "h", x: "روزهای هفته" },
        { t: "ul", x: [
          "فقط آلبوم‌های با روز دقیق به کار می‌روند (سال‌های کامل 2015-2025: 7,929). اگر انتشارها یکنواخت روی هفت روز می‌افتادند، سهم هر روز 14.3% می‌شد.",
          "جمعه 21.0% می‌گیرد (بازه‌ی اطمینان 95% از 20.2% تا 22.0%؛ p دوجمله‌ای حدود 10^-59). نتیجه بدون روز اول هر ماه هم تغییر نمی‌کند (21.0%)؛ روزی که با 5.4% در برابر حدود 3.3% مورد انتظار بیش‌ازحد دیده می‌شود، احتمالاً چون بعضی تاریخ‌ها تقریبی‌اند.",
          "بر اساس نوع: آلبوم‌های بلند 24.2% جمعه، تک‌آهنگ‌ها 20.7%، EPها 18.9%، دموها 14.8% (بدون برتری، p = 0.62). بر اساس دوره: 22.5% از 2020 به بعد، در برابر 14.7% در 2010-2014.",
        ] },
      ],
    },
    {
      id: "site", title: "۱۲. چه چیزهایی را خود سایت حساب می‌کند",
      blocks: [
        { t: "p", x: "چند چیز در سایت هنگام ساخته شدنش از همین جدول‌ها و با قاعده‌های ثابت محاسبه می‌شود:" },
        { t: "ul", x: [
          "کارت‌های یافته‌های کلیدی: مقدارها از نتایج بالا خوانده می‌شوند (مثلاً همبستگی -0.54 از نمودار پراکنش 90 کشور دوباره حساب می‌شود).",
          "رکوردها: قدیمی‌ترین بندها بر اساس سال تأسیس، بیشترین انتشار، طولانی‌ترین بندهای فعال و جدیدترین بندها؛ در تساوی، تعداد انتشار تعیین‌کننده است.",
          "بندهای مشابه: دو بند مشابه‌اند اگر دست‌کم دو مضمونِ ثبت‌شده‌ی مشترک داشته باشند. امتیاز: 10 برای هر مضمون مشترک، 3+ برای یک کشور، 1+ برای یک نوع خلوص، و یک امتیاز بسیار کوچک برای تعداد انتشار (با سقف). این توصیفِ برچسب‌های مشترک است، نه صدای موسیقی.",
          "رتبه‌ها در صفحه‌ی کشور: رتبه بر اساس تعداد بند در میان 91 کشور؛ رتبه به‌ازای هر میلیون در میان 48 کشورِ دست‌کم 5 بندی؛ مقایسه با میانه‌ی نرخ همان 48 کشور.",
          "مضمون‌های متمایز در یک کشور: فقط برای کشورهایی که دست‌کم 12 بندِ دارای مضمون دارند. مضمونی نشان داده می‌شود که در دست‌کم 4 بند آن کشور باشد و سهمش دست‌کم 1.35 برابر سهمش در جهان باشد.",
          "فیلترهای فهرست بندها: چیپ‌های دهه از سال تأسیس استفاده می‌کنند؛ مضمون‌ها هشت مضمون اول ثبت‌شده‌ی هر بند را به کار می‌برند.",
        ] },
      ],
    },
    {
      id: "quality", title: "۱۳. بررسی‌های داده",
      blocks: [
        { t: "p", x: "پیش از پذیرفتن هر نتیجه، یک اسکریپت اعتبارسنجی جدول‌ها را بررسی می‌کند (روی خطاها متوقف می‌شود و هشدارها را فهرست می‌کند):" },
        { t: "ul", x: [
          "شناسه‌ی تکراری بند نباشد؛ جدول بندهای پاکسازی‌شده ردیف‌به‌ردیف با جدول منبع بخواند؛",
          "هر بندِ دیسکوگرافی در جدول بندها باشد؛ سال انتشارها بین 1985 و امروز باشد؛",
          "شناسه‌ی آلبومِ تکراری نباشد؛ جزئیات هر آلبوم به یک انتشار فهرست‌شده تعلق داشته باشد؛",
          "دماها بین -40 و 35 درجه باشند؛ بندِ جاافتاده از دیسکوگرافی گزارش شود؛",
          "سهم بندهای بدون انتشار نزدیک صفر بماند (1 بند از 2,186).",
        ] },
        { t: "table", head: ["کمبود شناخته‌شده", "اندازه"], rows: [
          ["بدون سال تأسیس", "590 بند (27.0%)"],
          ["بدون مضمون ثبت‌شده", "735 بند (33.6%)"],
          ["کشور بین‌المللی یا نامشخص", "102 بند"],
          ["ردیف انتشار بدون شناسه‌ی آلبوم", "5 ردیف (0.04%)"],
          ["انتشار با تاریخی بیش از یک سال پیش از تأسیس", "1"],
          ["آلبوم با تاریخ فقط سال یا فقط ماه", "406 فقط سال، 272 فقط ماه"],
        ] },
      ],
    },
    {
      id: "limits", title: "۱۴. محدودیت‌هایی که باید در نظر داشته باشید",
      blocks: [
        { t: "ul", x: [
          "داده از یک فهرست آمده است. بندهای ثبت‌نشده یا دیر ثبت‌شده نیستند و مضمون بندهای تازه ناقص‌تر توصیف شده. پوشش فهرست بین کشورها فرق می‌کند.",
          "نتیجه‌های کشوری میانگین کل یک کشورند. الگوی سطح کشور درباره‌ی هیچ فردی چیزی نمی‌گوید (مغالطه‌ی بوم‌شناختی). همبستگی علّیت نیست.",
          "دما میانگین 1991-2013 است؛ تولید ناخالص و اینترنت مقدارهای اخیرند. سال‌هایی را که بندهای قدیمی‌تر تشکیل شدند توصیف نمی‌کنند.",
          "آزمون‌های زیادی اجرا شده. فقط نتیجه‌هایی که از تصحیح می‌گذرند یا در بیشتر حالت‌ها پایدارند «قوی» نامیده می‌شوند؛ ضعیف‌ها ضعیف نامیده می‌شوند.",
          "تاریخ انتشارهای قدیمی‌تر کامل‌تر نیست و روزهای دقیق گاهی فقط تقریبی‌اند.",
          "جمعیت چند کشور کوچک تقریبی است.",
        ] },
      ],
    },
    {
      id: "corrections", title: "۱۵. اصلاح‌هایی که در مسیر انجام شد",
      lead: "نسخه‌های قبلی این تحلیل مشکل داشتند. پیدا و اصلاح شدند و اینجا فهرست شده‌اند تا هیچ چیز بی‌صدا فرق نکرده باشد.",
      blocks: [
        { t: "ul", x: [
          "شمارش کشورها بندهای بدون سال تأسیس را (حدود 27%) حذف می‌کرد؛ حالا همه‌ی بندها شمرده می‌شوند.",
          "بازه‌ی دما «1991-2020» برچسب خورده بود ولی داده در 2013 تمام می‌شود؛ برچسب حالا درست است (1991-2013).",
          "دمای بعضی کشورها سرزمین‌های دور را هم شامل می‌شد (دانمارک با گرینلند منفی 16.9 درجه)؛ حالا سری اروپایی به کار می‌رود.",
          "فصل‌بندی ابتدا روی همه‌ی انتشارهای جمع‌شده آزموده شد؛ سال در حال گذر و رشد آن را مخدوش می‌کرد و حالا فقط روی سال‌های کامل آزموده می‌شود.",
          "سهم مضمون‌ها ابتدا بر همه‌ی بندها تقسیم می‌شد؛ مخرج حالا بندهای دارای مضمون است، با بازه‌ی اطمینان و آستانه‌ی آزمون‌های چندگانه.",
          "«ماندگاری» ابتدا میانگین سن بندهای فعال و منحل‌شده را مقایسه می‌کرد؛ حالا از تحلیل بقا با سانسور استفاده می‌کند.",
          "«انتشار» اسپلیت را دوبار می‌شمرد؛ صفحه‌ی اصلی حالا انتشار یکتا (10,786) را نشان می‌دهد و «کشور» دیگر «International» و «Unknown» را نمی‌شمارد (91، نه 93).",
        ] },
      ],
    },
    {
      id: "repro", title: "۱۶. تکرار تحلیل",
      blocks: [
        { t: "p", x: "بسته‌ی سورس کل تحلیل را با ترتیب ثابت اجرا می‌کند. اگر جدول‌های بند، انتشار و آلبوم را با قالبِ توضیح‌داده‌شده در INPUT_SCHEMA.md بدهید، همه‌ی جدول‌ها و نمودارها دوباره ساخته می‌شوند؛ اجرا روی جدول‌های اصلی نتایج دقیقاً یکسان می‌دهد." },
        { t: "code", x: "pip install -r requirements.txt\nbash run_all.sh" },
        { t: "ol", x: [
          "analyze_01: پاکسازی و جدول‌های توصیفی",
          "build_regression_dataset: جدول کشورها (بند، دما، اقتصاد)",
          "validate_data: بررسی‌های درستی داده",
          "analyze_02 و analyze_03: آزمون دما، کنترل‌ها، جدول پایداری، leave-one-out",
          "analyze_04: روند مضامین",
          "analyze_05: تحلیل بقا، ژانرهای همراه، مضمون به تفکیک کشور",
          "analyze_06: فرمت انتشار",
          "analyze_07: ماه‌ها و روزهای هفته",
          "generate_summary: خلاصه‌ی نوشتاری همه‌ی نتایج",
        ] },
      ],
    },
  ],
};

export const methodDoc = (l: Locale): MethodDoc => (l === "fa" ? fa : en);
