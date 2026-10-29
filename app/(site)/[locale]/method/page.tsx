import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).method.pageTitle } : {};
}

export default async function Method({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale).method;
  return (
    <main id="main" className="prose">
      <div className="pagehead"><h1 style={{ fontSize: "clamp(38px,6vw,64px)" }}>{m.pageTitle}</h1><p className="meta">{m.pageLead}</p></div>
      {m.sections.map(([h, p]) => <div key={h}><h3>{h}</h3><p>{p}</p></div>)}
    </main>
  );
}
