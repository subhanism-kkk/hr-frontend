import React, { useEffect, useState } from 'react';
import { contactApi } from '../../api/personSubServices';

export const PersonContactSection = ({ personId }) => {
  const [contacts, setContacts] = useState([]);

  const loadContacts = async () => {
    const response = await contactApi.getAll({ personId });
    setContacts(response.data.content);
  };

  useEffect(() => {
    if (personId) loadContacts();
  }, [personId]);

  const handleToggleStatus = async (contact) => {
    if (contact.status === 'ACTIVE') {
      await contactApi.deactivate(contact.id);
    } else {
      await contactApi.activate(contact.id);
    }
    loadContacts();
  };

  const handleDelete = async (id) => {
    await contactApi.softDelete(id);
    loadContacts();
  };

  return (
    <div className="section-container">
      <h3>Contacts</h3>
      <ul>
        {contacts.map((item) => (
          <li key={item.id}>
            <span>{item.contactValue} ({item.status})</span>
            <button onClick={() => handleToggleStatus(item)}>
              {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};