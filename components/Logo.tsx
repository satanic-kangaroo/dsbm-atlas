"use client";
import { useState } from "react";

/** Band logo/photo, hotlinked from Metal Archives (never copied). Falls back to the band's initial if it fails to load. */
export default function Logo({ src, name, className = "art" }: { src: string | null; name: string; className?: string }) {
  const [bad, setBad] = useState(false);
  const initial = (name.replace(/^[^A-Za-z0-9؀-ۿ]+/, "").charAt(0) || "·").toUpperCase();
  return (
    <div className={className}>
      <span className="mono-initial" aria-hidden="true">{initial}</span>
      {src && !bad ? <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBad(true)} /> : null}
    </div>
  );
}
