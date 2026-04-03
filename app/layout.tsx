import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "EcommerceInCameroun237 — Boutique en ligne camerounaise",
    template: "%s | EcommerceInCameroun237",
  },
  description:
    "Découvrez l'artisanat et les produits authentiques du Cameroun. Vêtements traditionnels, bijoux, artisanat et produits alimentaires.",
  keywords: [
    "cameroun",
    "artisanat",
    "boutique en ligne",
    "wax",
    "bijoux",
    "produits camerounais",
  ],
  authors: [{ name: "EcommerceInCameroun237" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXTAUTH_URL ?? "https://ecommerce237.vercel.app",
    siteName: "EcommerceInCameroun237",
    title: "EcommerceInCameroun237 — Boutique en ligne camerounaise",
    description:
      "Découvrez l'artisanat et les produits authentiques du Cameroun.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcommerceInCameroun237",
    description: "Boutique en ligne camerounaise",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
