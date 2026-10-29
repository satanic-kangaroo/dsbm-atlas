"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { IconDice, IconShare } from "./Icons";
import RandomBand from "./RandomBand";

/** Copy-link (or native share sheet on phones) + random band. */
export default function ShareButtons({ locale, title }: { locale: Locale; title: string }) {
  const m = getMessages(locale);
  const [done, setDone] = useState(false);
  const share = async () => {
    const url = location.href.split("#")[0];
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 1800);
    } catch { /* cancelled */ }
  };
  return (
    <>
      <button className="btn" onClick={share}><IconShare />{m.band2.share}</button>
      <RandomBand locale={locale} label={m.band2.random} icon={<IconDice />} />
      {done ? <div className="toast" role="status">{m.ui.copied}</div> : null}
    </>
  );
}
