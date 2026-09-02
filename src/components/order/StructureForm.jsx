import { useEffect, useState } from "react";
import { Building2, FolderTree, Lock } from "lucide-react";
import { getStructures } from "../../api/structureApi";

export default function StructureForm({ value = {}, onChange }) {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStructures = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getStructures({ page: 0, size: 100 });
        setStructures(response?.content || response || []);
      } catch (err) {
        console.error("Failed to load parent structures:", err);
        setError("Failed to load structures.");
      } finally {
        setLoading(false);
      }
    };

    loadStructures();
  }, []);

  const handleChange = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="space-y-5">
      {/* Structure Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Structure Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            maxLength={150}
            value={value.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter structure name"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Parent Structure Dropdown */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Parent Structure <span className="text-xs text-slate-400">(Optional)</span>
        </label>
        <div className="relative">
          <FolderTree
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={value.parentStructureId || ""}
            onChange={(e) =>
              handleChange(
                "parentStructureId",
                e.target.value ? Number(e.target.value) : ""
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
          >
            <option value="">
              {loading
                ? "Loading structures..."
                : "None (Top Level Structure)"}
            </option>
            {structures.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} - {s.name || s.title} {s.code ? `(${s.code})` : ""}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>

      {/* Is Closed Control */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Lock size={18} />
          </div>
          <div>
            <label
              htmlFor="isClosed"
              className="block cursor-pointer text-sm font-medium text-slate-900"
            >
              Closed Structure
            </label>
            <p className="text-xs text-slate-500">
              Mark this structure as closed to prevent new assignments
            </p>
          </div>
        </div>
        <input
          id="isClosed"
          type="checkbox"
          checked={!!value.isClosed}
          onChange={(e) => handleChange("isClosed", e.target.checked)}
          className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}