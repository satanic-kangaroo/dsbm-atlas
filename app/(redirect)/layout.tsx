import type { ReactNode } from "react";
export default function RedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><meta httpEquiv="refresh" content="0; url=/en/" /></head>
      <body>{children}</body>
    </html>
  );
}
