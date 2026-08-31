import React, { useState, useEffect } from 'react';
import { addressApi } from '../../api/personSubServices';

export const PersonAddressSection = ({ personId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    personId: personId || '',
    addressLine: '',
    city: '',
    country: '',
    zipCode: '',
    addressType: 'HOME'
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await addressApi.getAll({ personId });
      setAddresses(response.data.content || []);
    } catch (err) {
      setError('Failed to retrieve addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personId) {
      setFormData((prev) => ({ ...prev, personId }));
      fetchAddresses();
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
        await addressApi.update(editingId, formData);
      } else {
        await addressApi.create({ ...formData, personId: Number(personId) });
      }
      resetForm();
      fetchAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing address record.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      personId: item.personId || personId,
      addressLine: item.addressLine || '',
      city: item.city || '',
      country: item.country || '',
      zipCode: item.zipCode || '',
      addressType: item.addressType || 'HOME'
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, personId });
  };

  const handleToggleStatus = async (item) => {
    try {
      if (item.status === 'ACTIVE') {
        await addressApi.deactivate(item.id);
      } else {
        await addressApi.activate(item.id);
      }
      fetchAddresses();
    } catch (err) {
      setError('Failed to update address status.');
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm('Soft delete this address?')) return;
    try {
      await addressApi.softDelete(id);
      fetchAddresses();
    } catch (err) {
      setError('Failed to soft delete address.');
    }
  };

  const handleRestore = async (id) => {
    try {
      await addressApi.restore(id);
      fetchAddresses();
    } catch (err) {
      setError('Failed to restore address.');
    }
  };

  return (
    <div className="section-container">
      <h3>Address Management</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Address Line: </label>
          <input
            type="text"
            name="addressLine"
            value={formData.addressLine}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>City: </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Country: </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Zip Code: </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Address Type: </label>
          <select name="addressType" value={formData.addressType} onChange={handleInputChange}>
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="REGISTRATION">Registration</option>
          </select>
        </div>

        <button type="submit">{editingId ? 'Update' : 'Add'} Address</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {loading ? (
        <p>Loading addresses...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Address Line</th>
              <th>City</th>
              <th>Country</th>
              <th>Zip Code</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((item) => (
              <tr key={item.id} style={{ opacity: item.isDeleted ? 0.5 : 1 }}>
                <td>{item.id}</td>
                <td>{item.addressLine}</td>
                <td>{item.city}</td>
                <td>{item.country}</td>
                <td>{item.zipCode}</td>
                <td>{item.addressType}</td>
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