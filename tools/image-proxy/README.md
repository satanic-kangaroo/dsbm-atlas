# Image proxy (Cloudflare Worker)

For visitors whose network cannot reach metal-archives.com. Logos are fetched through the Worker and never stored by it.

1. Cloudflare dashboard → Workers & Pages → Create → Worker → paste `worker.js` → Deploy.
2. Edit `ALLOWED_SITES` to your real domain(s).
3. Strongly recommended: add a custom domain to the Worker (e.g. `img.yourdomain.com`). The default `*.workers.dev` address is itself blocked in some networks.
4. In Vercel → Settings → Environment Variables add `NEXT_PUBLIC_IMG_PROXY=https://img.yourdomain.com` and redeploy.

Notes
- Metal Archives may refuse requests that come from Cloudflare's IP ranges (HTTP 403). If so, logos fall back to the initial-letter tile; nothing breaks.
- Risk: serving their images through your own server is a stronger use than hotlinking. Check Metal Archives' terms.
- Free plan allows 100,000 Worker requests per day.
