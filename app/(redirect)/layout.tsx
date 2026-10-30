import type { ReactNode } from "react";
import { Analytics } from '@vercel/analytics/next';
export default function RedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><meta httpEquiv="refresh" content="0; url=/en/" /></head>
      <body>
        {children}
        <Analytics /> 
      </body>
    </html>
  );
  
}
