import { useEffect, useState } from "react";
import { User, Calendar, FileText, Palmtree } from "lucide-react";
import { leaveTypeApi } from "../../api/leaveTypeApi";

export default function LeaveForm({ value = {}, onChange }) {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaveTypes = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await leaveTypeApi.getActiveOptions();
        setLeaveTypes(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Failed to load leave types:", err);
        setError("Failed to load leave types.");
      } finally {
        setLoading(false);
      }
    };

    loadLeaveTypes();
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

      {/* Leave Type Dropdown */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Leave Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Palmtree
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={value.leaveTypeId || ""}
            onChange={(e) =>
              handleChange(
                "leaveTypeId",
                e.target.value ? Number(e.target.value) : ""
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
          >
            <option value="">
              {loading ? "Loading leave types..." : "Select leave type..."}
            </option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                #{type.id} - {type.name} {type.code ? `(${type.code})` : ""}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>

      {/* Start Date & End Date Grid */}
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
            End Date <span className="text-red-500">*</span>
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

      {/* Reason */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Reason
        </label>
        <div className="relative">
          <FileText
            size={16}
            className="pointer-events-none absolute left-3 top-3 text-slate-400"
          />
          <textarea
            rows={3}
            maxLength={500}
            value={value.reason || ""}
            onChange={(e) => handleChange("reason", e.target.value)}
            placeholder="Describe the reason for leave..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}