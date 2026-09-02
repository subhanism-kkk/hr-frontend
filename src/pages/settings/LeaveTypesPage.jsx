import { useEffect, useState, useCallback } from 'react';
import { Pencil, Plus, Trash2, Search, RefreshCw, X } from 'lucide-react';

import { leaveTypeApi } from '../../api/leaveTypeApi';
import { getApiErrorMessage } from '../../api/axios';
import { LeaveTypesForm } from '../../components/settings/LeaveTypesForm';

export function LeaveTypesPage() {
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

  // Automatically trigger search 300ms after typing stops
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

      const response = await leaveTypeApi.getAll({
        page,
        size: pageSize,
        sort: 'id,asc',
        keyword: activeSearch.trim() || undefined,
        search: activeSearch.trim() || undefined,
      });

      setItems(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load leave types.'));
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

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave type?')) {
      return;
    }

    try {
      setError('');
      await leaveTypeApi.softDelete(id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete leave type.'));
    }
  };

  return (
    <div className="mx-auto max-w-7xl pt-8 pb-12 px-6 sm:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Leave Types
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage system-wide leave categories and specifications.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 shrink-0"
        >
          <Plus size={18} />
          Add Leave Type
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
          placeholder="Search leave types..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-sm text-slate-500">
            <RefreshCw size={24} className="mx-auto mb-3 animate-spin text-indigo-600" />
            Loading leave types...
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-500">
            No leave types found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    #{item.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                      {item.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="max-w-lg px-6 py-4 text-slate-500 truncate">
                    {item.description || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Edit"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        title="Delete"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
        <LeaveTypesForm
          initialData={editingItem}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}