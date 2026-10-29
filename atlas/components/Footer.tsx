import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

const T = {
  en: { explore: "Explore", more: "Good to know", help: "Free, confidential helplines in many countries: findahelpline.com", img: "Band images are hotlinked from Metal Archives and belong to their owners.", top: "Back to top" },
  fa: { explore: "گشت‌وگذار", more: "خوب است بدانید", help: "خط‌های کمک رایگان در کشورهای مختلف: findahelpline.com", img: "تصویر بندها از Metal Archives نمایش داده می‌شود و متعلق به صاحبانشان است.", top: "بازگشت به بالا" },
};

export default function Footer({ locale }: { locale: Locale }) {
  const m = getMessages(locale), t = T[locale];
  return (
    <footer id="method-short">
      <div>
        <h3>{m.method.title}</h3>
        <ul>{m.method.items.slice(0, 4).map((x) => <li key={x}>{x}</li>)}</ul>
        <p><Link href={`/${locale}/method/`}>{m.nav.method} <span className="arrow">→</span></Link></p>
      </div>
      <div>
        <h3>{t.explore}</h3>
        <ul>
          {(["places", "climate", "themes", "calendar", "bands"] as const).map((id) => <li key={id}><Link href={`/${locale}/#${id}`}>{m.nav[id]}</Link></li>)}
        </ul>
      </div>
      <div>
        <h3>{t.more}</h3>
        <ul><li>{t.img}</li><li>{t.help}</li></ul>
      </div>
      <div className="fine"><span>{m.footer.about}</span><a href="#main">↑ {t.top}</a></div>
    </footer>
  );
}
