import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WeBuild — AI Website & Store Generator",
    template: "%s | WeBuild",
  },
  description:
    "Describe any business and instantly generate a beautiful, editable, high-converting website or online store. 2,001 templates, 22 section types, visual editor, AI generation, e-commerce built in. Export clean code.",
  keywords: [
    "AI website builder", "website generator", "store builder", "e-commerce",
    "no-code", "AI design", "landing page builder", "Next.js", "React",
  ],
  authors: [{ name: "WeBuild Studio" }],
  creator: "WeBuild Studio",
  metadataBase: new URL("https://webuild-studio.netlify.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://webuild-studio.netlify.app",
    siteName: "WeBuild Studio",
    title: "WeBuild — AI Website & Store Generator",
    description:
      "Prompt to website in seconds. 2,001 templates, visual editor, e-commerce, AI generation. Export clean React or HTML.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeBuild — AI Website & Store Generator",
    description:
      "Prompt to website in seconds. 2,001 templates, visual editor, e-commerce, AI generation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
