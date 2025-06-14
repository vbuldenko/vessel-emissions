export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-md w-32 animate-pulse"></div>
        </div>

        {/* Vessel Info Card Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="h-6 bg-gray-200 rounded-md w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-28 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-36 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-6 bg-gray-200 rounded-md w-80 mb-6 animate-pulse"></div>
          <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400">
              <svg
                className="w-16 h-16 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
