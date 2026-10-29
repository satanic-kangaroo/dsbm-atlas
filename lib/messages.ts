import type { Locale } from "./i18n";

const en = {
  brand: "DSBM Atlas",
  nav: { growth: "Growth", places: "Places", climate: "Climate", themes: "Themes", lifespan: "Lifespan", formats: "Formats", calendar: "Calendar", bands: "Bands", method: "Method" },
  hero: {
    h1: "Depressive Suicidal Black Metal, counted.",
    lead: "The most complete public picture of the genre we could build: every DSBM band listed on Metal Archives, where they come from, what they write about, how long they last and when they release.",
    stats: ["bands", "countries", "releases", "exact release dates"],
    care: "This site counts and maps music. If any of this is close to home, you are not alone: findahelpline.com lists free local helplines.",
  },
  growth: { title: "How it grew", cap: "Formation year of each band", body: "The genre barely existed before 2005 and has roughly tripled since. The busiest formation years are 2023, 2024 and 2013. {n} bands have no formation year on their page and are left out of this chart; {yr} is not finished yet." },
  atlas: {
    title: "Where it lives", cap: "Atlas", layers: ["Bands", "Per million people", "Average temperature"], views: ["Globe", "Tiles"],
    hint: "Drag to turn the globe, scroll to zoom, click a country for its page. Height shows the layer's value.",
    tilesHint: "Each square is one country, placed roughly where it sits on the map, so small countries are as visible as big ones.",
    nodata: "no data", unplaced: "{a} bands are listed as International or Unknown origin and are not on the map.", bands: "bands", perMillion: "per million", noBands: "No bands recorded", micro: "Small places (not in the map outline) appear as pins.",
    barsTitle: "Bands by country", barsBody: "The United States and Russia lead in raw numbers. Per person, the picture flips to the Nordics: Finland and Sweden have the most DSBM bands per million inhabitants among countries with at least five bands.", barsToggle: ["Bands", "Per million people"],
  },
  climate: {
    title: "Does the cold matter?", cap: "Average temperature and bands per million people",
    body: "Across {n} countries, colder places tend to have more DSBM bands per person. That is a pattern in country averages, not proof that cold causes anything. The link gets weaker once wealth and internet access are accounted for, and it is not significant among countries with 10 or more bands.",
    x: "Average temperature (°C, 1991–2013)", y: "Bands per million (log scale)", minLabel: "Only countries with at least {n} bands", tested: "Tested in {k} different ways. Dot = clearly different from zero.", model: "Model", effect: "Effect per +1 °C",
    caution: "Caution: each dot is a whole country. Individual bands and listeners are not measured here.",
  },
  themes: { title: "What they write about", cap: "Share of bands with each lyrical theme", body: "Themes are listed on each band page. Choose up to four. Whiskers show 95% intervals; the earliest period has few bands, so read it loosely.", y: "Share of bands with a theme" },
  life: { title: "How long they last", cap: "Share of bands still going after 5 and after 10 years", body: "Active bands are counted as still going, not as finished. Bands that mix DSBM with another style last longer than pure DSBM: {a}% against {b}% still going after 10 years.", pure: "pure DSBM", hybrid: "hybrid", y5: "after 5 years", y10: "after 10 years" },
  formats: { title: "Demo tapes to digital singles", cap: "Release types by period", body: "Demos were more than half of releases before 2010 and about one in ten now. Singles went from almost none to a third of releases. The shift follows the move to digital release and Bandcamp." },
  calendar: {
    title: "When they release", body: "Friday is the day: {f}% of releases with an exact date, against 14% if days were equal. The effect is strongest for full albums and absent for demos. Months are close to even; the winter idea does not hold up.",
    today: "On this day", releasesOn: "Releases on {d}", none: "None recorded on this day.", weekday: "Releases by weekday", month: "Releases by month (complete years)",
  },
  bands: { title: "Browse the bands", search: "Name or theme", allCountries: "All countries", allStatuses: "All statuses", pure: "Pure DSBM only", sortName: "Sort: name", sortNew: "Sort: newest", sortRel: "Sort: most releases", more: "Show more", count: "{n} bands", formed: "Formed", releases: "releases", ma: "On Metal Archives", loading: "Loading bands…" },
  country: { close: "Close", back: "All countries", kp: ["bands", "per million people", "population (millions)", "average temperature", "GDP per person", "internet users"], active: "still active", pure: "pure DSBM", mid: "median formation year", formed: "Formation year", status: "Status", themes: "Most common themes", genres: "Genres", top: "Bands with the most releases", browse: "Browse all {n} bands", note: "Temperature is the 1991–2013 average (Berkeley Earth); GDP and internet use are the latest World Bank values. Small samples: read countries with few bands loosely.", noTemp: "No temperature or population data for this place.", all: "All bands" },
  band: { country: "Country", formed: "Formed", status: "Status", label: "Label", genres: "Genres", themes: "Themes", location: "Location", activeYears: "Years active", discography: "Discography", noReleases: "No releases listed.", ma: "Band page on Metal Archives", logoAlt: "Logo of {n}", releasesTotal: "{n} releases" },
  ui: { skip: "Skip to content", search: "Search", searchPlaceholder: "Search bands, countries, themes…", searchHint: "↑ ↓ to move · Enter to open · Esc to close", noResults: "Nothing found for", bandsGroup: "Bands", countriesGroup: "Countries", sectionsGroup: "Jump to", actions: "Actions", random: "Surprise me", randomBand: "Open a random band", menu: "Menu", close: "Close", theme: "Toggle light / dark", language: "Switch language", copy: "Copy link", copied: "Link copied", top: "Back to top", openPage: "Open page", progress: "Reading progress", typeToSearch: "Type a band name, a country or a theme" },
  hero2: { cta1: "Explore the globe", cta2: "Surprise me", eyebrow: "Metal Archives" },
  take: {
    growth: "The genre has roughly tripled since 2005.",
    places: "Big scenes in the US and Russia; densest per person in the Nordics.",
    climate: "Colder countries tend to have more bands per person. A pattern, not a cause.",
    themes: "Depression and suicide are the most common themes in every period.",
    life: "Bands that mix DSBM with another style last longer.",
    formats: "Demo tapes gave way to digital singles.",
    calendar: "Friday is release day. The winter idea does not hold up.",
  },
  insights: {
    title: "Key findings",
    items: {
      perCapita: "bands per million people in {c}: the highest among countries with at least five bands.",
      friday: "of releases with an exact date landed on a Friday. Equal days would give 14%.",
      demos: "Demos as a share of releases: before 2010, then 2020 onward.",
      life: "of hybrid bands are still going after 10 years, against {a}% of pure DSBM.",
      climate: "correlation between a country's average temperature and bands per person. A pattern between countries, not a cause.",
      peak: "bands formed in {y}, the busiest year so far.",
    },
    see: "See the chart",
  },
  records: {
    title: "Hall of records", lead: "Quick ways into the catalogue.", oldest: "Oldest bands in the data", most: "Most releases", running: "Longest-running active bands", newest: "Newest bands", years: "{n} years", releases: "{n} releases", since: "since {y}", formedIn: "formed {y}",
  },
  similar: { title: "Similar bands", lead: "Bands that share the most themes with this one.", shared: "{n} shared themes", none: "No similar bands found." },
  tl: { title: "Release timeline", lead: "Each mark is one release.", span: "Active in the data", first: "First release", last: "Latest release", perYear: "Peak year", none: "No dated releases." },
  explorer: { clear: "Clear all filters", themes: "Themes", decades: "Formed", empty: "No bands match these filters.", emptyHint: "Try removing a filter.", grid: "Grid", list: "List", shown: "showing {a} of {b}", decadeLabels: ["before 2005", "2005–09", "2010–14", "2015–19", "2020 on"], random: "Random band", activeFilters: "Active filters" },
  atlasUi: { fly: "Fly to…", regions: ["Europe", "North America", "South America", "Asia", "Oceania"], rotate: "Auto-rotate", ranking: "Top countries", selected: "Selected", pause: "Pause", play: "Rotate", open: "Open country page", clickHint: "Click a country to select it.", rank: "Rank", of: "of", hover: "Hover or tap a country" },
  country2: { rankBands: "Rank by bands", rankRate: "Rank per million", ofN: "#{r} of {n}", standsOut: "What sets it apart", standsOutLead: "Themes that are more common here than worldwide.", times: "{x}× the world average", worldAvg: "World", noStandout: "Too few bands for a reliable comparison.", map: "On the map", list: "Plain list of all bands", compare: "Bands per million vs the typical country", median: "median country" },
  band2: { share: "Share", random: "Another band", activeSpan: "years active", releases: "releases", firstRel: "first release", lastRel: "latest release", types: "Types", otherCountry: "More from {c}", filterAll: "All" },
  status: { active: "Active", "split-up": "Split up", unknown: "Unknown", "changed name": "Changed name", "on hold": "On hold", disputed: "Disputed" } as Record<string, string>,
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  method: {
    title: "Method and limits",
    items: [
      "Data: Metal Archives (band pages, discographies, release dates), Berkeley Earth (temperature), World Bank (GDP, internet use). Band images belong to the artists and are shown by link, not copied.",
      "Only bands listed on Metal Archives appear. Very short-lived or unlisted bands are missing, and older releases are less completely dated.",
      "Country results are averages. Correlation is not causation.",
      "Several tests were run; weak results are described as weak.",
      "Release dates: month known for 96% of albums, exact day for 94%. Month analysis uses complete years only.",
      "Population figures for some small countries are approximate.",
    ],
    pageTitle: "Method, sources and limits", pageLead: "How the numbers on this site were made, and how far they can be trusted.",
    sections: [
      ["Where the data comes from", "Every DSBM band listed on Metal Archives was collected: profile, genre, themes, status, discography and, for each album, its release date. Country-level temperature comes from Berkeley Earth (1991–2013 average), population, GDP and internet use from the World Bank."],
      ["What the climate comparison does and does not show", "Colder countries tend to have more DSBM bands per million people. This is a pattern between countries. It does not say that cold makes anyone write or listen to this music. Wealth, internet access and how well a scene is documented on Metal Archives all differ between countries. The link weakens when these are accounted for and is not significant among countries with ten or more bands."],
      ["Release dates and seasonality", "Exact dates exist for most albums. Only complete years are used for months. The month pattern is weak and not stable across periods, and the idea that winter is the season for releases is not supported. Friday stands out clearly, most likely because new music is released on Fridays."],
      ["Known gaps", "Metal Archives only lists what its contributors add. Very short-lived or unlisted bands are missing; 735 bands have no themes listed; two bands could not be fully collected; some small countries' population figures are approximate."],
      ["Images and rights", "Logos and photos belong to the artists and labels. They are loaded from Metal Archives by link and never copied to this site."],
    ] as [string, string][],
  },
  footer: { about: "DSBM Atlas is an independent fan project. Not affiliated with Metal Archives.", source: "Data collected from Metal Archives. See Method." },
  seo: { description: "An interactive atlas of Depressive Suicidal Black Metal: bands, countries, themes, longevity and release patterns." },
};

type Msg = typeof en;

const fa: Msg = {
  brand: "اطلس DSBM",
  nav: { growth: "رشد", places: "کشورها", climate: "اقلیم", themes: "مضامین", lifespan: "ماندگاری", formats: "فرمت‌ها", calendar: "تقویم", bands: "بندها", method: "روش" },
  hero: {
    h1: "سبک دیپرسیو سوسایدال بلک‌متال، با عدد و نقشه.",
    lead: "کامل‌ترین تصویر عمومی که از این ژانر ساخته‌ایم: همه‌ی بندهای DSBM ثبت‌شده در Metal Archives؛ از کجا آمده‌اند، درباره‌ی چه می‌خوانند، چقدر دوام می‌آورند و کی آلبوم منتشر می‌کنند.",
    stats: ["بند", "کشور", "انتشار", "تاریخ انتشار دقیق"],
    care: "این سایت موسیقی را می‌شمارد و نقشه می‌کند. اگر موضوع به زندگی شخصی شما نزدیک است، تنها نیستید: findahelpline.com خط‌های کمک رایگان محلی را فهرست می‌کند.",
  },
  growth: { title: "رشد ژانر", cap: "سال تأسیس هر بند", body: "پیش از ۲۰۰۵ این ژانر تقریباً وجود نداشت و از آن زمان حدود سه برابر شده است. پرتأسیس‌ترین سال‌ها ۲۰۲۳، ۲۰۲۴ و ۲۰۱۳ هستند. {n} بند در صفحه‌شان سال تأسیس ندارند و در این نمودار نیامده‌اند؛ سال {yr} هم هنوز تمام نشده است." },
  atlas: {
    title: "کجا زندگی می‌کند", cap: "اطلس", layers: ["تعداد بند", "به ازای هر میلیون نفر", "میانگین دما"], views: ["کره", "کاشی"],
    hint: "برای چرخاندن بکشید، برای بزرگ‌نمایی اسکرول کنید، برای صفحه‌ی هر کشور روی آن بزنید. ارتفاع، مقدار لایه را نشان می‌دهد.",
    tilesHint: "هر خانه یک کشور است و تقریباً جای واقعی‌اش روی نقشه قرار دارد؛ پس کشورهای کوچک هم مثل بزرگ‌ها دیده می‌شوند.",
    nodata: "بدون داده", unplaced: "{a} بند با خاستگاه «بین‌المللی» یا «نامشخص» ثبت شده‌اند و روی نقشه نیستند.", bands: "بند", perMillion: "به ازای هر میلیون", noBands: "بندی ثبت نشده", micro: "مکان‌های کوچک (که در طرح نقشه نیستند) با پین نشان داده شده‌اند.",
    barsTitle: "بندها به تفکیک کشور", barsBody: "در شمار خام، آمریکا و روسیه جلوتر هستند. به نسبت جمعیت تصویر عوض می‌شود و کشورهای شمال اروپا بالا می‌آیند: فنلاند و سوئد در میان کشورهای دارای دست‌کم پنج بند، بیشترین بند DSBM به ازای هر میلیون نفر را دارند.", barsToggle: ["تعداد بند", "به ازای هر میلیون نفر"],
  },
  climate: {
    title: "آیا سرما اهمیت دارد؟", cap: "میانگین دما و تعداد بند به ازای هر میلیون نفر",
    body: "در {n} کشور، جاهای سردتر به نسبت جمعیت بند DSBM بیشتری دارند. این الگو در میانگین کشورهاست و ثابت نمی‌کند سرما عامل چیزی باشد. با در نظر گرفتن ثروت و دسترسی به اینترنت این رابطه ضعیف‌تر می‌شود و در کشورهای دارای ۱۰ بند یا بیشتر معنادار نیست.",
    x: "میانگین دما (°C، ۱۹۹۱–۲۰۱۳)", y: "بند به ازای هر میلیون نفر (مقیاس لگاریتمی)", minLabel: "فقط کشورهای دارای دست‌کم {n} بند", tested: "به {k} روش مختلف آزمون شده. نقطه‌ی رنگی = تفاوت روشن با صفر.", model: "مدل", effect: "اثر به ازای ۱ درجه‌ی بیشتر",
    caution: "احتیاط: هر نقطه یک کشور کامل است. بندها و شنونده‌های منفرد اینجا اندازه‌گیری نشده‌اند.",
  },
  themes: { title: "درباره‌ی چه می‌خوانند", cap: "سهم بندهایی که هر مضمون را دارند", body: "مضمون‌ها در صفحه‌ی هر بند فهرست شده‌اند. تا چهار مورد انتخاب کنید. خط‌های عمودی بازه‌ی ۹۵٪ را نشان می‌دهند؛ دوره‌ی اول بند کمی دارد و باید با احتیاط خوانده شود.", y: "سهم بندهای دارای مضمون" },
  life: { title: "چقدر دوام می‌آورند", cap: "سهم بندهای هنوز فعال پس از ۵ و ۱۰ سال", body: "بندهای فعال «هنوز ادامه‌دار» حساب می‌شوند، نه تمام‌شده. بندهایی که DSBM را با سبک دیگری ترکیب می‌کنند بیشتر دوام می‌آورند: پس از ۱۰ سال {a}٪ در برابر {b}٪.", pure: "DSBM خالص", hybrid: "ترکیبی", y5: "پس از ۵ سال", y10: "پس از ۱۰ سال" },
  formats: { title: "از دموی کاست تا تک‌آهنگ دیجیتال", cap: "نوع انتشار در هر دوره", body: "پیش از ۲۰۱۰ بیش از نیمی از انتشارها دمو بود و امروز حدود یک‌دهم است. تک‌آهنگ از تقریباً هیچ به یک‌سوم انتشارها رسیده است. این تغییر با گذار به انتشار دیجیتال و Bandcamp همخوان است." },
  calendar: {
    title: "کی منتشر می‌کنند", body: "جمعه روز اصلی است: {f}٪ از انتشارهای دارای تاریخ دقیق، در برابر ۱۴٪ اگر همه‌ی روزها برابر بودند. این اثر برای آلبوم کامل از همه قوی‌تر است و برای دمو دیده نمی‌شود. ماه‌ها تقریباً یکنواخت‌اند و ایده‌ی «زمستان» تأیید نمی‌شود.",
    today: "چنین روزی", releasesOn: "انتشارهای {d}", none: "برای این روز چیزی ثبت نشده.", weekday: "انتشار به تفکیک روز هفته", month: "انتشار به تفکیک ماه (سال‌های کامل)",
  },
  bands: { title: "گشت‌وگذار در بندها", search: "نام یا مضمون", allCountries: "همه‌ی کشورها", allStatuses: "همه‌ی وضعیت‌ها", pure: "فقط DSBM خالص", sortName: "ترتیب: نام", sortNew: "ترتیب: جدیدترین", sortRel: "ترتیب: بیشترین انتشار", more: "نمایش بیشتر", count: "{n} بند", formed: "تأسیس", releases: "انتشار", ma: "در Metal Archives", loading: "در حال بارگذاری بندها…" },
  country: { close: "بستن", back: "همه‌ی کشورها", kp: ["بند", "به ازای هر میلیون نفر", "جمعیت (میلیون)", "میانگین دما", "تولید ناخالص سرانه", "کاربران اینترنت"], active: "هنوز فعال", pure: "DSBM خالص", mid: "میانه‌ی سال تأسیس", formed: "سال تأسیس", status: "وضعیت", themes: "پرتکرارترین مضامین", genres: "ژانرها", top: "بندهای دارای بیشترین انتشار", browse: "دیدن همه‌ی {n} بند", note: "دما میانگین ۱۹۹۱–۲۰۱۳ است (Berkeley Earth)؛ GDP و اینترنت آخرین مقدار بانک جهانی. نمونه‌ی کوچک: کشورهای دارای بند کم را با احتیاط بخوانید.", noTemp: "برای این مکان داده‌ی دما یا جمعیت نداریم.", all: "همه‌ی بندها" },
  band: { country: "کشور", formed: "تأسیس", status: "وضعیت", label: "لیبل", genres: "ژانرها", themes: "مضامین", location: "محل", activeYears: "سال‌های فعالیت", discography: "دیسکوگرافی", noReleases: "انتشاری ثبت نشده.", ma: "صفحه‌ی بند در Metal Archives", logoAlt: "لوگوی {n}", releasesTotal: "{n} انتشار" },
  ui: { skip: "رفتن به محتوا", search: "جست‌وجو", searchPlaceholder: "جست‌وجوی بند، کشور یا مضمون…", searchHint: "↑ ↓ حرکت · Enter باز کردن · Esc بستن", noResults: "چیزی پیدا نشد برای", bandsGroup: "بندها", countriesGroup: "کشورها", sectionsGroup: "رفتن به", actions: "کارها", random: "غافلگیرم کن", randomBand: "باز کردن یک بند تصادفی", menu: "منو", close: "بستن", theme: "تغییر تیره / روشن", language: "تغییر زبان", copy: "کپی لینک", copied: "لینک کپی شد", top: "بالای صفحه", openPage: "باز کردن صفحه", progress: "پیشرفت مطالعه", typeToSearch: "نام یک بند، کشور یا مضمون را بنویسید" },
  hero2: { cta1: "گشت در کره‌ی زمین", cta2: "غافلگیرم کن", eyebrow: "Metal Archives" },
  take: {
    growth: "این ژانر از ۲۰۰۵ تا امروز حدود سه برابر شده است.",
    places: "صحنه‌های بزرگ در آمریکا و روسیه؛ پرتراکم‌ترین به نسبت جمعیت در شمال اروپا.",
    climate: "کشورهای سردتر به نسبت جمعیت بند بیشتری دارند. یک الگو است، نه یک علت.",
    themes: "افسردگی و خودکشی در همه‌ی دوره‌ها پرتکرارترین مضمون‌ها هستند.",
    life: "بندهایی که DSBM را با سبک دیگری ترکیب می‌کنند بیشتر دوام می‌آورند.",
    formats: "دموی کاست جایش را به تک‌آهنگ دیجیتال داد.",
    calendar: "جمعه روز انتشار است. ایده‌ی «زمستان» تأیید نمی‌شود.",
  },
  insights: {
    title: "یافته‌های کلیدی",
    items: {
      perCapita: "بند به ازای هر میلیون نفر در {c}: بیشترین در میان کشورهای دارای دست‌کم پنج بند.",
      friday: "از انتشارهای دارای تاریخ دقیق در جمعه بوده‌اند. اگر همه‌ی روزها برابر بودند ۱۴٪ می‌شد.",
      demos: "سهم دمو از انتشارها: پیش از ۲۰۱۰ و از ۲۰۲۰ به بعد.",
      life: "از بندهای ترکیبی پس از ۱۰ سال هنوز فعال‌اند، در برابر {a}٪ برای DSBM خالص.",
      climate: "همبستگی میانگین دمای کشور و تعداد بند به ازای جمعیت. الگویی بین کشورهاست، نه یک علت.",
      peak: "بند در {y} تأسیس شد؛ پرتأسیس‌ترین سال تا امروز.",
    },
    see: "دیدن نمودار",
  },
  records: {
    title: "رکوردها", lead: "چند راه سریع برای ورود به فهرست.", oldest: "قدیمی‌ترین بندهای داده‌ها", most: "بیشترین انتشار", running: "قدیمی‌ترین بندهای هنوز فعال", newest: "تازه‌ترین بندها", years: "{n} سال", releases: "{n} انتشار", since: "از {y}", formedIn: "تأسیس {y}",
  },
  similar: { title: "بندهای مشابه", lead: "بندهایی که بیشترین مضمون مشترک را با این بند دارند.", shared: "{n} مضمون مشترک", none: "بند مشابهی پیدا نشد." },
  tl: { title: "خط زمانی انتشارها", lead: "هر نشان یک انتشار است.", span: "فعالیت در داده‌ها", first: "نخستین انتشار", last: "آخرین انتشار", perYear: "پرانتشارترین سال", none: "انتشار تاریخ‌دار نیست." },
  explorer: { clear: "پاک کردن همه‌ی فیلترها", themes: "مضمون‌ها", decades: "سال تأسیس", empty: "بندی با این فیلترها پیدا نشد.", emptyHint: "یکی از فیلترها را بردارید.", grid: "کارتی", list: "فهرستی", shown: "نمایش {a} از {b}", decadeLabels: ["پیش از ۲۰۰۵", "۲۰۰۵–۰۹", "۲۰۱۰–۱۴", "۲۰۱۵–۱۹", "۲۰۲۰ به بعد"], random: "بند تصادفی", activeFilters: "فیلترهای فعال" },
  atlasUi: { fly: "برو به…", regions: ["اروپا", "آمریکای شمالی", "آمریکای جنوبی", "آسیا", "اقیانوسیه"], rotate: "چرخش خودکار", ranking: "کشورهای برتر", selected: "انتخاب‌شده", pause: "توقف", play: "چرخش", open: "باز کردن صفحه‌ی کشور", clickHint: "برای انتخاب روی یک کشور بزنید.", rank: "رتبه", of: "از", hover: "روی یک کشور بروید یا بزنید" },
  country2: { rankBands: "رتبه بر اساس تعداد بند", rankRate: "رتبه به ازای هر میلیون", ofN: "{r} از {n}", standsOut: "چه چیزی متمایزش می‌کند", standsOutLead: "مضمون‌هایی که اینجا بیشتر از میانگین جهان‌اند.", times: "{x} برابر میانگین جهان", worldAvg: "جهان", noStandout: "بند کافی برای مقایسه‌ی قابل اعتماد نیست.", map: "روی نقشه", list: "فهرست ساده‌ی همه‌ی بندها", compare: "بند به ازای هر میلیون در برابر کشور معمولی", median: "کشور میانه" },
  band2: { share: "اشتراک", random: "بند دیگر", activeSpan: "سال فعالیت", releases: "انتشار", firstRel: "نخستین انتشار", lastRel: "آخرین انتشار", types: "نوع‌ها", otherCountry: "بیشتر از {c}", filterAll: "همه" },
  status: { active: "فعال", "split-up": "منحل", unknown: "نامشخص", "changed name": "تغییر نام", "on hold": "متوقف", disputed: "مورد اختلاف" },
  months: ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"],
  days: ["دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه", "یکشنبه"],
  method: {
    title: "روش و محدودیت‌ها",
    items: [
      "داده‌ها: Metal Archives (صفحه‌ی بندها، دیسکوگرافی، تاریخ انتشار)، Berkeley Earth (دما)، بانک جهانی (GDP و اینترنت). تصویرها متعلق به هنرمندان‌اند و با لینک نمایش داده می‌شوند، نه کپی.",
      "فقط بندهای ثبت‌شده در Metal Archives دیده می‌شوند. بندهای بسیار کوتاه‌عمر یا ثبت‌نشده غایب‌اند و تاریخ انتشارهای قدیمی‌تر کمتر کامل است.",
      "نتایج کشوری میانگین هستند. همبستگی به معنای علّیت نیست.",
      "چند آزمون انجام شده و نتیجه‌های ضعیف، ضعیف توصیف شده‌اند.",
      "تاریخ انتشار: ماه برای ۹۶٪ آلبوم‌ها و روز دقیق برای ۹۴٪ معلوم است. تحلیل ماه فقط روی سال‌های کامل است.",
      "جمعیت برخی کشورهای کوچک تقریبی است.",
    ],
    pageTitle: "روش، منابع و محدودیت‌ها", pageLead: "اعداد این سایت چطور ساخته شده‌اند و تا چه اندازه می‌شود به آن‌ها اعتماد کرد.",
    sections: [
      ["داده‌ها از کجا می‌آیند", "همه‌ی بندهای DSBM ثبت‌شده در Metal Archives جمع‌آوری شدند: پروفایل، ژانر، مضمون‌ها، وضعیت، دیسکوگرافی و برای هر آلبوم تاریخ انتشار. دمای کشورها از Berkeley Earth (میانگین ۱۹۹۱–۲۰۱۳) و جمعیت، GDP و اینترنت از بانک جهانی است."],
      ["مقایسه‌ی اقلیمی چه چیزی را نشان می‌دهد و چه چیزی را نه", "کشورهای سردتر به نسبت هر میلیون نفر بند DSBM بیشتری دارند. این الگویی بین کشورهاست و نمی‌گوید سرما کسی را به نوشتن یا شنیدن این موسیقی وامی‌دارد. ثروت، دسترسی به اینترنت و میزان مستندسازی صحنه در Metal Archives بین کشورها فرق می‌کند. با در نظر گرفتن این عوامل رابطه ضعیف‌تر می‌شود و در کشورهای دارای ده بند یا بیشتر معنادار نیست."],
      ["تاریخ انتشار و فصل", "برای بیشتر آلبوم‌ها تاریخ دقیق داریم. برای ماه فقط سال‌های کامل استفاده شده است. الگوی ماه ضعیف است و بین دوره‌ها پایدار نیست و ایده‌ی «زمستان فصل انتشار است» تأیید نمی‌شود. جمعه به‌روشنی بیرون می‌زند، احتمالاً چون موسیقی تازه جمعه‌ها منتشر می‌شود."],
      ["خلأهای شناخته‌شده", "Metal Archives فقط چیزی را فهرست می‌کند که مشارکت‌کنندگانش اضافه کرده‌اند. بندهای بسیار کوتاه‌عمر یا ثبت‌نشده غایب‌اند؛ ۷۳۵ بند مضمونی ثبت نکرده‌اند؛ دو بند کامل جمع‌آوری نشدند؛ جمعیت برخی کشورهای کوچک تقریبی است."],
      ["تصویرها و حقوق", "لوگوها و عکس‌ها متعلق به هنرمندان و لیبل‌هاست. از Metal Archives با لینک بارگذاری می‌شوند و هرگز روی این سایت کپی نمی‌شوند."],
    ],
  },
  footer: { about: "اطلس DSBM یک پروژه‌ی مستقل از طرفداران است و وابسته به Metal Archives نیست.", source: "داده‌ها از Metal Archives جمع‌آوری شده‌اند. بخش روش را ببینید." },
  seo: { description: "اطلسی تعاملی از دیپرسیو سوسایدال بلک‌متال: بندها، کشورها، مضامین، ماندگاری و الگوی انتشار." },
};

export const messages: Record<Locale, Msg> = { en, fa };
export type Messages = Msg;
export const getMessages = (l: Locale): Msg => messages[l];

export const THEME_FA: Record<string, string> = {
  Suicide: "خودکشی", Depression: "افسردگی", Despair: "ناامیدی", Sadness: "اندوه", Loneliness: "تنهایی", Misanthropy: "انسان‌گریزی", Nature: "طبیعت",
  Nihilism: "نیست‌انگاری", "Self-harm": "آسیب به خود", Isolation: "انزوا", "Mental illness": "بیماری روانی", Death: "مرگ", Pain: "درد", Hatred: "نفرت",
  Winter: "زمستان", Sorrow: "غم", Grief: "سوگ", Melancholy: "مالیخولیا", Anger: "خشم", Fear: "ترس", Emptiness: "پوچی", Darkness: "تاریکی", Decay: "فروپاشی",
  Alcoholism: "الکلیسم", Addiction: "اعتیاد", Anxiety: "اضطراب", Suffering: "رنج", Loss: "فقدان", Love: "عشق", Hate: "نفرت", Life: "زندگی",
  Misery: "بدبختی", Longing: "دلتنگی", Nostalgia: "نوستالژی", Dread: "وحشت", Extinction: "انقراض", Horror: "وحشت", Philosophy: "فلسفه", Mythology: "اسطوره", Witchery: "جادوگری",
};
export const themeName = (l: Locale, t: string) => {
  const k = t.charAt(0).toUpperCase() + t.slice(1);
  return l === "fa" ? THEME_FA[k] ?? k : k;
};
export const countryName = (l: Locale, c: { name: string; fa: string }) => (l === "fa" ? c.fa : c.name);
