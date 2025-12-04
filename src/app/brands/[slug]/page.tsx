import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const brand = await prisma.brand.findUnique({
        where: { id: slug },
        select: { name: true },
    });

    if (!brand) {
        return { title: "Brand Not Found | TAS Trading Corporation" };
    }

    return {
        title: `${brand.name} Products | TAS Trading Corporation`,
        description: `Explore our range of ${brand.name} products. Premium quality industrial tools and equipment from ${brand.name}.`,
    };
}

async function getBrand(slug: string) {
    const brand = await prisma.brand.findUnique({
        where: { id: slug },
        include: {
            products: {
                where: { isArchived: false },
                include: {
                    images: { take: 1 },
                    category: { select: { name: true } },
                },
                orderBy: { priority: "desc" },
            },
        },
    });
    return brand;
}

export default async function BrandDetailPage({ params }: Props) {
    const { slug } = await params;
    const brand = await getBrand(slug);

    if (!brand) {
        notFound();
    }

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center gap-2 text-sm text-gray-500">
                        <li>
                            <Link href="/" className="hover:text-emerald-600">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/brands" className="hover:text-emerald-600">
                                Brands
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{brand.name}</li>
                    </ol>
                </nav>

                {/* Brand Header */}
                <div className="bg-white rounded-2xl p-8 mb-12 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {brand.imageUrl ? (
                            <Image
                                src={brand.imageUrl}
                                alt={brand.name}
                                width={120}
                                height={120}
                                className="rounded-xl object-contain"
                            />
                        ) : (
                            <div className="w-30 h-30 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                                <span className="text-5xl font-bold text-emerald-600">
                                    {brand.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
                            <p className="mt-2 text-gray-600">
                                {brand.products.length} Products Available
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {brand.name} Products
                    </h2>
                </div>

                {brand.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {brand.products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    ...product,
                                    price: product.price ? Number(product.price) : null,
                                    brand: { name: brand.name },
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl">
                        <p className="text-gray-500">
                            No products available for this brand yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
