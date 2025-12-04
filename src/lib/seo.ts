// SEO configuration and utilities for TAS Trading Corporation

export const siteConfig = {
  name: "TAS Trading Corporation",
  description:
    "Leading supplier of industrial tools and equipment since 1968. Authorized dealers for Dormer, Mitsubishi, Sandvik, Fenner, Gates and more. HSS Taps, Drilling Bits, CNC Tools, Transmission Belts & Machine Tools.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tastrading.com",
  ogImage: "/og-image.png",
  keywords: [
    "industrial tools",
    "HSS taps",
    "drilling bits",
    "CNC tools",
    "transmission belts",
    "power hacksaw blades",
    "machine tools",
    "grinding equipment",
    "cutting tools",
    "industrial equipment Hyderabad",
    "tools supplier Telangana",
    "tools supplier Andhra Pradesh",
    "Dormer tools",
    "Mitsubishi tools",
    "Sandvik tools",
    "Fenner belts",
    "Gates belts",
    "industrial supplier India",
    "TAS Trading",
    "Secunderabad tools",
  ],
  authors: [{ name: "TAS Trading Corporation" }],
  creator: "TAS Trading Corporation",
  publisher: "TAS Trading Corporation",
  locale: "en_IN",
  type: "website" as const,
  twitter: {
    card: "summary_large_image" as const,
    site: "@tastrading",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  contact: {
    phone: "+91 9052772942",
    email: "info@tastrading.com",
    address: "Secunderabad, Telangana, India",
  },
  business: {
    foundedYear: 1968,
    type: "Industrial Tools & Equipment Supplier",
    areas: ["Andhra Pradesh", "Telangana"],
  },
};

// Generate metadata for pages
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image,
  path = "",
  noIndex = false,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  path?: string;
  noIndex?: boolean;
}) {
  const fullTitle = title.includes("TAS Trading")
    ? title
    : `${title} | TAS Trading Corporation`;

  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: siteConfig.type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: fullTitle,
      description,
      images: [ogImage],
      site: siteConfig.twitter.site,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
          },
        },
    verification: siteConfig.verification,
  };
}

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    foundingDate: siteConfig.business.foundedYear.toString(),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Secunderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "sales",
      areaServed: siteConfig.business.areas,
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
    sameAs: [],
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    image: `${siteConfig.url}/logo.png`,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Secunderabad",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500003",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.4335236,
      longitude: 78.490871,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
  };
}

export function generateProductSchema(product: {
  name: string;
  description?: string;
  price?: number;
  image?: string;
  brand?: string;
  category?: string;
  id: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description || `${product.name} from TAS Trading Corporation`,
    image: product.image || `${siteConfig.url}/placeholder-product.jpg`,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    category: product.category,
    url: `${siteConfig.url}/products/${product.id}`,
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: siteConfig.name,
          },
        }
      : {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: siteConfig.name,
          },
        },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
