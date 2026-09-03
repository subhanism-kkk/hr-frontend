import { useEffect, useState, useCallback } from 'react';
import { Pencil, Plus, Trash2, Search, RefreshCw, X, Power } from 'lucide-react';

import { bonusTypeApi } from '../../api/bonusTypeApi';
import { getApiErrorMessage } from '../../api/axios';
import { BonusTypesForm } from '../../components/settings/BonusTypesForm';

export function BonusTypesPage() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract status string safely across convention types
  const getStatus = (item) => {
    return (item?.statusName || item?.status || '').toString().toUpperCase();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      setActiveSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await bonusTypeApi.getAll({
        page,
        size: pageSize,
        sort: 'id,asc',
        name: activeSearch.trim() || undefined,
      });

      setItems(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load bonus types.'));
    } finally {
      setLoading(false);
    }
  }, [page, activeSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    load();
  };

  // Status Toggle matching PersonsPage logic
  const toggleStatus = async (item) => {
    try {
      setError('');
      const status = getStatus(item);
      const isActive = status === 'ACTIVE' || item.statusId === 1;

      if (isActive) {
        await bonusTypeApi.deactivate(item.id);
      } else {
        await bonusTypeApi.activate(item.id);
      }

      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to change bonus type status.'));
    }
  };

  // Only the Delete button performs a soft-delete
  const remove = async (item) => {
    if (!window.confirm(`Delete bonus type "${item.name}"?`)) return;

    try {
      setError('');
      await bonusTypeApi.softDelete(item.id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete bonus type.'));
    }
  };

  return (
    <div className="mx-auto max-w-7xl pt-8 pb-12 px-6 sm:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bonus Types
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage employee bonus and incentive categories in the system.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 shrink-0"
        >
          <Plus size={18} />
          Add Bonus Type
        </button>
      </div>

      {/* Global Error Alert */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-xs">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Auto-Search Input */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bonus types..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-sm text-slate-500">
            <RefreshCw size={24} className="mx-auto mb-3 animate-spin text-indigo-600" />
            Loading bonus types...
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-500">
            No bonus types found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const status = getStatus(item);
                const isActive = status === 'ACTIVE' || (!status && !item.isDeleted);

                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="max-w-lg px-6 py-4 text-slate-500 truncate">
                      {item.description || <span className="text-slate-300">—</span>}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          <Pencil size={14} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleStatus(item)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700"
                        >
                          <Power size={14} />
                          <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => remove(item)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-sm text-slate-500 pt-2">
        <span>
          Showing <strong className="text-slate-700">{items.length}</strong> of{' '}
          <strong className="text-slate-700">{totalElements}</strong> entries
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 shadow-xs"
          >
            Previous
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 shadow-xs"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Form Overlay */}
      {showForm && (
        <BonusTypesForm
          initialData={editingItem}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}