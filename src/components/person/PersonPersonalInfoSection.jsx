import React, { useState, useEffect } from 'react';
import { personalInfoApi } from '../../api/personSubServices';

export const PersonPersonalInfoSection = ({ personId }) => {
  const [personalInfoList, setPersonalInfoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    personId: personId || '',
    finCode: '',
    gender: 'MALE',
    birthDate: '',
    maritalStatus: 'SINGLE',
    citizenship: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchPersonalInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await personalInfoApi.getAll({ personId });
      setPersonalInfoList(response.data.content || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch personal information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personId) {
      setFormData((prev) => ({ ...prev, personId }));
      fetchPersonalInfo();
    }
  }, [personId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await personalInfoApi.update(editingId, formData);
      } else {
        await personalInfoApi.create({ ...formData, personId: Number(personId) });
      }
      resetForm();
      fetchPersonalInfo();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Check FIN code or duplicate details.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      personId: item.personId || personId,
      finCode: item.finCode || '',
      gender: item.gender || 'MALE',
      birthDate: item.birthDate || '',
      maritalStatus: item.maritalStatus || 'SINGLE',
      citizenship: item.citizenship || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, personId });
  };

  const handleToggleStatus = async (item) => {
    try {
      if (item.status === 'ACTIVE') {
        await personalInfoApi.deactivate(item.id);
      } else {
        await personalInfoApi.activate(item.id);
      }
      fetchPersonalInfo();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm('Are you sure you want to soft-delete this record?')) return;
    try {
      await personalInfoApi.softDelete(id);
      fetchPersonalInfo();
    } catch (err) {
      setError('Failed to delete record.');
    }
  };

  const handleRestore = async (id) => {
    try {
      await personalInfoApi.restore(id);
      fetchPersonalInfo();
    } catch (err) {
      setError('Failed to restore record.');
    }
  };

  return (
    <div className="section-container">
      <h3>Personal Identification & Details</h3>
      {error && <div className="error-banner" style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>FIN Code: </label>
          <input
            type="text"
            name="finCode"
            value={formData.finCode}
            onChange={handleInputChange}
            required
            maxLength={7}
          />
        </div>

        <div>
          <label>Gender: </label>
          <select name="gender" value={formData.gender} onChange={handleInputChange}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <label>Birth Date: </label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Marital Status: </label>
          <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}>
            <option value="SINGLE">Single</option>
            <option value="MARRIED">Married</option>
            <option value="DIVORCED">Divorced</option>
            <option value="WIDOWED">Widowed</option>
          </select>
        </div>

        <div>
          <label>Citizenship: </label>
          <input
            type="text"
            name="citizenship"
            value={formData.citizenship}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">{editingId ? 'Update' : 'Save'} Personal Info</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {loading ? (
        <p>Loading details...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', textWrap: 'nowrap' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>FIN Code</th>
              <th>Gender</th>
              <th>Birth Date</th>
              <th>Marital Status</th>
              <th>Citizenship</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {personalInfoList.map((item) => (
              <tr key={item.id} style={{ opacity: item.isDeleted ? 0.5 : 1 }}>
                <td>{item.id}</td>
                <td>{item.finCode}</td>
                <td>{item.gender}</td>
                <td>{item.birthDate}</td>
                <td>{item.maritalStatus}</td>
                <td>{item.citizenship}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleToggleStatus(item)}>
                    {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                  {!item.isDeleted ? (
                    <button onClick={() => handleSoftDelete(item.id)}>Soft Delete</button>
                  ) : (
                    <button onClick={() => handleRestore(item.id)}>Restore</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};