"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fill, nf, year as yf } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import type { Atlas } from "@/lib/types";

export default function OnThisDay({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const [cal, setCal] = useState<Atlas["calendar"] | null>(null);
  const [md, setMd] = useState<[number, number]>([10, 27]);
  useEffect(() => {
    const d = new Date(); setMd([d.getMonth() + 1, d.getDate()]);
    fetch("/data/calendar.json").then((r) => r.json()).then(setCal).catch(() => setCal([]));
  }, []);
  const list = useMemo(() => (cal ?? []).filter((r) => r[0] === md[0] && r[1] === md[1]).sort((a, b) => b[2] - a[2]), [cal, md]);
  return (
    <div className="chart">
      <div className="eyebrow">{m.calendar.today}</div>
      <div className="filters" style={{ marginBlock: 10 }}>
        <select aria-label="month" value={md[0]} onChange={(e) => setMd([+e.target.value, md[1]])}>{m.months.map((x, i) => <option key={i} value={i + 1}>{x}</option>)}</select>
        <select aria-label="day" value={md[1]} onChange={(e) => setMd([md[0], +e.target.value])}>{Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{nf(locale, i + 1)}</option>)}</select>
      </div>
      <div className="cap" aria-live="polite">{fill(m.calendar.releasesOn, { d: `${m.months[md[0] - 1]} ${nf(locale, md[1])}` })} · {nf(locale, list.length)}</div>
      {list.length ? list.slice(0, 8).map((r) => (
        <div className="rel" key={`${r[5]}-${r[3]}-${r[2]}`}>
          <b>{yf(locale, r[2])}</b>
          <div><Link href={`/${locale}/band/${r[5]}/`}>{r[3]}</Link><small>{`${r[4] ?? ""} · ${r[6]}`}</small></div>
          <span />
        </div>
      )) : <p className="meta">{cal ? m.calendar.none : "…"}</p>}
    </div>
  );
}
