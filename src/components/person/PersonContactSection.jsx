import { useEffect, useState } from 'react';
import { Pencil, Plus, Power, Trash2 } from 'lucide-react';
import { contactApi, contactTypeApi } from '../../api/personSubServices';
import { getApiErrorMessage } from '../../api/axios';
import { contactSchema } from '../../schemas/personSchema';

const emptyForm = { contactTypeId: '', contactValue: '', isPrimary: false };

export function PersonContactSection({ personId }) {
  const [contacts, setContacts] = useState([]);
  const [contactTypes, setContactTypes] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await contactApi.getAll({ personId, page: 0, size: 100, sort: 'id,asc' });
      setContacts(response.data.content || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load contacts.'));
    } finally {
      setLoading(false);
    }
  };

  const loadTypes = async () => {
    try {
      const response = await contactTypeApi.getAll({ page: 0, size: 100, sort: 'id,asc' });
      setContactTypes(response.data.content || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load contact types.'));
    }
  };

  useEffect(() => {
    if (personId) {
      load();
      loadTypes();
    }
  }, [personId]);

  const reset = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const submit = async (event) => {
    event.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingId) {
        await contactApi.update(editingId, result.data);
      } else {
        await contactApi.create({ personId: Number(personId), ...result.data });
      }

      reset();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save contact.'));
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setFormData({
      contactTypeId: item.contactTypeId,
      contactValue: item.contactValue,
      isPrimary: Boolean(item.isPrimary),
    });
    setShowForm(true);
  };

  const toggleStatus = async (item) => {
    try {
      if (item.statusName === 'ACTIVE') await contactApi.deactivate(item.id);
      else await contactApi.activate(item.id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to change contact status.'));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Soft delete this contact?')) return;
    try {
      await contactApi.softDelete(id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete contact.'));
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>
          <p className="text-sm text-slate-500">Phone, email, or other contact records linked to this person.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={16} /> Add Contact
          </button>
        )}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {showForm && (
        <form onSubmit={submit} className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Contact Type</label>
            <select
              value={formData.contactTypeId}
              onChange={(e) => setFormData({ ...formData, contactTypeId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">Select contact type</option>
              {contactTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Contact Value</label>
            <input
              value={formData.contactValue}
              onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
              placeholder="Enter contact value"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
            />
            Primary contact
          </label>

          <div className="flex justify-end gap-2 md:col-span-2">
            <button type="button" onClick={reset} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-white">Cancel</button>
            <button disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No contacts found.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="divide-y divide-slate-100">
            {contacts.map((item) => {
              const type = contactTypes.find((x) => x.id === item.contactTypeId);
              return (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.contactValue}</span>
                      {item.isPrimary && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">Primary</span>}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{type?.name || `Contact type #${item.contactTypeId}`} · {item.statusName}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => edit(item)} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600"><Pencil size={14} /> Edit</button>
                    <button onClick={() => toggleStatus(item)} className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><Power size={14} /> {item.statusName === 'ACTIVE' ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => remove(item.id)} className="inline-flex items-center gap-1 text-xs font-medium text-red-600"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
