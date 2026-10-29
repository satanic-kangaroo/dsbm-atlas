"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { other, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { IconClose, IconMark, IconMenu, IconMoon, IconSearch, IconSun } from "./Icons";
import CommandPalette, { type CountryOpt } from "./CommandPalette";

const IDS = ["growth", "places", "climate", "themes", "lifespan", "formats", "calendar", "bands", "method"] as const;

export default function Header({ locale, countries }: { locale: Locale; countries: CountryOpt[] }) {
  const m = getMessages(locale);
  const path = usePathname() || `/${locale}/`;
  const switched = path.replace(/^\/(en|fa)(?=\/|$)/, `/${other(locale)}`);
  const home = /^\/(en|fa)\/?$/.test(path);
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false), [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const [method, setMethod] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setDark(cur === "dark"); setMethod(/\/method\/?$/.test(path));
  }, [path]);

  // scroll progress + scrollspy (home page only)
  useEffect(() => {
    const bar = document.getElementById("progress-bar");
    const onScroll = () => {
      const h = document.documentElement; const max = h.scrollHeight - h.clientHeight;
      bar?.style.setProperty("--p", String(max > 0 ? Math.min(1, h.scrollTop / max) : 0));
    };
    onScroll(); addEventListener("scroll", onScroll, { passive: true });
    let io: IntersectionObserver | null = null;
    if (home) {
      io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setActive(e.target.id); }, { rootMargin: "-35% 0px -60% 0px" });
      IDS.forEach((id) => { const el = document.getElementById(id); if (el) io!.observe(el); });
    } else setActive("");
    return () => { removeEventListener("scroll", onScroll); io?.disconnect(); };
  }, [home, path]);

  // global shortcuts
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null; const typing = !!t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); setOpen(true); }
    };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);
  useEffect(() => { setMenu(false); }, [path]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    root.dataset.theme = next; setDark(next === "dark");
    try { localStorage.setItem("dsbm-theme", next); } catch {}
  };
  const href = (id: string) => (id === "method" ? `/${locale}/method/` : `/${locale}/#${id}`);
  const isCur = (id: string) => (id === "method" ? method : home && active === id);
  const nav = IDS.map((id) => <Link key={id} href={href(id)} aria-current={isCur(id) ? "true" : undefined}>{m.nav[id]}</Link>);

  return (
    <>
      <div className="progress" aria-hidden="true"><i id="progress-bar" /></div>
      <a className="skip" href="#main">{m.ui.skip}</a>
      <header className="top">
        <Link className="brand" href={`/${locale}/`}><IconMark />{m.brand}</Link>
        <nav className="links" aria-label="Sections">{nav}</nav>
        <div className="tools">
          <button className="btn searchbtn" onClick={() => setOpen(true)} aria-label={m.ui.search}>
            <span className="l"><IconSearch /><span className="t">{m.ui.search}</span></span><kbd>Ctrl K</kbd>
          </button>
          <a className="btn" href={switched} hrefLang={other(locale)} lang={other(locale)} aria-label={m.ui.language} onClick={() => { try { localStorage.setItem("dsbm-lang", other(locale)); } catch {} }}>{locale === "fa" ? "EN" : "فارسی"}</a>
          <button className="btn icon" onClick={toggleTheme} aria-label={m.ui.theme}>{dark ? <IconSun /> : <IconMoon />}</button>
          <button className="btn icon menubtn" onClick={() => setMenu(true)} aria-label={m.ui.menu} aria-expanded={menu}><IconMenu /></button>
        </div>
      </header>
      {menu ? (
        <div className="drawer" onClick={() => setMenu(false)}>
          <nav aria-label="Menu" onClick={(e) => e.stopPropagation()}>
            <div className="top"><b>{m.brand}</b><button className="btn icon" onClick={() => setMenu(false)} aria-label={m.ui.close}><IconClose /></button></div>
            {nav}
          </nav>
        </div>
      ) : null}
      {open ? <CommandPalette locale={locale} countries={countries} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
