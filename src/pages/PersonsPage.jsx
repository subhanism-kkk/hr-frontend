import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Power, Search, Trash2, Archive } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personSchema } from '../schemas/personSchema';
import {
  activatePerson,
  createPerson,
  deactivatePerson,
  fetchPersons,
  softDeletePerson,
  updatePerson,
} from '../api/personApi';
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

export default function PersonsPage() {
  const [data, setData] = useState(emptyPage);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  // Helper to safely extract status string regardless of field naming convention
  const getStatus = (person) => {
    return (person?.statusName || person?.status || '').toString().toUpperCase();
  };

  const load = useCallback(
    async (page = 0, currentFilters = filters) => {
      try {
        setLoading(true);
        setApiError('');

        const response = await fetchPersons({
          page,
          size: 10,
          search: currentFilters.search || undefined,
          status: currentFilters.status || undefined,
        });

        setData(response);
      } catch (err) {
        setApiError(getApiErrorMessage(err, 'Failed to load persons.'));
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      load(0, filters);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters, load]);

  const submit = async (formData) => {
    try {
      setApiError('');

      if (editingPerson) {
        await updatePerson(editingPerson.id, formData);
      } else {
        await createPerson(formData);
      }

      setModalOpen(false);
      setEditingPerson(null);
      reset();
      await load(data.page, filters);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Failed to save person.'));
    }
  };

  const openCreate = () => {
    setEditingPerson(null);
    reset({ firstName: '', lastName: '' });
    setModalOpen(true);
  };

  const openEdit = (person) => {
    setEditingPerson(person);
    reset({
      firstName: person.firstName,
      lastName: person.lastName,
    });
    setModalOpen(true);
  };

  const toggleStatus = async (person) => {
    try {
      setApiError('');
      const status = getStatus(person);

      if (status === 'ACTIVE') {
        await deactivatePerson(person.id);
      } else {
        await activatePerson(person.id);
      }

      await load(data.page, filters);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Failed to change person status.'));
    }
  };

  const remove = async (person) => {
    if (!window.confirm(`Soft delete ${person.firstName} ${person.lastName}?`)) return;

    try {
      await softDeletePerson(person.id);
      await load(data.page, filters);
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'Failed to delete person.'));
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Persons</h1>
            <p className="mt-1 text-sm text-slate-500">Manage the people registered in the HR system.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/persons/deleted"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Archive size={17} /> View Archive
            </Link>

            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={17} /> Add Person
            </button>
          </div>
        </div>

        {apiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search by first or last name..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Person</th>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-500">Loading persons...</td></tr>
                ) : data.content.length === 0 ? (
                  <tr><td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-500">No persons found.</td></tr>
                ) : (
                  data.content.map((person) => {
                    const status = getStatus(person);
                    const isActive = status === 'ACTIVE';

                    return (
                      <tr key={person.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <Link to={`/persons/${person.id}`} className="font-medium text-slate-900 hover:text-indigo-600">
                            {person.firstName} {person.lastName}
                          </Link>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">#{person.id}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {status || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-4">
                            <button onClick={() => openEdit(person)} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                              <Pencil size={14} /> Edit
                            </button>
                            <button onClick={() => toggleStatus(person)} className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                              <Power size={14} /> {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => remove(person)} className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
            <span className="text-xs text-slate-500">
              {data.totalElements} total · Page {data.page + 1} of {Math.max(data.totalPages, 1)}
            </span>

            <div className="flex gap-2">
              <button
                disabled={data.first || loading}
                onClick={() => load(data.page - 1, filters)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={data.last || loading}
                onClick={() => load(data.page + 1, filters)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">
              {editingPerson ? 'Edit Person' : 'Create Person'}
            </h2>

            <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">First Name</label>
                <input
                  {...register('firstName')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Last Name</label>
                <input
                  {...register('lastName')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
                  Cancel
                </button>
                <button disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}