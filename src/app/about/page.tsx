import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
    title: "About Us - Since 1968",
    description:
        "Learn about TAS Trading Corporation's 56+ years of excellence in supplying premium industrial tools and equipment. Based in Secunderabad, Telangana.",
    openGraph: {
        title: "About Us | TAS Trading Corporation - Since 1968",
        description:
            "56+ years of excellence in supplying premium industrial tools and equipment.",
        url: `${siteConfig.url}/about`,
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | TAS Trading Corporation",
        description: "56+ years of industrial excellence since 1968.",
    },
    alternates: {
        canonical: `${siteConfig.url}/about`,
    },
};

export default function AboutPage() {
    const milestones = [
        { year: "1968", event: "TAS Trading Corporation established as a trading company" },
        { year: "1980s", event: "Expanded product range to include transmission belts and CNC tools" },
        { year: "1990s", event: "Partnered with global brands like Dormer and Mitsubishi" },
        { year: "2000s", event: "Opened branch offices across Telangana" },
        { year: "2020s", event: "Embracing digital transformation and online presence" },
    ];

    const values = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Quality Assurance",
            description: "We source only from globally trusted manufacturers ensuring premium quality in every product.",
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: "Customer First",
            description: "Our long-lasting relationships with clients are built on trust, reliability, and exceptional service.",
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Fast Delivery",
            description: "With multiple locations across Telangana, we ensure quick and reliable delivery to your doorstep.",
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: "Expert Guidance",
            description: "Our experienced team provides technical expertise to help you find the right tools for your needs.",
        },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full">
                        <pattern id="about-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1" fill="white" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#about-pattern)" />
                    </svg>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-emerald-400 font-medium text-sm tracking-wide uppercase">
                        Our Story
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">
                        About TAS Trading Corporation
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                        Over 56 years of excellence in supplying premium industrial tools and equipment
                    </p>
                </div>
            </section>

            {/* Company Introduction */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                A Legacy of <span className="text-emerald-600">Excellence</span>
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    <strong>TAS Trading Corporation</strong>, established in <strong>1968</strong> as a
                                    trading company, is a leading trader and supplier of <strong>HSS Taps & Drilling
                                        Bits, Transmission Belts, CNC Tools and Holders, Power Hacksaw Blades</strong> in
                                    Andhra Pradesh and Telangana.
                                </p>
                                <p>
                                    We source our entire product line from renowned and reliable vendors of the
                                    industry, who are trusted in the global market for their quality production.
                                </p>
                                <p>
                                    The products offered by us are reckoned in the market for their unmatched quality
                                    standards and salient features like <strong>high reliability, precise operations,
                                        accurate designs, optimum performance, anti-corrosive finish</strong> and <strong>long
                                            service life</strong>.
                                </p>
                                <p>
                                    Our long-lasting relationship with our vendors enables us to address the diverse
                                    needs of clients belonging from different industrial sectors.
                                </p>
                            </div>
                            <div className="mt-8 flex gap-4">
                                <Link
                                    href="/products"
                                    className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition-colors"
                                >
                                    View Products
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="TAS Trading Corporation"
                                    width={200}
                                    height={200}
                                    className="object-contain"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white rounded-2xl p-6 shadow-xl">
                                <div className="text-4xl font-bold">56+</div>
                                <div className="text-emerald-100">Years of Trust</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
                            Our Values
                        </span>
                        <h2 className="mt-3 text-3xl font-bold text-gray-900">What Sets Us Apart</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
                            Our Journey
                        </span>
                        <h2 className="mt-3 text-3xl font-bold text-gray-900">Milestones</h2>
                    </div>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-emerald-200"></div>
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center mb-8 ${index % 2 === 0 ? "justify-start" : "justify-end"
                                    }`}
                            >
                                <div
                                    className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}
                                >
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <span className="text-emerald-600 font-bold">{milestone.year}</span>
                                        <p className="text-gray-600 mt-1">{milestone.event}</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-emerald-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to Work With Us?</h2>
                    <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust TAS Trading Corporation for their
                        industrial tool requirements.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                    >
                        Get in Touch
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
