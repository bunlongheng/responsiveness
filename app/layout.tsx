import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Responsiveness - preview any URL across devices",
    description: "Paste any URL and see it rendered live across real device frames - iPhone, iPad, Android, Desktop, Apple Watch, and Smart TV, side by side.",
    openGraph: {
        title: "Responsiveness",
        description: "Preview any URL across iPhone, iPad, Android, Desktop, Watch and TV frames.",
        type: "website",
    },
    robots: { index: true, follow: true },
};

export const viewport = {
    themeColor: "#ffffff",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
