import { useEffect, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { personalInfoApi } from '../../api/personSubServices';
import { getApiErrorMessage } from '../../api/axios';
import { personalInfoSchema } from '../../schemas/personSchema';

const emptyForm = { gender: 'MALE', dateOfBirth: '', finCode: '' };

export function PersonPersonalInfoSection({ personId }) {
  const [info, setInfo] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await personalInfoApi.getAll({
        personId,
        page: 0,
        size: 1,
        sort: 'id,asc',
      });
      const record = response.data.content?.[0] || null;
      setInfo(record);

      if (record) {
        setFormData({
          gender: record.gender,
          dateOfBirth: record.dateOfBirth,
          finCode: record.finCode,
        });
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load personal information.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personId) load();
  }, [personId]);

  const submit = async (event) => {
    event.preventDefault();

    const result = personalInfoSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (info) {
        await personalInfoApi.update(info.id, {
          gender: result.data.gender,
          dateOfBirth: result.data.dateOfBirth,
        });
      } else {
        await personalInfoApi.create({
          personId: Number(personId),
          gender: result.data.gender,
          dateOfBirth: result.data.dateOfBirth,
          finCode: result.data.finCode,
        });
      }

      setEditing(false);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save personal information.'));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = () => {
    setEditing(true);
    setError('');
  };

  if (loading) return <p className="text-sm text-slate-500">Loading personal information...</p>;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500">Identification and demographic information stored for this person.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {!info || editing ? (
        <form onSubmit={submit} className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">FIN Code</label>
            <input
              value={formData.finCode}
              disabled={Boolean(info)}
              onChange={(e) => setFormData({ ...formData, finCode: e.target.value.toUpperCase() })}
              maxLength={7}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm uppercase disabled:bg-slate-100"
              placeholder="ABC1234"
            />
            {!info && <p className="mt-1 text-xs text-slate-400">Exactly 7 uppercase letters or digits.</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />
          </div>

          <div className="flex items-end gap-2">
            <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              <Plus size={16} />
              {saving ? 'Saving...' : info ? 'Save Changes' : 'Add Personal Info'}
            </button>

            {info && (
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg px-4 py-2.5 text-sm text-slate-600 hover:bg-white">
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-slate-200">
          <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div><p className="text-xs text-slate-400">FIN Code</p><p className="mt-1 font-medium text-slate-900">{info.finCode}</p></div>
            <div><p className="text-xs text-slate-400">Gender</p><p className="mt-1 font-medium text-slate-900">{info.gender}</p></div>
            <div><p className="text-xs text-slate-400">Date of Birth</p><p className="mt-1 font-medium text-slate-900">{info.dateOfBirth}</p></div>
            <div><p className="text-xs text-slate-400">Status</p><p className="mt-1 font-medium text-slate-900">{info.statusName}</p></div>
          </div>

          <div className="flex gap-4 border-t border-slate-100 px-5 py-3">
            <button onClick={startEdit} className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600"><Pencil size={14} /> Edit</button>
          </div>
        </div>
      )}

      {!info && !editing && (
        <div className="text-sm text-slate-500">No personal information has been added yet.</div>
      )}
    </section>
  );
}