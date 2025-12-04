import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import OfficeLocations from "@/components/OfficeLocations";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Get in touch with TAS Trading Corporation. Contact our offices in Secunderabad, Telangana for inquiries about industrial tools and equipment.",
    openGraph: {
        title: "Contact Us | TAS Trading Corporation",
        description:
            "Contact our offices in Secunderabad, Telangana for industrial tools inquiries.",
        url: `${siteConfig.url}/contact`,
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | TAS Trading Corporation",
        description: "Get in touch for industrial tools and equipment inquiries.",
    },
    alternates: {
        canonical: `${siteConfig.url}/contact`,
    },
};

export default function ContactPage() {
    return (
        <div className="py-8 lg:py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-8 lg:mb-12">
                    <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
                        Get in Touch
                    </span>
                    <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-gray-900">Contact Us</h1>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                        Have questions about our products? Need a quote? Our team is ready
                        to help you find the right tools for your needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <div className="order-2 lg:order-1">
                        <ContactForm />
                    </div>

                    {/* Office Locations */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                            Our Offices
                        </h2>
                        <OfficeLocations />
                    </div>
                </div>

                {/* Map Section - Google Maps Embeds */}
                <div className="mt-12 lg:mt-16">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6 text-center">
                        Find Us on the Map
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {/* Head Office */}
                        <div className="bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="aspect-video relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4!2d78.498!3d17.439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzIwLjQiTiA3OMKwMjknNTMuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0"
                                />
                            </div>
                            <div className="p-3 lg:p-4">
                                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Head Office</h3>
                                <p className="text-xs lg:text-sm text-gray-500">Secunderabad</p>
                            </div>
                        </div>

                        {/* Branch Office */}
                        <div className="bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="aspect-video relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4!2d78.434!3d17.415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI0JzU0LjAiTiA3OMKwMjYnMDQuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0"
                                />
                            </div>
                            <div className="p-3 lg:p-4">
                                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Branch Office</h3>
                                <p className="text-xs lg:text-sm text-gray-500">Hyderabad</p>
                            </div>
                        </div>

                        {/* Balanagar Branch */}
                        <div className="bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
                            <div className="aspect-video relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.9!2d78.421!3d17.463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI3JzQ2LjciTiA3OMKwMjUnMTYuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0"
                                />
                            </div>
                            <div className="p-3 lg:p-4">
                                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Balanagar Branch</h3>
                                <p className="text-xs lg:text-sm text-gray-500">Balanagar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
