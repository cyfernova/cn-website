import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://cyfernova.vercel.app";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/_next/", "/static/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
