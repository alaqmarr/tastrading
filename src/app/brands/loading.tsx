export default function Loading() {
    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="text-center mb-12">
                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
                    <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
                    <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-8 border border-gray-100 animate-pulse"
                        >
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-xl"></div>
                            <div className="h-5 w-20 bg-gray-200 rounded mx-auto mb-2"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
