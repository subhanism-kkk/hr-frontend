import { User, Calendar, FileText } from "lucide-react";

export default function DismissalForm({ value = {}, onChange }) {
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

      {/* Dismissal Date */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Dismissal Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="date"
            value={value.dismissalDate || ""}
            onChange={(e) => handleChange("dismissalDate", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Description
        </label>
        <div className="relative">
          <FileText
            size={16}
            className="pointer-events-none absolute left-3 top-3 text-slate-400"
          />
          <textarea
            rows={3}
            maxLength={500}
            value={value.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Provide details or reasons regarding the dismissal..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}