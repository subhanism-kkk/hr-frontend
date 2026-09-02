import { useEffect, useState } from "react";
import { Building2, Briefcase, DollarSign, Users } from "lucide-react";
import { getStructures } from "../../api/structureApi";
import { positionApi } from "../../api/positionApi";

export default function StaffingPlanForm({ value = {}, onChange }) {
  const [structures, setStructures] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setLoading(true);
        setError("");

        const [structRes, posRes] = await Promise.all([
          getStructures({ page: 0, size: 100 }),
          positionApi.getAll({ page: 0, size: 100 }),
        ]);

        setStructures(structRes?.content || structRes || []);
        setPositions(posRes?.content || posRes || []);
      } catch (err) {
        console.error("Failed to load dropdown options:", err);
        setError("Failed to load structures or positions.");
      } finally {
        setLoading(false);
      }
    };

    loadDropdownData();
  }, []);

  const handleChange = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="space-y-5">
      {/* Structure & Position Selection Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Structure */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Structure <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={value.structureId || ""}
              onChange={(e) =>
                handleChange(
                  "structureId",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
            >
              <option value="">
                {loading ? "Loading structures..." : "Select structure..."}
              </option>
              {structures.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} - {s.name || s.title} {s.code ? `(${s.code})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Position <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={value.positionId || ""}
              onChange={(e) =>
                handleChange(
                  "positionId",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
            >
              <option value="">
                {loading ? "Loading positions..." : "Select position..."}
              </option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  #{pos.id} - {pos.title || pos.name} {pos.code ? `(${pos.code})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Salary & Capacity Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Salary */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Salary <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={value.salary || ""}
              onChange={(e) =>
                handleChange(
                  "salary",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Capacity <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="number"
              min="1"
              value={value.capacity || ""}
              onChange={(e) =>
                handleChange(
                  "capacity",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Enter capacity count"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}