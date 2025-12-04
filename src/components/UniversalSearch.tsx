"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { offices } from "@/lib/offices";

interface SearchResult {
    products: { id: string; name: string; brand?: { name: string } }[];
    brands: { id: string; name: string }[];
    categories: { id: string; name: string }[];
}

interface UniversalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UniversalSearch({ isOpen, onClose }: UniversalSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Search with debounce
    useEffect(() => {
        if (query.length < 2) {
            setResults(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Filter offices locally
    const matchingOffices = query.length >= 2
        ? offices.filter(
            (office) =>
                office.name.toLowerCase().includes(query.toLowerCase()) ||
                office.contacts.some(
                    (c) =>
                        c.name.toLowerCase().includes(query.toLowerCase()) ||
                        c.phone.includes(query)
                )
        )
        : [];

    const hasResults =
        results &&
        (results.products.length > 0 ||
            results.brands.length > 0 ||
            results.categories.length > 0 ||
            matchingOffices.length > 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="relative">
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products, brands, categories, offices..."
                                    className="w-full pl-12 pr-12 py-4 text-lg border-b border-gray-100 outline-none"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Results */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {isLoading && (
                                    <div className="p-8 text-center">
                                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </div>
                                )}

                                {!isLoading && query.length >= 2 && !hasResults && (
                                    <div className="p-8 text-center text-gray-500">
                                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>No results found for &quot;{query}&quot;</p>
                                    </div>
                                )}

                                {!isLoading && hasResults && (
                                    <div className="py-2">
                                        {/* Products */}
                                        {results?.products && results.products.length > 0 && (
                                            <div className="px-4 py-2">
                                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Products</h3>
                                                {results.products.map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/products/${product.id}`}
                                                        onClick={onClose}
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-900 font-medium">{product.name}</p>
                                                            {product.brand && (
                                                                <p className="text-xs text-gray-500">{product.brand.name}</p>
                                                            )}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Brands */}
                                        {results?.brands && results.brands.length > 0 && (
                                            <div className="px-4 py-2 border-t border-gray-100">
                                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brands</h3>
                                                {results.brands.map((brand) => (
                                                    <Link
                                                        key={brand.id}
                                                        href={`/brands/${brand.id}`}
                                                        onClick={onClose}
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-blue-600 font-bold text-sm">{brand.name.charAt(0)}</span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium">{brand.name}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Categories */}
                                        {results?.categories && results.categories.length > 0 && (
                                            <div className="px-4 py-2 border-t border-gray-100">
                                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
                                                {results.categories.map((category) => (
                                                    <Link
                                                        key={category.id}
                                                        href={`/categories/${category.id}`}
                                                        onClick={onClose}
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-gray-900 font-medium">{category.name}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Offices */}
                                        {matchingOffices.length > 0 && (
                                            <div className="px-4 py-2 border-t border-gray-100">
                                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Offices & Contacts</h3>
                                                {matchingOffices.map((office) => (
                                                    <Link
                                                        key={office.id}
                                                        href="/contact"
                                                        onClick={onClose}
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-900 font-medium">{office.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {office.contacts.map((c) => c.name).join(", ")}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quick Links when empty */}
                                {query.length < 2 && (
                                    <div className="p-4">
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/products" onClick={onClose} className="px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
                                                All Products
                                            </Link>
                                            <Link href="/brands" onClick={onClose} className="px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
                                                All Brands
                                            </Link>
                                            <Link href="/categories" onClick={onClose} className="px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
                                                Categories
                                            </Link>
                                            <Link href="/contact" onClick={onClose} className="px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
                                                Contact Us
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">ESC</kbd> to close</span>
                                <span>Search powered by TAS Trading</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
