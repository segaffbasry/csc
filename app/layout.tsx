import type { Metadata, Viewport } from "next";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";
import "../styles/chrome.css";
import "../styles/home.css";

// The live homepage's own subject. Private demo: never indexed, never followed.
export const metadata: Metadata = {
  title: "CSC Screeding | Programme Certainty for South East Construction",
  description: "Professional flowing screed services with Maverick technology for commercial and residential projects across the South-East.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#0c0b24" };

/* Runs before first paint. Unless reduced motion is requested it adds `js` (so reveal targets can start hidden
   without a flash) and `is-loading` for the preloader, which plays on every load. Without JavaScript nothing is
   hidden and the preloader never shows (see the <noscript> style too). */
const boot = "(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='done';return}d.classList.add('js','is-loading')})()";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
        <link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/media/pour-poster.jpg" as="image" />
        <noscript><style>{".preloader{display:none!important}"}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
