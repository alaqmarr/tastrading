"use client";

import { useEffect, useState } from "react";
import { offices, findNearestOffice, calculateDistance, getWhatsAppLink, type Office } from "@/lib/offices";

type LocationStatus = "loading" | "granted" | "denied" | "prompt" | "unavailable";

export default function NearestBranchBar() {
    const [nearestOffice, setNearestOffice] = useState<Office | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>("loading");
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if already dismissed in this session
        const dismissed = sessionStorage.getItem("locationBannerDismissed");
        if (dismissed) {
            setIsDismissed(true);
        }

        // Check if geolocation is available
        if (!("geolocation" in navigator)) {
            setLocationStatus("unavailable");
            setNearestOffice(offices[0]);
            return;
        }

        // Check permission status if available
        if ("permissions" in navigator) {
            navigator.permissions.query({ name: "geolocation" }).then((result) => {
                if (result.state === "granted") {
                    requestLocation();
                } else if (result.state === "denied") {
                    setLocationStatus("denied");
                    setNearestOffice(offices[0]);
                } else {
                    setLocationStatus("prompt");
                    // Show prompt banner, don't request yet
                }

                // Listen for permission changes
                result.onchange = () => {
                    if (result.state === "granted") {
                        requestLocation();
                    } else if (result.state === "denied") {
                        setLocationStatus("denied");
                        setNearestOffice(offices[0]);
                    }
                };
            }).catch(() => {
                // Fallback if permissions API fails
                requestLocation();
            });
        } else {
            // No permissions API, try to request location
            requestLocation();
        }
    }, []);

    const requestLocation = () => {
        setLocationStatus("loading");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const nearest = findNearestOffice(latitude, longitude);
                if (nearest) {
                    setNearestOffice(nearest);
                    setDistance(
                        calculateDistance(
                            latitude,
                            longitude,
                            nearest.coordinates.lat,
                            nearest.coordinates.lng
                        )
                    );
                    setLocationStatus("granted");
                }
            },
            (error) => {
                console.log("Geolocation error:", error.code, error.message);
                if (error.code === 1) {
                    // Permission denied
                    setLocationStatus("denied");
                } else {
                    // Position unavailable or timeout
                    setLocationStatus("unavailable");
                }
                setNearestOffice(offices[0]);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000, // Cache for 5 minutes
            }
        );
    };

    const handleEnableLocation = () => {
        requestLocation();
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        sessionStorage.setItem("locationBannerDismissed", "true");
    };

    const contact = nearestOffice?.contacts[0];

    const formatDistance = (km: number) => {
        if (km < 1) return `${Math.round(km * 1000)}m away`;
        return `${km.toFixed(1)}km away`;
    };

    // Don't show anything while loading
    if (locationStatus === "loading") {
        return (
            <div className="bg-gray-900 text-white py-2 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
                    <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400">Finding nearest branch...</span>
                </div>
            </div>
        );
    }

    // Show prompt banner if location not yet requested
    if (locationStatus === "prompt" && !isDismissed) {
        return (
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2.5 px-4">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Enable location to find your nearest branch</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEnableLocation}
                            className="px-3 py-1 bg-white text-emerald-700 rounded-full text-xs font-semibold hover:bg-emerald-50 transition-colors"
                        >
                            Enable Location
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Dismiss"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show denied banner with fallback
    if (locationStatus === "denied" && !isDismissed) {
        return (
            <div className="bg-gray-900 text-white py-2 px-4">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-gray-300">Location access denied.</span>
                    </div>
                    {contact && (
                        <>
                            <span className="text-gray-600 hidden sm:inline">|</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">Contact our head office:</span>
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    {contact.phone}
                                </a>
                            </div>
                        </>
                    )}
                    <button
                        onClick={handleDismiss}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2"
                        aria-label="Dismiss"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Normal display with branch info (granted or unavailable with fallback)
    if (!nearestOffice || !contact) return null;

    return (
        <div className="bg-gray-900 text-white py-2 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
                {/* Location Info */}
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{nearestOffice.name}</span>
                    {distance && locationStatus === "granted" && (
                        <span className="text-gray-400 text-xs">({formatDistance(distance)})</span>
                    )}
                    {locationStatus !== "granted" && (
                        <span className="text-gray-500 text-xs">(Head Office)</span>
                    )}
                </div>

                <span className="text-gray-600 hidden sm:inline">|</span>

                {/* Contact Person */}
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-300">{contact.name}</span>
                </div>

                {/* Phone & WhatsApp */}
                <div className="flex items-center gap-3">
                    <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">{contact.phone}</span>
                    </a>

                    <a
                        href={getWhatsAppLink(contact.phone, "Hi, I'm visiting your website and would like to inquire about products.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-0.5 bg-green-600 hover:bg-green-500 rounded-full transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span className="text-xs font-medium">WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
