import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WeBuild — AI website & store generator",
    template: "%s | WeBuild",
  },
  description:
    "Describe a business and generate a beautiful, editable, high-converting site. Customize visually and export clean code.",
  metadataBase: new URL("https://webuild-studio.netlify.app"),
  openGraph: {
    title: "WeBuild — AI website & store generator",
    description: "Prompt → Generate → Customize → Export. Build stores and landing pages with AI.",
    type: "website",
    siteName: "WeBuild",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeBuild — AI website & store generator",
    description: "Prompt → Generate → Customize → Export. Build stores and landing pages with AI.",
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
