import { useState } from 'react';
import { X, Check, RefreshCw, AlertCircle } from 'lucide-react';

import { orderTypeApi } from '../../api/orderTypeApi';
import { getApiErrorMessage } from '../../api/axios';
import { orderTypeSchema } from '../../schemas/lookupSchema';

export function OrderTypesForm({ initialData, onClose, onSuccess }) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = orderTypeSchema.safeParse(formData);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (isEditing) {
        await orderTypeApi.update(initialData.id, result.data);
      } else {
        await orderTypeApi.create(result.data);
      }

      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save order type.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 sm:p-6 transition-opacity">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Order Type' : 'Create Order Type'}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Define the name, code and description for this HR order type.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-800"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                maxLength={100}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Appointment"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                maxLength={10}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-mono text-slate-900 uppercase outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="APT"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              maxLength={255}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Describe what this order type is used for..."
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {isEditing ? 'Save Changes' : 'Create Order Type'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}