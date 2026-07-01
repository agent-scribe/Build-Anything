import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/"] },
    ],
    sitemap: "https://webuild-studio.netlify.app/sitemap.xml",
  };
}
