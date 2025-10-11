import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import Menu from "@/components/Menu";
import TransitionOverlay from "@/components/TransitionOverlay";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    display: "swap",
    preload: true,
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: {
        default: "CyferNova - Interactive Tile Experience",
        template: "%s | CyferNova",
    },
    description:
        "Experience an innovative interactive tile board with stunning animations. CyferNova delivers a unique visual experience with GSAP-powered animations and modern web design.",
    keywords: [
        "CyferNova",
        "interactive design",
        "web animations",
        "GSAP",
        "Next.js",
        "modern web",
        "tile board",
        "interactive tiles",
    ],
    authors: [{ name: "CyferNova Team" }],
    creator: "CyferNova",
    publisher: "CyferNova",
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://cyfernova.vercel.app",
    ),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "CyferNova - Interactive Tile Experience",
        description:
            "Experience an innovative interactive tile board with stunning animations. CyferNova delivers a unique visual experience.",
        siteName: "CyferNova",
        images: [
            {
                url: "/cyfernova.png",
                width: 1200,
                height: 630,
                alt: "CyferNova Interactive Tile Board",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "CyferNova - Interactive Tile Experience",
        description:
            "Experience an innovative interactive tile board with stunning animations.",
        images: ["/cyfernova.png"],
        creator: "@cyfernova",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
        // yahoo: "your-yahoo-verification-code",
    },
    alternates: {
        canonical: "/",
    },
    category: "technology",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
            >
                <Menu />
                {children}
                {/* Transition overlay mounted globally so it runs across routes */}
                <TransitionOverlay />
            </body>
        </html>
    );
}
