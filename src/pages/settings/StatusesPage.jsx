import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, RefreshCw, X } from 'lucide-react';

import { statusApi } from '../../api/statusApi';
import { getApiErrorMessage } from '../../api/axios';
import { StatusesForm } from '../../components/settings/StatusesForm';

export default function StatusesPage() {
  const [statuses, setStatuses] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const loadStatuses = async (requestedPage = page) => {
    try {
      setLoading(true);
      setError('');

      const response = await statusApi.getAll(requestedPage, pageSize);

      setStatuses(response.content || []);
      setPagination({
        page: response.page ?? requestedPage,
        size: response.size ?? pageSize,
        totalElements: response.totalElements ?? 0,
        totalPages: response.totalPages ?? 0,
        first: response.first ?? requestedPage === 0,
        last: response.last ?? true,
      });

      setPage(response.page ?? requestedPage);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load statuses.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatuses(0);
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleOpenEdit = (status) => {
    setEditingItem(status);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    loadStatuses(page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to soft delete this status?')) {
      return;
    }

    try {
      setError('');
      await statusApi.softDelete(id);
      await loadStatuses(page);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete status.'));
    }
  };

  return (
    <div className="mx-auto max-w-7xl pt-8 pb-12 px-6 sm:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Statuses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage system statuses and their unique codes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 shrink-0"
        >
          <Plus size={18} />
          Add Status
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

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-sm text-slate-500">
            <RefreshCw size={24} className="mx-auto mb-3 animate-spin text-indigo-600" />
            Loading statuses...
          </div>
        ) : statuses.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-500">
            No statuses found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {statuses.map((status) => (
                <tr
                  key={status.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    #{status.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {status.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                      {status.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {status.createdAt
                      ? new Date(status.createdAt).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(status)}
                        title="Edit"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(status.id)}
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
          Showing <strong className="text-slate-700">{statuses.length}</strong> of{' '}
          <strong className="text-slate-700">{pagination.totalElements}</strong> entries
        </span>
        <div className="flex gap-2">
          <button
            disabled={pagination.first}
            onClick={() => loadStatuses(pagination.page - 1)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 shadow-xs"
          >
            Previous
          </button>
          <button
            disabled={pagination.last}
            onClick={() => loadStatuses(pagination.page + 1)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 shadow-xs"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Form Overlay */}
      {showForm && (
        <StatusesForm
          initialData={editingItem}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}