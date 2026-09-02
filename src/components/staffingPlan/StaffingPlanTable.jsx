import {
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Hash,
  Users,
} from "lucide-react";

export default function StaffingPlanTable({
  staffingPlans,
  loading,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-center py-16 text-sm text-slate-500">
          Loading staffing plans...
        </div>
      </div>
    );
  }

  if (!staffingPlans || staffingPlans.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-500">
            <BriefcaseBusiness size={22} />
          </div>

          <h3 className="text-sm font-semibold text-slate-900">
            No staffing plans found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            There are no staffing plans matching your search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                ID
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Structure
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Position
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Salary
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Capacity
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {staffingPlans.map((plan) => (
              <tr
                key={plan.id}
                className="transition-colors hover:bg-slate-50"
              >
                {/* ID */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Hash
                      size={15}
                      className="text-slate-400"
                    />

                    <span className="text-sm font-semibold text-slate-900">
                      {plan.id}
                    </span>
                  </div>
                </td>

                {/* Structure */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Building2
                      size={16}
                      className="shrink-0 text-slate-400"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {plan.structureName || "—"}
                      </p>

                      <p className="text-xs text-slate-500">
                        ID: {plan.structureId ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Position */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness
                      size={16}
                      className="shrink-0 text-slate-400"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {plan.positionName || "—"}
                      </p>

                      <p className="text-xs text-slate-500">
                        ID: {plan.positionId ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Salary */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign
                      size={16}
                      className="text-slate-400"
                    />

                    <span className="text-sm font-medium text-slate-900">
                      {plan.salary ?? "—"}
                    </span>
                  </div>
                </td>

                {/* Capacity */}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Users
                      size={16}
                      className="text-slate-400"
                    />

                    <span className="text-sm font-medium text-slate-900">
                      {plan.capacity ?? "—"}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="whitespace-nowrap px-5 py-4">
                  <StatusBadge
                    isClosed={plan.isClosed}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ isClosed }) {
  const closed = Boolean(isClosed);

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1",
        "text-xs font-medium",
        closed
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {closed ? "CLOSED" : "OPEN"}
    </span>
  );
}