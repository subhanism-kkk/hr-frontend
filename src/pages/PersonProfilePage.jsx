import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserRound } from 'lucide-react';
import { fetchPersonById } from '../api/personApi';
import { getApiErrorMessage } from '../api/axios';
import { PersonContactSection } from '../components/person/PersonContactSection';
import { PersonAddressSection } from '../components/person/PersonAddressSection';
import { PersonPersonalInfoSection } from '../components/person/PersonPersonalInfoSection';
import { PersonPhotoSection } from '../components/person/PersonPhotoSection';

const tabs = [
  ['personal', 'Personal Info'],
  ['contacts', 'Contacts'],
  ['addresses', 'Addresses'],
  ['photos', 'Photos'],
];

export default function PersonProfilePage() {
  const { personId } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        setPerson(await fetchPersonById(personId));
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load person.'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [personId]);

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading person profile...</div>;
  }

  if (error || !person) {
    return (
      <div className="p-8">
        <button onClick={() => navigate('/persons')} className="mb-5 text-sm text-indigo-600">
          ← Back to persons
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || 'Person not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      <button
        onClick={() => navigate('/persons')}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to persons
      </button>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <UserRound size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {person.firstName} {person.lastName}
            </h1>
            <p className="text-sm text-slate-500">Person #{person.id}</p>
          </div>

          <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {person.statusName}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex overflow-x-auto border-b border-slate-200 px-4">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'personal' && <PersonPersonalInfoSection personId={person.id} />}
          {activeTab === 'contacts' && <PersonContactSection personId={person.id} />}
          {activeTab === 'addresses' && <PersonAddressSection personId={person.id} />}
          {activeTab === 'photos' && <PersonPhotoSection personId={person.id} />}
        </div>
      </div>
    </div>
  );
}
