import { useEffect, useState } from 'react';
import { Pencil, Plus, Power, Star, Trash2 } from 'lucide-react';
import { photoApi } from '../../api/personSubServices';
import { getApiErrorMessage } from '../../api/axios';
import { photoSchema } from '../../schemas/personSchema';

const emptyForm = { filePath: '', isMain: false };

export function PersonPhotoSection({ personId }) {
  const [photos, setPhotos] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(null);
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

      const [allResult, mainResult] = await Promise.allSettled([
        photoApi.getAll({ personId, page: 0, size: 100, sort: 'id,asc' }),
        photoApi.getMainPhoto(personId),
      ]);

      if (allResult.status === 'fulfilled') {
        setPhotos(allResult.value.data.content || []);
      } else {
        throw allResult.reason;
      }

      setMainPhoto(mainResult.status === 'fulfilled' ? mainResult.value.data : null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load photos.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personId) load();
  }, [personId]);

  const reset = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const submit = async (event) => {
    event.preventDefault();

    const result = photoSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingId) {
        await photoApi.update(editingId, result.data);
      } else {
        await photoApi.create({ personId: Number(personId), ...result.data });
      }

      reset();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save photo.'));
    } finally {
      setSaving(false);
    }
  };

  const edit = (photo) => {
    setEditingId(photo.id);
    setFormData({
      filePath: photo.filePath || '',
      isMain: Boolean(photo.isMain),
    });
    setShowForm(true);
  };

  const setAsMain = async (id) => {
    try {
      setError('');
      await photoApi.setMainPhoto(id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to set main photo.'));
    }
  };

  const isPhotoActive = (statusName) => {
    if (!statusName) return false;
    const normalized = String(statusName).trim().toUpperCase();
    return normalized === 'ACTIVE' || normalized === '1';
  };

  const toggleStatus = async (photo) => {
    try {
      setError('');
      const isActive = isPhotoActive(photo.statusName);

      if (isActive) {
        await photoApi.deactivate(photo.id);
      } else {
        await photoApi.activate(photo.id);
      }

      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to change photo status.'));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Soft delete this photo?')) return;

    try {
      await photoApi.softDelete(id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete photo.'));
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Photos</h2>
          <p className="text-sm text-slate-500">Manage profile photo records and the main photo.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus size={16} /> Add Photo
          </button>
        )}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {mainPhoto && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
            <Star size={16} /> Main Photo
          </div>
          <p className="mt-2 break-all text-sm text-slate-700">{mainPhoto.filePath}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <label className="mb-1 block text-sm font-medium text-slate-700">File Path / URL</label>
          <input
            value={formData.filePath}
            onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
            maxLength={500}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            placeholder="https://..."
          />

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.isMain}
              onChange={(e) => setFormData({ ...formData, isMain: e.target.checked })}
            />
            Set as main photo
          </label>

          <div className="mt-4 flex gap-2">
            <button disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Photo'}
            </button>
            <button type="button" onClick={reset} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-white">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading photos...</p>
      ) : photos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No photos found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {photos.map((photo) => {
            const active = isPhotoActive(photo.statusName);

            return (
              <div key={photo.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-medium text-slate-800">{photo.filePath}</p>
                    <p className="mt-1 text-xs text-slate-400">Photo #{photo.id} · {photo.statusName}</p>
                  </div>
                  {photo.isMain && (
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">Main</span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-3">
                  {!photo.isMain && (
                    <button onClick={() => setAsMain(photo.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600">
                      <Star size={14} /> Set Main
                    </button>
                  )}
                  <button onClick={() => edit(photo)} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(photo)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      active ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    <Power size={14} /> {active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => remove(photo.id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}