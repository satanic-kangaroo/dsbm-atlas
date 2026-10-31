import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { methodDoc, type Block } from "@/lib/method";

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: methodDoc(locale).title } : {};
}

const FA = "۰۱۲۳۴۵۶۷۸۹";
/** Persian digits for ordinary text; `code`, file names (word_with_underscore, x.py) and ids stay as written. */
function fa(s: string, on: boolean) {
  if (!on) return s;
  return s.replace(/`[^`]*`|[A-Za-z_][\w.\-]*|\d+(?:[.,]\d+)*/g, (m) => {
    if (/^[A-Za-z_`]/.test(m)) return m;
    return m.replace(/\d/g, (d) => FA[+d]).replace(/\./g, "٫").replace(/,/g, "٬");
  });
}
function Txt({ s, f }: { s: string; f: boolean }) {
  const t = fa(s, f);
  const parts = t.split(/(`[^`]*`)/g);
  return <>{parts.map((p, i) => (p.startsWith("`") ? <code key={i}>{p.slice(1, -1)}</code> : <span key={i}>{p}</span>))}</>;
}

function Blk({ b, f }: { b: Block; f: boolean }) {
  switch (b.t) {
    case "p": return <p><Txt s={b.x} f={f} /></p>;
    case "h": return <h3 className="m-sub">{b.x}</h3>;
    case "note": return <p className="notice"><Txt s={b.x} f={f} /></p>;
    case "ul": return <ul>{b.x.map((x, i) => <li key={i}><Txt s={x} f={f} /></li>)}</ul>;
    case "ol": return <ol>{b.x.map((x, i) => <li key={i}><Txt s={x} f={f} /></li>)}</ol>;
    case "code": return <pre className="m-code" dir="ltr"><code>{b.x}</code></pre>;
    case "table": return (
      <div className="m-tablewrap">
        <table className="m-table">
          <thead><tr>{b.head.map((h, i) => <th key={i}><Txt s={h} f={f} /></th>)}</tr></thead>
          <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Txt s={c} f={f} /></td>)}</tr>)}</tbody>
        </table>
        {b.cap && <p className="meta m-cap"><Txt s={b.cap} f={f} /></p>}
      </div>
    );
  }
}

export default async function Method({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale, f = l === "fa", d = methodDoc(l);
  const msgs = getMessages(l);
  void msgs;
  return (
    <main id="main" className="method">
      <div className="pagehead"><h1>{d.title}</h1><p className="meta">{d.lead}</p></div>
      <div className="m-grid">
        <nav className="m-toc" aria-label={d.tocTitle}>
          <b>{d.tocTitle}</b>
          <ol>{d.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title.replace(/^[\d۰-۹]+\.\s*/, "")}</a></li>)}</ol>
        </nav>
        <div className="m-body prose">
          <section className="m-tldr"><h2>{d.tldrTitle}</h2><ul>{d.tldr.map((x, i) => <li key={i}><Txt s={x} f={f} /></li>)}</ul></section>
          <section className="m-dl">
            <h2>{d.dl.title}</h2>
            <p><Txt s={d.dl.body} f={f} /></p>
            <ul>{d.dl.contains.map((x, i) => <li key={i}><Txt s={x} f={f} /></li>)}</ul>
            <p className="meta"><Txt s={d.dl.excluded} f={f} /></p>
            <a className="btn m-btn" href={d.dl.file} download>{d.dl.button} · {d.dl.size}</a>
          </section>
          {d.sections.map((s) => (
            <section key={s.id} id={s.id} className="m-sec">
              <h2>{fa(s.title, f)}</h2>
              {s.lead && <p className="m-leadp"><Txt s={s.lead} f={f} /></p>}
              {s.blocks.map((b, i) => <Blk key={i} b={b} f={f} />)}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
