import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NearestBranchBar from "@/components/NearestBranchBar";
import prisma from "@/lib/prisma";
import NextTopLoader from "nextjs-toploader";
import { siteConfig, generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Better font loading
});

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#10b981",
};

// Root metadata with full OpenGraph
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "TAS Trading Corporation | Industrial Tools & Equipment Since 1968",
    template: "%s | TAS Trading Corporation",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TAS Trading Corporation | Industrial Tools & Equipment Since 1968",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TAS Trading Corporation - Industrial Excellence Since 1968",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TAS Trading Corporation",
    description: siteConfig.description,
    images: ["/og-image.png"],
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
    google: siteConfig.verification.google,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "Industrial Equipment",
};

// Cache header data for 5 minutes
async function getHeaderData() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return { brands, categories };
}

// Revalidate layout data every 5 minutes
export const revalidate = 300;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { brands, categories } = await getHeaderData();

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Favicon */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextTopLoader color="#10b981" height={3} showSpinner={false} />
        <NearestBranchBar />
        <Header brands={brands} categories={categories} />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
