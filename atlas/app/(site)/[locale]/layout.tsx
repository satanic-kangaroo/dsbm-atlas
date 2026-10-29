import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Instrument_Serif, IBM_Plex_Sans, IBM_Plex_Mono, Vazirmatn } from "next/font/google";
import "@/styles/globals.css";
import { dirOf, isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { atlas } from "@/lib/data";
import { countryNames } from "@/lib/names";
import { countrySlug } from "@/lib/slug";

const display = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = IBM_Plex_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono", display: "swap" });
const fa = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-fa", display: "swap" });

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return {
    icons: { icon: "/favicon.svg" }, title: { default: m.brand, template: `%s · ${m.brand}` }, description: m.seo.description,
    alternates: { languages: { en: "/en/", fa: "/fa/" } }, openGraph: { title: m.brand, description: m.seo.description, locale: locale === "fa" ? "fa_IR" : "en_US", type: "website" },
  };
}

// Applies the saved theme before first paint (no flash). Language is part of the URL, so only the theme is stored.
const themeInit = `try{var t=localStorage.getItem('dsbm-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const names = countryNames(locale);
  const opts = atlas.countries.map((c) => ({ name: c.name, label: names[c.name] ?? c.name, slug: countrySlug(c.name), n: c.n }));
  return (
    <html lang={locale} dir={dirOf(locale)} className={`${display.variable} ${body.variable} ${mono.variable} ${fa.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body>
        <Header locale={locale} countries={opts} />
        <div className="wrap">
          {children}
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
