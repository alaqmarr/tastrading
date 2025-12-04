import { Metadata } from "next";
import prisma from "@/lib/prisma";
import CategoryCard from "@/components/CategoryCard";

export const metadata: Metadata = {
    title: "Product Categories | TAS Trading Corporation",
    description:
        "Browse our comprehensive range of industrial product categories including HSS Taps, Drilling Bits, Transmission Belts, CNC Tools, and more.",
};

async function getCategories() {
    return prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
    });
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
                        Product Range
                    </span>
                    <h1 className="mt-3 text-4xl font-bold text-gray-900">
                        Categories
                    </h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Explore our comprehensive range of industrial tools and equipment,
                        organized by category for easy browsing.
                    </p>
                </div>

                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <CategoryCard key={category.id} category={category} index={index} />
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
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No categories yet
                        </h3>
                        <p className="text-gray-500">
                            Categories will be added soon. Check back later!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
