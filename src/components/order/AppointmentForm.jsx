import { useEffect, useState } from "react";
import { BriefcaseBusiness, Calendar, User } from "lucide-react";
import { getStaffingPlans } from "../../api/staffingPlanApi";

export default function AppointmentForm({ value = {}, onChange }) {
  const [staffingPlans, setStaffingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaffingPlans = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getStaffingPlans({
          page: 0,
          size: 100,
        });
        setStaffingPlans(response?.content || []);
      } catch (err) {
        console.error("Failed to load staffing plans:", err);
        setError("Failed to load staffing plans.");
      } finally {
        setLoading(false);
      }
    };

    loadStaffingPlans();
  }, []);

  const handleChange = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="space-y-5">
      {/* Person ID */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Person ID <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="number"
            value={value.personId || ""}
            onChange={(e) =>
              handleChange(
                "personId",
                e.target.value ? Number(e.target.value) : ""
              )
            }
            placeholder="Enter Person ID"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Staffing Plan Dropdown */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Staffing Plan <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <BriefcaseBusiness
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={value.staffingPlanId || ""}
            onChange={(e) =>
              handleChange(
                "staffingPlanId",
                e.target.value ? Number(e.target.value) : ""
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
          >
            <option value="">
              {loading
                ? "Loading staffing plans..."
                : "Select staffing plan..."}
            </option>
            {staffingPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                #{plan.id} - {plan.structureName || "No structure"} /{" "}
                {plan.positionName || "No position"} - Salary:{" "}
                {plan.salary ?? "—"}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={value.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            End Date
          </label>
          <div className="relative">
            <Calendar
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={value.endDate || ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}