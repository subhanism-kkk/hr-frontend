import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personSchema } from '../schemas/personSchema';
import {
  fetchPersons,
  createPerson,
  updatePerson,
  activatePerson,
  deactivatePerson,
  softDeletePerson,
  restorePerson,
} from '../api/personApi';

export default function PersonsPage() {
  const [personsData, setPersonsData] = useState({ content: [], pageNumber: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  const loadPersons = async (page = 0) => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await fetchPersons(page, 10);
      setPersonsData(data);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to load records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersons(0);
  }, []);

  const openCreateModal = () => {
    setEditingPerson(null);
    reset({ firstName: '', lastName: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (person) => {
    setEditingPerson(person);
    setValue('firstName', person.firstName);
    setValue('lastName', person.lastName);
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    setApiError(null);
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, formData);
      } else {
        await createPerson(formData);
      }
      setIsModalOpen(false);
      reset();
      loadPersons(personsData.pageNumber);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleStatusToggle = async (person) => {
    try {
      if (person.statusName === 'ACTIVE') {
        await deactivatePerson(person.id);
      } else {
        await activatePerson(person.id);
      }
      loadPersons(personsData.pageNumber);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change status.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to soft delete this person?')) return;
    try {
      await softDeletePerson(id);
      loadPersons(personsData.pageNumber);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restorePerson(id);
      loadPersons(personsData.pageNumber);
    } catch (err) {
      alert(err.response?.data?.message || 'Restore failed.');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Person Management</h1>
          <p className="text-sm text-gray-500">Manage, filter, and modify HR person records</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
        >
          + Add Person
        </button>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {apiError}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">First Name</th>
              <th className="py-3 px-4">Last Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">Loading records...</td>
              </tr>
            ) : personsData.content?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">No records found.</td>
              </tr>
            ) : (
              personsData.content?.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-mono text-gray-500">#{person.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{person.firstName}</td>
                  <td className="py-3 px-4">{person.lastName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        person.statusName === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {person.statusName || 'INACTIVE'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleStatusToggle(person)}
                      className="text-xs font-medium text-amber-600 hover:underline"
                    >
                      {person.statusName === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => openEditModal(person)}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <span>
            Page {personsData.pageNumber + 1} of {personsData.totalPages || 1}
          </span>
          <div className="space-x-2">
            <button
              disabled={personsData.pageNumber === 0}
              onClick={() => loadPersons(personsData.pageNumber - 1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={personsData.pageNumber + 1 >= personsData.totalPages}
              onClick={() => loadPersons(personsData.pageNumber + 1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">
              {editingPerson ? 'Edit Person Record' : 'Create New Person'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">First Name</label>
                <input
                  {...register('firstName')}
                  className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                    errors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
                <input
                  {...register('lastName')}
                  className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                    errors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}