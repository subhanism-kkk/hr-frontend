import { useEffect, useState } from 'react';
import { Pencil, Plus, RotateCcw, Trash2, Power } from 'lucide-react';
import { addressApi } from '../../api/personSubServices';
import { getApiErrorMessage } from '../../api/axios';
import { addressSchema } from '../../schemas/personSchema';

export function PersonAddressSection({ personId }) {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({ address: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isAddressActive = (statusName) => {
    if (!statusName) return false;
    const normalized = String(statusName).trim().toUpperCase();
    return normalized === 'ACTIVE' || normalized === '1';
  };

  const isAddressDeleted = (statusName) => {
    if (!statusName) return false;
    return String(statusName).trim().toUpperCase() === 'DELETED';
  };

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await addressApi.getAll({ personId, page: 0, size: 100, sort: 'id,asc' });
      setAddresses(response.data.content || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load addresses.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personId) load();
  }, [personId]);

  const reset = () => {
    setEditingId(null);
    setFormData({ address: '' });
  };

  const submit = async (event) => {
    event.preventDefault();

    const result = addressSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingId) {
        await addressApi.update(editingId, result.data);
      } else {
        await addressApi.create({ personId: Number(personId), ...result.data });
      }

      reset();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save address.'));
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setFormData({ address: item.address || '' });
  };

  const toggleStatus = async (item) => {
    try {
      setError('');
      if (isAddressActive(item.statusName)) {
        await addressApi.deactivate(item.id);
      } else {
        await addressApi.activate(item.id);
      }
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to change address status.'));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Soft delete this address?')) return;

    try {
      setError('');
      await addressApi.softDelete(id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete address.'));
    }
  };

  const restore = async (id) => {
    try {
      setError('');
      await addressApi.restore(id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to restore address.'));
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Addresses</h2>
        <p className="text-sm text-slate-500">Manage addresses associated with this person.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ address: e.target.value })}
          maxLength={500}
          rows={3}
          placeholder="Enter the full address"
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <div className="mt-3 flex gap-2">
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
          >
            <Plus size={16} />
            {saving ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
          </button>

          {editingId && (
            <button type="button" onClick={reset} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-white cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No addresses found.
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((item) => {
            const active = isAddressActive(item.statusName);
            const deleted = isAddressDeleted(item.statusName);

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 ${
                  active ? 'border-slate-200' : 'border-amber-200 bg-amber-50/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="whitespace-pre-wrap text-sm text-slate-800">{item.address}</p>
                    <p className="mt-2 text-xs text-slate-400">Address #{item.id}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.statusName}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => edit(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <Pencil size={14} /> Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(item)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                      active ? 'text-amber-600 hover:text-amber-800' : 'text-emerald-600 hover:text-emerald-800'
                    }`}
                  >
                    <Power size={14} /> {active ? 'Deactivate' : 'Activate'}
                  </button>

                  {deleted ? (
                    <button
                      onClick={() => restore(item.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 cursor-pointer"
                    >
                      <RotateCcw size={14} /> Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => remove(item.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}