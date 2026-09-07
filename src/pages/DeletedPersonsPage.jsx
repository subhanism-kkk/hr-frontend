import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { fetchDeletedPersons, restorePerson } from '../api/personApi';
import { getApiErrorMessage } from '../api/axios';

const emptyPage = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

export default function DeletedPersonsPage() {
  const [data, setData] = useState(emptyPage);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const loadDeleted = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setApiError('');
      const response = await fetchDeletedPersons({ page, size: 10 });
      setData(response);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Failed to load deleted persons.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeleted(0);
  }, [loadDeleted]);

  const handleRestore = async (person) => {
    try {
      setApiError('');
      await restorePerson(person.id);
      // Reload current page or fallback if it becomes empty
      const targetPage = data.content.length === 1 && data.page > 0 ? data.page - 1 : data.page;
      await loadDeleted(targetPage);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Failed to restore person.'));
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2">
              <Link to="/persons" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                <ArrowLeft size={16} /> Back to Persons
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Deleted Persons Archive</h1>
            <p className="mt-1 text-sm text-slate-500">View and restore soft-deleted person profiles.</p>
          </div>
        </div>

        {apiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Person</th>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Deleted At</th>
                  <th className="px-5 py-3">Deleted By</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">Loading archive...</td></tr>
                ) : data.content.length === 0 ? (
                  <tr><td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">No deleted persons found.</td></tr>
                ) : (
                  data.content.map((person) => (
                    <tr key={person.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {person.firstName} {person.lastName}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">#{person.id}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {person.deletedAt ? new Date(person.deletedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">{person.deletedBy || 'System'}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleRestore(person)}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                        >
                          <RotateCcw size={14} /> Restore
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
            <span className="text-xs text-slate-500">
              {data.totalElements} total archived · Page {data.page + 1} of {Math.max(data.totalPages, 1)}
            </span>

            <div className="flex gap-2">
              <button
                disabled={data.first || loading}
                onClick={() => loadDeleted(data.page - 1)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={data.last || loading}
                onClick={() => loadDeleted(data.page + 1)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}