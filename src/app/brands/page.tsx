import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BrandCard from "@/components/BrandCard";
import { siteConfig } from "@/lib/seo";

// Revalidate brands page every 10 minutes
export const revalidate = 600;

export const metadata: Metadata = {
    title: "Our Brands",
    description:
        "Explore our premium brand partners including Dormer, Mitsubishi, Sandvik, Fenner, and Gates. Quality industrial tools from globally trusted manufacturers.",
    openGraph: {
        title: "Our Brands | TAS Trading Corporation",
        description:
            "Explore our premium brand partners including Dormer, Mitsubishi, Sandvik, Fenner, and Gates.",
        url: `${siteConfig.url}/brands`,
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Our Brands | TAS Trading Corporation",
        description: "Premium brand partners for industrial tools.",
    },
    alternates: {
        canonical: `${siteConfig.url}/brands`,
    },
};

async function getBrands() {
    return prisma.brand.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
    });
}

export default async function BrandsPage() {
    const brands = await getBrands();

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
                        Our Partners
                    </span>
                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Premium Brands
                    </h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        We partner with globally recognized manufacturers to bring you the
                        highest quality industrial tools and equipment.
                    </p>
                </div>

                {/* Brands Grid */}
                {brands.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {brands.map((brand, index) => (
                            <BrandCard key={brand.id} brand={brand} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No brands yet
                        </h3>
                        <p className="text-gray-500">
                            Brands will be added soon. Check back later!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
