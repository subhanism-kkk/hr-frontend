import { useEffect, useState } from "react";
import { User, Briefcase, TrendingUp, Calendar } from "lucide-react";
import { positionApi } from "../../api/positionApi";

export default function PromotionForm({ value = {}, onChange }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPositions = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await positionApi.getAll({
          page: 0,
          size: 100,
        });
        setPositions(response?.content || response || []);
      } catch (err) {
        console.error("Failed to load positions:", err);
        setError("Failed to load positions.");
      } finally {
        setLoading(false);
      }
    };

    loadPositions();
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

      {/* Position Selection Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Old Position */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Old Position <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={value.oldPositionId || ""}
              onChange={(e) =>
                handleChange(
                  "oldPositionId",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
            >
              <option value="">
                {loading ? "Loading positions..." : "Select old position..."}
              </option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  #{pos.id} - {pos.title || pos.name} {pos.code ? `(${pos.code})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* New Position */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            New Position <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <TrendingUp
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={value.newPositionId || ""}
              onChange={(e) =>
                handleChange(
                  "newPositionId",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
            >
              <option value="">
                {loading ? "Loading positions..." : "Select new position..."}
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
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

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
            value={value.effectiveDate || ""}
            onChange={(e) => handleChange("effectiveDate", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}