import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    title: "AAP - Agent Authorization Profile | OAuth 2.0 for AI Agents",
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
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "AAP Protocol",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Agent Authorization Profile (AAP)",
        description: "OAuth 2.0 for autonomous AI agents",
        images: ["/og-image.png"],
    },
};

import { Footer } from "@/components/landing/Footer";

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
                <div className="flex flex-col min-h-screen">
                    <main className="grow">{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
