import { useState } from 'react';
import { X, Check, RefreshCw, AlertCircle } from 'lucide-react';

import { leaveTypeApi } from '../../api/leaveTypeApi';
import { getApiErrorMessage } from '../../api/axios';
import {
  leaveTypeCreateSchema,
  leaveTypeUpdateSchema,
} from '../../schemas/lookupSchema';

export function LeaveTypesForm({ initialData, onClose, onSuccess }) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = isEditing ? leaveTypeUpdateSchema : leaveTypeCreateSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (isEditing) {
        await leaveTypeApi.update(initialData.id, {
          name: result.data.name,
          description: result.data.description,
        });
      } else {
        await leaveTypeApi.create(result.data);
      }

      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save leave type.'));
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
              {isEditing ? 'Edit Leave Type' : 'Create Leave Type'}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {isEditing
                ? 'Update leave category details and policies.'
                : 'Define a new leave category for employee requests.'}
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
                Code {!isEditing && <span className="text-red-500">*</span>}
              </label>
              <input
                value={formData.code}
                disabled={isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                maxLength={50}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-mono text-slate-900 uppercase outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="ANNUAL"
              />
              {isEditing && (
                <p className="mt-1 text-[11px] text-slate-400">
                  Leave type code is immutable.
                </p>
              )}
            </div>

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
                placeholder="Annual Leave"
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
              maxLength={500}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Describe this leave category..."
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
                  {isEditing ? 'Save Changes' : 'Create Leave Type'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}