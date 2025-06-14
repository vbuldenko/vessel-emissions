import { getVesselsWithData } from "@/lib/actions/vessel.actions";
import VesselCard from "@/components/vessel/VesselCard";
import MultiVesselComparisonChart from "@/components/charts/MultiVesselChart";

export default async function Home() {
  const vessels = await getVesselsWithData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Vessel Emissions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vessels.map((vessel) => (
          <VesselCard key={vessel.id} vessel={vessel} />
        ))}
      </div>
      <div className="mt-12">
        <MultiVesselComparisonChart
          data={vessels.map((vessel) => ({
            vesselName: vessel.name,
            imoNo: vessel.imoNo,
            data: (vessel.quarterlyData ?? []).map((q: any) => ({
              quarter: q.quarterKey,
              date: q.date.getTime(),
              deviation: q.deviation,
              actualEEOI: q.emission.eeoiCo2eW2w,
              baseline: q.baselines.min.toNumber(),
              status: q.status as "compliant" | "non-compliant",
            })),
          }))}
        />
      </div>

      {vessels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vessels found</p>
        </div>
      )}
    </div>
  );
}
