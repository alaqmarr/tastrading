import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ProductDetailClient from "@/components/ProductDetailClient";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
        where: { id: slug },
        select: { name: true, description: true, brand: { select: { name: true } } },
    });

    if (!product) {
        return { title: "Product Not Found | TAS Trading Corporation" };
    }

    return {
        title: `${product.name} | TAS Trading Corporation`,
        description:
            product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
            `${product.name} from ${product.brand?.name || "TAS Trading"}. Premium quality industrial tools and equipment.`,
    };
}

async function getProduct(slug: string) {
    return prisma.product.findUnique({
        where: { id: slug, isArchived: false },
        include: {
            images: true,
            brand: true,
            category: true,
            variants: {
                where: { isActive: true },
                include: {
                    optionValues: {
                        include: { option: true },
                    },
                },
            },
        },
    });
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
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
                            <Link href="/products" className="hover:text-emerald-600">
                                Products
                            </Link>
                        </li>
                        {product.category && (
                            <>
                                <li>/</li>
                                <li>
                                    <Link
                                        href={`/categories/${product.category.id}`}
                                        className="hover:text-emerald-600"
                                    >
                                        {product.category.name}
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>/</li>
                        <li className="text-gray-900 font-medium truncate max-w-[200px]">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                {/* Product Detail (Client Component for interactivity) */}
                <ProductDetailClient product={product} />
            </div>
        </div>
    );
}
