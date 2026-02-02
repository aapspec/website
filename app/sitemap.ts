import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.aap-protocol.org";

    // Lista de todas las rutas públicas
    const routes = [
        "",
        "/getting-started",
        "/specification",
        "/docs",
        "/faq",
        "/schemas",
        "/test-vectors",
        "/token-generator",
        "/reference-impl",
        "/deployment",
        "/migration",
        "/threat-model",
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
    }));
}
