import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { siteConfig } from "@/lib/seo";

// Revalidate products page every 5 minutes
export const revalidate = 300;

export const metadata: Metadata = {
    title: "Products",
    description:
        "Browse our complete range of industrial tools and equipment. HSS Taps, Drilling Bits, Transmission Belts, CNC Tools, and more from premium brands.",
    openGraph: {
        title: "Products | TAS Trading Corporation",
        description:
            "Browse our complete range of industrial tools and equipment. HSS Taps, Drilling Bits, Transmission Belts, CNC Tools, and more from premium brands.",
        url: `${siteConfig.url}/products`,
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Products | TAS Trading Corporation",
        description: "Browse our complete range of industrial tools and equipment.",
    },
    alternates: {
        canonical: `${siteConfig.url}/products`,
    },
};

interface Props {
    searchParams: Promise<{ brand?: string; category?: string }>;
}

async function getProducts(brandId?: string, categoryId?: string) {
    const where = {
        isArchived: false,
        ...(brandId && { brandId }),
        ...(categoryId && { categoryId }),
    };

    const [products, brands, categories] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                images: { take: 1 },
                brand: { select: { name: true } },
                category: { select: { name: true } },
            },
            orderBy: { priority: "desc" },
        }),
        prisma.brand.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
        prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ]);

    return { products, brands, categories };
}

export default async function ProductsPage({ searchParams }: Props) {
    const { brand, category } = await searchParams;
    const { products, brands, categories } = await getProducts(brand, category);

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
                        Our Products
                    </span>
                    <h1 className="mt-3 text-4xl font-bold text-gray-900">All Products</h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Explore our comprehensive range of premium industrial tools and equipment
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Brand</h4>
                                <div className="space-y-2">
                                    <Link
                                        href="/products"
                                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!brand
                                            ? "bg-emerald-50 text-emerald-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        All Brands
                                    </Link>
                                    {brands.map((b) => (
                                        <Link
                                            key={b.id}
                                            href={`/products?brand=${b.id}${category ? `&category=${category}` : ""}`}
                                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${brand === b.id
                                                ? "bg-emerald-50 text-emerald-700 font-medium"
                                                : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {b.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
                                <div className="space-y-2">
                                    <Link
                                        href={`/products${brand ? `?brand=${brand}` : ""}`}
                                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!category
                                            ? "bg-emerald-50 text-emerald-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        All Categories
                                    </Link>
                                    {categories.map((c) => (
                                        <Link
                                            key={c.id}
                                            href={`/products?${brand ? `brand=${brand}&` : ""}category=${c.id}`}
                                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${category === c.id
                                                ? "bg-emerald-50 text-emerald-700 font-medium"
                                                : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(brand || category) && (
                                <Link
                                    href="/products"
                                    className="mt-6 block w-full text-center py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Clear All Filters
                                </Link>
                            )}
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600">
                                Showing <span className="font-medium">{products.length}</span> products
                            </p>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            price: product.price ? Number(product.price) : null,
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-4">Try adjusting your filters or check back later.</p>
                                <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                    Clear all filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
