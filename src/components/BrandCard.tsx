"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BrandCardProps {
    brand: {
        id: string;
        name: string;
        imageUrl?: string | null;
        _count?: { products: number };
    };
    index?: number;
}

export default function BrandCard({ brand, index = 0 }: BrandCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link href={`/brands/${brand.id}`}>
                <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative flex flex-col items-center text-center">
                        {/* Brand Logo/Image */}
                        <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                            {brand.imageUrl ? (
                                <Image
                                    src={brand.imageUrl}
                                    alt={brand.name}
                                    width={96}
                                    height={96}
                                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
                                    <span className="text-3xl font-bold text-emerald-600">
                                        {brand.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Brand Name */}
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                            {brand.name}
                        </h3>

                        {/* Product Count */}
                        {brand._count && (
                            <p className="text-sm text-gray-500">
                                {brand._count.products} Products
                            </p>
                        )}

                        {/* Arrow Icon */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            className="absolute bottom-4 right-4 text-emerald-500"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}
