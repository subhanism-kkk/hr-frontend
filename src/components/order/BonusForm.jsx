import { useEffect, useState } from "react";
import {
  User,
  Gift,
  Calculator,
  Wallet,
  Calendar,
  FileText,
} from "lucide-react";
import { bonusTypeApi } from "../../api/bonusTypeApi";

export default function BonusForm({ value = {}, onChange }) {
  const [bonusTypes, setBonusTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBonusTypes = async () => {
      try {
        setLoading(true);
        setError("");
        // Call getActiveOptions() instead of getAll() to fetch only active types
        const response = await bonusTypeApi.getActiveOptions();
        setBonusTypes(response || []);
      } catch (err) {
        console.error("Failed to load bonus types:", err);
        setError("Failed to load bonus types.");
      } finally {
        setLoading(false);
      }
    };

    loadBonusTypes();
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

      {/* Bonus Type Dropdown */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Bonus Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Gift
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={value.bonusTypeId || ""}
            onChange={(e) =>
              handleChange(
                "bonusTypeId",
                e.target.value ? Number(e.target.value) : ""
              )
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
          >
            <option value="">
              {loading ? "Loading bonus types..." : "Select bonus type..."}
            </option>
            {bonusTypes.map((type) => (
              <option key={type.id} value={type.id}>
                #{type.id} - {type.name} {type.code ? `(${type.code})` : ""}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>

      {/* Calculation Type & Amount Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Calculation Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calculator
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={value.calculationType || ""}
              onChange={(e) => handleChange("calculationType", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select calculation type...</option>
              <option value="FIXED">FIXED</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Wallet
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={value.amount ?? ""}
              onChange={(e) =>
                handleChange(
                  "amount",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="Enter amount"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
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
            placeholder="Describe what conditions apply for this bonus..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}