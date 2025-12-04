"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface CategoryCardProps {
    category: {
        id: string;
        name: string;
        _count?: { products: number };
    };
    index?: number;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
    taps: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-9h6l-3+6m-6 6s0-3 3-3m6 3s0-3-3-3" />
        </svg>
    ),
    drilling: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18M9 8l3-5 3 5M7 13h10" />
        </svg>
    ),
    default: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6M12 9v6" />
        </svg>
    ),
};

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
    const icon = categoryIcons.default;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link href={`/categories/${category.id}`}>
                <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-emerald-200 transition-all duration-300 overflow-hidden"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative flex flex-col items-center text-center text-white">
                        {/* Icon */}
                        <div className="w-16 h-16 mb-4 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                            {icon}
                        </div>

                        {/* Category Name */}
                        <h3 className="text-lg font-semibold mb-1">{category.name}</h3>

                        {/* Product Count */}
                        {category._count && (
                            <p className="text-sm text-emerald-100">
                                {category._count.products} Products
                            </p>
                        )}

                        {/* Explore Text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="mt-4 text-sm font-medium flex items-center gap-2"
                        >
                            Explore
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.p>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}
