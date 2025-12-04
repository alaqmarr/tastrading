"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { offices, findNearestOffice, calculateDistance, getWhatsAppLink, type Office } from "@/lib/offices";

interface OfficeWithDistance extends Office {
    distance?: number;
}

export default function OfficeLocations() {
    const [nearestOffice, setNearestOffice] = useState<Office | null>(null);
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [officesWithDistance, setOfficesWithDistance] = useState<OfficeWithDistance[]>(offices);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    const nearest = findNearestOffice(latitude, longitude);
                    setNearestOffice(nearest);

                    // Calculate distance for each office
                    const withDistances = offices.map((office) => ({
                        ...office,
                        distance: calculateDistance(
                            latitude,
                            longitude,
                            office.coordinates.lat,
                            office.coordinates.lng
                        ),
                    }));
                    // Sort by distance
                    withDistances.sort((a, b) => (a.distance || 0) - (b.distance || 0));
                    setOfficesWithDistance(withDistances);
                },
                (error) => {
                    console.log("Geolocation error:", error.message);
                }
            );
        }
    }, []);

    // Format distance for display
    const formatDistance = (km: number) => {
        if (km < 1) {
            return `${Math.round(km * 1000)} m`;
        }
        return `${km.toFixed(1)} km`;
    };

    return (
        <div className="space-y-4 lg:space-y-6">
            {/* Location Status */}
            {userLocation && nearestOffice && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 lg:p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                            <svg
                                className="w-4 h-4 lg:w-5 lg:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs lg:text-sm text-emerald-600 font-medium">
                                Nearest to you
                            </p>
                            <p className="text-emerald-800 font-semibold text-sm lg:text-base truncate">
                                {nearestOffice.name}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Office Cards */}
            <div className="space-y-4 lg:space-y-6">
                {officesWithDistance.map((office, index) => (
                    <motion.div
                        key={office.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border-2 transition-all ${nearestOffice?.id === office.id
                                ? "border-emerald-500 shadow-emerald-100"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                    >
                        {/* Office Header */}
                        <div className="flex items-start justify-between mb-3 lg:mb-4">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 truncate">
                                        {office.name}
                                    </h3>
                                    {nearestOffice?.id === office.id && (
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex-shrink-0">
                                            Nearest
                                        </span>
                                    )}
                                </div>
                                {/* Distance Badge */}
                                {userLocation && office.distance !== undefined && (
                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {formatDistance(office.distance)}
                                    </span>
                                )}
                            </div>
                            <a
                                href={office.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 transition-colors flex-shrink-0 ml-2"
                            >
                                <svg
                                    className="w-5 h-5 lg:w-6 lg:h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>

                        {/* Contacts */}
                        <div className="space-y-2 lg:space-y-3">
                            {office.contacts.map((contact) => (
                                <div
                                    key={contact.phone}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 lg:py-3 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-gray-900 font-medium text-sm lg:text-base truncate block">
                                                {contact.name}
                                            </span>
                                            {contact.isPrimary && (
                                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-10 sm:ml-0">
                                        {/* WhatsApp Button */}
                                        <a
                                            href={getWhatsAppLink(contact.phone, `Hi, I'm inquiring about TAS Trading products.`)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex-shrink-0"
                                            title={`WhatsApp ${contact.name}`}
                                        >
                                            <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                        </a>
                                        {/* Call Button */}
                                        <a
                                            href={`tel:${contact.phone}`}
                                            className="flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors text-xs lg:text-sm font-medium"
                                        >
                                            <svg
                                                className="w-3.5 h-3.5 lg:w-4 lg:h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                            <span className="hidden sm:inline">{contact.phone}</span>
                                            <span className="sm:hidden">Call</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map Link Button */}
                        <div className="mt-3 lg:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                            <a
                                href={office.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs lg:text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                                Open in Google Maps
                            </a>
                            {/* Get Directions Button */}
                            {userLocation && (
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${office.coordinates.lat},${office.coordinates.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs lg:text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Get Directions
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
