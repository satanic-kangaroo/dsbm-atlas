"use client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { SlimBand } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

/** Opens a random band page. Uses the slim band list (already cached by the browser after the first fetch). */
export default function RandomBand({ locale, label, icon, className = "btn" }: { locale: Locale; label: string; icon?: ReactNode; className?: string }) {
  const router = useRouter();
  const go = async () => {
    try {
      const d: SlimBand[] = await (await fetch("/data/bands.json")).json();
      router.push(`/${locale}/band/${d[Math.floor(Math.random() * d.length)].id}/`);
    } catch { /* offline: stay on the page */ }
  };
  return <button className={className} onClick={go}>{icon}{label}</button>;
}
