import React, { useState, useEffect } from 'react';
import { photoApi } from '../../api/personSubServices';

export const PersonPhotoSection = ({ personId }) => {
  const [photos, setPhotos] = useState([]);
  const [mainPhoto, setMainPhotoState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    personId: personId || '',
    filePath: '',
    isMain: false
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchPhotos = async () => {
    setLoading(true);
    setError('');
    try {
      const [allRes, mainRes] = await Promise.allSettled([
        photoApi.getAll({ personId }),
        photoApi.getMainPhoto(personId)
      ]);

      if (allRes.status === 'fulfilled') {
        setPhotos(allRes.value.data.content || []);
      }
      if (mainRes.status === 'fulfilled') {
        setMainPhotoState(mainRes.value.data);
      } else {
        setMainPhotoState(null);
      }
    } catch (err) {
      setError('Error loading photos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personId) {
      setFormData((prev) => ({ ...prev, personId }));
      fetchPhotos();
    }
  }, [personId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await photoApi.update(editingId, formData);
      } else {
        await photoApi.create({ ...formData, personId: Number(personId) });
      }
      resetForm();
      fetchPhotos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save photo record.');
    }
  };

  const handleSetMain = async (photoId) => {
    try {
      await photoApi.setMainPhoto(photoId);
      fetchPhotos();
    } catch (err) {
      setError('Failed to set main photo.');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      if (item.status === 'ACTIVE') {
        await photoApi.deactivate(item.id);
      } else {
        await photoApi.activate(item.id);
      }
      fetchPhotos();
    } catch (err) {
      setError('Failed to update photo status.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      personId: item.personId || personId,
      filePath: item.filePath || '',
      isMain: item.isMain || false
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, personId });
  };

  return (
    <div className="section-container">
      <h3>Person Photos</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {mainPhoto && (
        <div style={{ marginBottom: '20px', border: '2px solid green', padding: '10px' }}>
          <h4>Primary Main Photo</h4>
          <p><strong>Path/URL:</strong> {mainPhoto.filePath}</p>
          <p><strong>Status:</strong> {mainPhoto.status}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>File Path / Image URL: </label>
          <input
            type="text"
            name="filePath"
            value={formData.filePath}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isMain"
              checked={formData.isMain}
              onChange={handleInputChange}
            />
            Set as Main Photo
          </label>
        </div>

        <button type="submit">{editingId ? 'Update' : 'Add'} Photo Record</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {loading ? (
        <p>Loading photos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {photos.map((photo) => (
            <div key={photo.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
              <p><strong>ID:</strong> {photo.id}</p>
              <p style={{ wordBreak: 'break-all' }}><strong>Path:</strong> {photo.filePath}</p>
              <p><strong>Main:</strong> {photo.isMain ? 'Yes ✅' : 'No'}</p>
              <p><strong>Status:</strong> {photo.status}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {!photo.isMain && (
                  <button onClick={() => handleSetMain(photo.id)}>Set as Main</button>
                )}
                <button onClick={() => handleEdit(photo)}>Edit</button>
                <button onClick={() => handleToggleStatus(photo)}>
                  {photo.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};