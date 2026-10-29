/** Static export: the whole site is plain files in ./out (host anywhere: Cloudflare Pages, GitHub Pages, Netlify). */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};
export default nextConfig;
