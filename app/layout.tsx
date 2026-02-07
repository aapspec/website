import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/shared/Navbar";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { Footer } from "@/components/landing/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://www.aap-protocol.org"),
    title: {
        default: "AAP - Agent Authorization Profile | OAuth 2.0 for AI Agents",
        template: "%s | AAP Protocol",
    },
    description:
        "Authorization profile for autonomous AI agents. Extends OAuth 2.0 with structured claims for identity, capabilities, delegation, and human oversight.",
    keywords: [
        "OAuth 2.0",
        "JWT",
        "AI agents",
        "authorization",
        "AAP",
        "agent identity",
        "capability-based auth",
        "token exchange",
        "RFC 8693",
    ],
    authors: [{ name: "AAP Working Group" }],
    alternates: {
        canonical: "https://www.aap-protocol.org",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://www.aap-protocol.org",
        title: "Agent Authorization Profile (AAP)",
        description: "OAuth 2.0 for autonomous AI agents",
    },
    twitter: {
        card: "summary_large_image",
        title: "Agent Authorization Profile (AAP)",
        description: "OAuth 2.0 for autonomous AI agents",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "WebSite",
                                    name: "Agent Authorization Profile (AAP)",
                                    url: "https://www.aap-protocol.org",
                                    description:
                                        "Authorization profile for autonomous AI agents. Extends OAuth 2.0 with structured claims for identity, capabilities, delegation, and human oversight.",
                                },
                                {
                                    "@type": "Organization",
                                    name: "AAP Working Group",
                                    url: "https://www.aap-protocol.org",
                                    sameAs: ["https://github.com/aapspec"],
                                },
                            ],
                        }),
                    }}
                />
                <ThemeProvider>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <ScrollProgress />
                        <main className="grow pt-16">{children}</main>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
