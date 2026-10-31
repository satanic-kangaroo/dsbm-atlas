// Cloudflare Worker: pass-through image proxy for band logos/photos.
// - Only https://www.metal-archives.com/images/... is allowed (no open proxy).
// - Only requests from your own site (Origin/Referer allow-list) are served.
// - Nothing is stored on Cloudflare: edge cache is off. The visitor's browser may keep a private copy.
// Deploy: see README.md in this folder. Usage: https://img.example.com/?u=/images/3/5/4/0/3540481397_logo.png?0210
const ALLOWED_SITES = ["dsbm-atlas.vercel.app", "localhost"]; // add your own domain(s)
const UPSTREAM = "https://www.metal-archives.com";

export default {
  async fetch(request) {
    if (request.method !== "GET") return new Response("method not allowed", { status: 405 });
    const ref = request.headers.get("Referer") || request.headers.get("Origin") || "";
    let host = "";
    try { host = new URL(ref).hostname; } catch {}
    if (ref && !ALLOWED_SITES.some((s) => host === s || host.endsWith("." + s))) return new Response("forbidden", { status: 403 });

    const u = new URL(request.url).searchParams.get("u") || "";
    if (!/^\/images\/[\w\/.\-]+(\?\d*)?$/.test(u)) return new Response("bad path", { status: 400 });

    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
    try {
      const r = await fetch(UPSTREAM + u, {
        signal: ctl.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; DSBM-Atlas-image-proxy)", "Accept": "image/*", "Referer": UPSTREAM + "/" },
        cf: { cacheTtl: 0, cacheEverything: false },
      });
      const type = r.headers.get("Content-Type") || "";
      if (!r.ok || !type.startsWith("image/")) return new Response("upstream " + r.status, { status: 502 });
      return new Response(r.body, { status: 200, headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=86400",   // browser only; not shared caches
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": "*",
      } });
    } catch { return new Response("timeout", { status: 504 }); } finally { clearTimeout(t); }
  },
};
