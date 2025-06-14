import Link from "next/link";

interface Vessel {
  id: number;
  name: string;
  imoNo: number;
  vesselType: number;
  maxDeadWg: number;
}

interface VesselCardProps {
  vessel: Vessel;
}

export default function VesselCard({ vessel }: VesselCardProps) {
  return (
    <Link href={`/vessels/${vessel.imoNo}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {vessel.name}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Type {vessel.vesselType}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>IMO Number:</span>
            <span className="font-medium">{vessel.imoNo}</span>
          </div>

          <div className="flex justify-between">
            <span>Max Deadweight:</span>
            <span className="font-medium">
              {vessel.maxDeadWg.toLocaleString()} t
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-blue-600 text-sm font-medium hover:text-blue-800">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
