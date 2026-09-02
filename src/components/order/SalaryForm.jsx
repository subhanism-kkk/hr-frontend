import { useEffect, useState } from "react";
import { BriefcaseBusiness, Calendar, Wallet } from "lucide-react";
import { getStaffingPlans } from "../../api/staffingPlanApi";

const getTodayLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function SalaryForm({ value = {}, onChange }) {
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
      } catch (error) {
        console.error("Failed to load staffing plans:", error);
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

  const selectedStaffingPlan = staffingPlans.find(
    (plan) => plan.id === Number(value.staffingPlanId)
  );

  const oldSalary = selectedStaffingPlan?.salary;
  const today = getTodayLocalDate();

  return (
    <div className="space-y-5">
      {/* Staffing Plan */}
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
            onChange={(event) =>
              handleChange(
                "staffingPlanId",
                event.target.value ? Number(event.target.value) : ""
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

      {/* Current Salary */}
      {selectedStaffingPlan && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
              <Wallet size={17} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Current Salary
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {oldSalary ?? "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Salary */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          New Salary <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Wallet
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={value.newSalary ?? ""}
            onChange={(event) =>
              handleChange(
                "newSalary",
                event.target.value ? Number(event.target.value) : ""
              )
            }
            placeholder="Enter new salary"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <p className="mt-1.5 text-xs text-slate-400">
          New salary must be greater than the current salary.
        </p>
      </div>

      {/* Effective Date */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Effective Date <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Calendar
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="date"
            min={today}
            value={value.effectiveDate || ""}
            onChange={(event) =>
              handleChange("effectiveDate", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <p className="mt-1.5 text-xs text-slate-400">
          Effective date must be today or later.
        </p>
      </div>
    </div>
  );
}