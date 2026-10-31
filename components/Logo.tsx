"use client";
import { useState } from "react";

/** Band logo/photo, hotlinked from Metal Archives (never copied). Falls back to the band's initial if it fails to load. */
const PROXY = (process.env.NEXT_PUBLIC_IMG_PROXY || "").replace(/\/$/, "");
/** With a proxy configured, https://www.metal-archives.com/images/… is requested as <proxy>/?u=/images/… */
const viaProxy = (src: string) => (PROXY && src.startsWith("https://www.metal-archives.com/images/") ? `${PROXY}/?u=${encodeURIComponent(src.slice("https://www.metal-archives.com".length))}` : src);

export default function Logo({ src, name, className = "art" }: { src: string | null; name: string; className?: string }) {
  const [bad, setBad] = useState(false);
  const initial = (name.replace(/^[^A-Za-z0-9؀-ۿ]+/, "").charAt(0) || "·").toUpperCase();
  return (
    <div className={className}>
      <span className="mono-initial" aria-hidden="true">{initial}</span>
      {src && !bad ? <img src={viaProxy(src)} alt="" loading="lazy" referrerPolicy={PROXY ? "origin" : "no-referrer"} onError={() => setBad(true)} /> : null}
    </div>
  );
}
