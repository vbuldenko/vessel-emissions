import VesselEmissionsChart from "@/components/charts/VesselChart";
import { getVesselData } from "@/lib/actions/vessel.actions";
import { getDeviation } from "@/lib/utils/vessel.utils";
import Link from "next/link";

import { notFound } from "next/navigation";

interface VesselDetailsPageProps {
  params: Promise<{
    imoNo: string;
  }>;
}

export default async function VesselDetailsPage({
  params,
}: VesselDetailsPageProps) {
  const { imoNo } = await params;

  try {
    const vesselData = await getVesselData(Number(imoNo));

    if (!vesselData) {
      notFound();
    }

    const { quarterlyData, ...vessel } = vesselData;
    const baselines = quarterlyData.at(-1)?.baselines;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {vessel.name}
            </h1>
            <p className="text-gray-600">IMO: {vessel.imoNo}</p>
          </div>
          <Link href="/" className="p-2 bg-black text-white rounded-md">
            Home
          </Link>
        </div>

        {/* Vessel Information Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Vessel Type
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {vessel.vesselType}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Max Deadweight
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {vessel.maxDeadWg.toLocaleString()}{" "}
              <span className="text-sm font-normal">tonnes</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Min Baselines
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {baselines?.min.toFixed(2)}{" "}
              <span className="text-sm font-normal">gCO₂/t·nm</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Emissions Records
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {vessel.emissions?.length}
            </p>
          </div>
        </div>

        {/* Baselines Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Poseidon Principles Baselines: {quarterlyData.at(-1)?.quarterKey}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Minimum</p>
              <p className="text-lg font-semibold text-red-600">
                {baselines?.min.toFixed(2)} gCO₂/t·nm
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Striving</p>
              <p className="text-lg font-semibold text-green-600">
                {baselines?.striving.toFixed(2)} gCO₂/t·nm
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">YX Low</p>
              <p className="text-lg font-semibold text-blue-600">
                {baselines?.yxLow.toFixed(2)} gCO₂/t·nm
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">YX Up</p>
              <p className="text-lg font-semibold text-purple-600">
                {baselines?.yxUp.toFixed(2)} gCO₂/t·nm
              </p>
            </div>
          </div>
        </div>

        {/* Emissions Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <VesselEmissionsChart
            data={{
              vesselName: vessel.name,
              imoNo: vessel.imoNo,
              data: quarterlyData.map((q) => ({
                quarter: q.quarterKey,
                date: q.date.getTime(),
                deviation: q.deviation,
                actualEEOI: q.emission.eeoiCo2eW2w,
                baseline: q.baselines.min.toNumber(),
                status: q.status as "compliant" | "non-compliant",
              })),
            }}
            height={500}
          />
        </div>

        {/* Recent Emissions Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Emissions Data
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EEOI CO₂e
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total CO₂
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deviation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vessel.emissions.slice(0, 10).map((emission) => {
                  const deviation = getDeviation(emission, baselines!);

                  return (
                    <tr key={emission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(emission.toUtc).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emission.eeoiCo2eW2w.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emission.totTCo2.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            deviation > 0
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {deviation.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading vessel details:", error);
    notFound();
  }
}
