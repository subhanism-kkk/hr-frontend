import { useEffect, useState, useCallback } from 'react';
import {
  Pencil,
  Plus,
  Power,
  Trash2,
  Search,
  RotateCcw,
  X,
} from 'lucide-react';

import { positionApi } from '../api/positionApi';
import { statusApi } from '../api/statusApi';
import { getApiErrorMessage } from '../api/axios';
import { positionSchema } from '../schemas/positionSchema';

const PAGE_SIZE = 10;
const EMPTY_FORM = { name: '', description: '' };
const INITIAL_FILTERS = { search: '', name: '', description: '', status: '' };

const getStatusString = (position) => {
  const rawStatus =
    position?.statusName ||
    position?.statusCode ||
    position?.status?.code ||
    position?.status?.name ||
    position?.status ||
    '';
  return String(rawStatus).toUpperCase();
};

export default function PositionsPage() {
  const [positions, setPositions] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');

  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({
    page: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadStatuses = async () => {
    try {
      const response = await statusApi.getAll(0, 100);
      setStatuses(response.content || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load statuses.'));
    }
  };

  const loadPositions = useCallback(
    async (requestedPage = 0, activeFilters = INITIAL_FILTERS) => {
      try {
        setLoading(true);
        setError('');

        const response = await positionApi.getAll({
          search: activeFilters.search || undefined,
          name: activeFilters.name || undefined,
          description: activeFilters.description || undefined,
          status: activeFilters.status || undefined,
          page: requestedPage,
          size: PAGE_SIZE,
          sort: 'id,asc',
        });

        setPositions(response.content || []);
        setPagination({
          page: response.page ?? requestedPage,
          size: response.size ?? PAGE_SIZE,
          totalElements: response.totalElements ?? 0,
          totalPages: response.totalPages ?? 0,
          first: response.first ?? requestedPage === 0,
          last: response.last ?? true,
        });
        setPage(response.page ?? requestedPage);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load positions.'));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadStatuses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPositions(0, filters);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters, loadPositions]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalError('');
    setShowForm(true);
  };

  const openEdit = (position) => {
    setEditingId(position.id);
    setFormData({
      name: position.name || '',
      description: position.description || '',
    });
    setModalError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = positionSchema.safeParse(formData);

    if (!result.success) {
      setModalError(result.error.issues[0].message);
      return;
    }

    try {
      setSaving(true);
      setModalError('');

      if (editingId) {
        await positionApi.update(editingId, result.data);
      } else {
        await positionApi.create(result.data);
      }

      closeForm();
      await loadPositions(pagination.page, filters);
    } catch (err) {
      setModalError(getApiErrorMessage(err, 'Failed to save position.'));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (position) => {
    try {
      setError('');
      const status = getStatusString(position);

      if (status === 'ACTIVE') {
        await positionApi.deactivate(position.id);
      } else {
        await positionApi.activate(position.id);
      }

      await loadPositions(pagination.page, filters);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to change position status.'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to soft delete this position?')) return;

    try {
      setError('');
      await positionApi.softDelete(id);
      await loadPositions(pagination.page, filters);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete position.'));
    }
  };

  const handleRestore = async (id) => {
    try {
      setError('');
      await positionApi.restore(id);
      await loadPositions(pagination.page, filters);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to restore position.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Positions</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage organizational job positions.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={17} />
            Add Position
          </button>
        </div>

        {/* Page-level Error Banner */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Search size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search name or description..."
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />

            <input
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Filter by name..."
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />

            <input
              name="description"
              value={filters.description}
              onChange={handleFilterChange}
              placeholder="Filter by description..."
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All statuses</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.code}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={clearFilters}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">ID</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Position</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-10 text-center text-sm text-slate-400">
                      Loading positions...
                    </td>
                  </tr>
                ) : positions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-10 text-center text-sm text-slate-400">
                      No positions found.
                    </td>
                  </tr>
                ) : (
                  positions.map((position) => {
                    const status = getStatusString(position);
                    return (
                      <tr key={position.id} className="transition hover:bg-slate-50">
                        <td className="px-5 py-4 font-mono text-sm text-slate-500">#{position.id}</td>
                        <td className="px-5 py-4 font-medium text-slate-900">{position.name}</td>
                        <td className="max-w-md px-5 py-4 text-sm text-slate-500">{position.description}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700'
                                : status === 'DELETED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {position.statusName || status || 'INACTIVE'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-3">
                            {status === 'DELETED' ? (
                              <button
                                onClick={() => handleRestore(position.id)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-800"
                              >
                                <RotateCcw size={14} />
                                Restore
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => openEdit(position)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </button>

                                <button
                                  onClick={() => handleStatusToggle(position)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-800"
                                >
                                  <Power size={14} />
                                  {status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                </button>

                                <button
                                  onClick={() => handleDelete(position.id)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
            <span className="text-xs text-slate-500">
              {pagination.totalElements} total · Page {pagination.page + 1} of {pagination.totalPages || 1}
            </span>

            <div className="flex gap-2">
              <button
                disabled={pagination.first}
                onClick={() => loadPositions(pagination.page - 1, filters)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={pagination.last}
                onClick={() => loadPositions(pagination.page + 1, filters)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Position' : 'Create Position'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Enter the position information.</p>
              </div>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Specific Error Display */}
            {modalError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                  placeholder="Software Engineer"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-slate-400">Maximum 100 characters.</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={255}
                  rows={4}
                  placeholder="Describe the responsibilities of this position..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-slate-400">Maximum 255 characters.</p>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}