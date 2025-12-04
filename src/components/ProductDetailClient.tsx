"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QuoteRequestModal from "@/components/QuoteRequestModal";
import { PRIMARY_CONTACT, getWhatsAppLink } from "@/lib/offices";

interface ProductDetailClientProps {
    product: {
        id: string;
        name: string;
        description: string | null;
        price: any;
        images: { id: string; url: string }[];
        brand: { id: string; name: string } | null;
        category: { id: string; name: string } | null;
        variants: {
            id: string;
            price: any;
            optionValues: { value: string }[];
        }[];
    };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const mainImage = product.images[0]?.url || "/placeholder-product.jpg";

    // Generate WhatsApp message with product info
    const whatsappMessage = `Hi, I'm interested in the following product:

*${product.name}*${product.brand ? `\nBrand: ${product.brand.name}` : ""}${product.category ? `\nCategory: ${product.category.name}` : ""}${product.price && Number(product.price) > 0 ? `\nPrice: ₹${Number(product.price).toLocaleString("en-IN")}` : ""}

Please share more details about availability and pricing.`;

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image Gallery */}
                    <div className="p-8 bg-gray-50">
                        <div className="aspect-square relative rounded-xl overflow-hidden bg-white">
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {product.images.slice(0, 4).map((image, i) => (
                                    <div
                                        key={image.id}
                                        className="aspect-square relative rounded-lg overflow-hidden bg-white border-2 border-gray-200 hover:border-emerald-500 cursor-pointer transition-colors"
                                    >
                                        <Image
                                            src={image.url}
                                            alt={`${product.name} ${i + 1}`}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-8">
                        {product.brand && (
                            <Link
                                href={`/brands/${product.brand.id}`}
                                className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full hover:bg-emerald-100 transition-colors mb-4"
                            >
                                {product.brand.name}
                            </Link>
                        )}

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        {product.category && (
                            <p className="text-sm text-gray-500 mb-6">
                                Category:{" "}
                                <Link
                                    href={`/categories/${product.category.id}`}
                                    className="text-emerald-600 hover:underline"
                                >
                                    {product.category.name}
                                </Link>
                            </p>
                        )}

                        {/* Price */}
                        <div className="mb-8">
                            {product.price && Number(product.price) > 0 ? (
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                </p>
                            ) : (
                                <p className="text-lg text-gray-600">Price on Request</p>
                            )}
                        </div>

                        {/* Variants */}
                        {product.variants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Available Variants
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant) => (
                                        <span
                                            key={variant.id}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
                                        >
                                            {variant.optionValues.map((v) => v.value).join(" / ")}
                                            {variant.price &&
                                                ` - ₹${Number(variant.price).toLocaleString("en-IN")}`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Description
                                </h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="space-y-3">
                            {/* Primary Actions */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setIsQuoteModalOpen(true)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
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
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Request Quote
                                </button>
                                <a
                                    href={getWhatsAppLink(PRIMARY_CONTACT.phone, whatsappMessage)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Enquire on WhatsApp
                                </a>
                            </div>

                            {/* Call Button */}
                            <a
                                href={`tel:${PRIMARY_CONTACT.phone}`}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                Call {PRIMARY_CONTACT.name}: {PRIMARY_CONTACT.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quote Request Modal */}
            <QuoteRequestModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                productName={product.name}
                productId={product.id}
            />
        </>
    );
}
