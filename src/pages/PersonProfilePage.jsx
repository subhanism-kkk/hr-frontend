import React, { useState } from 'react';
import { useParams } from 'react{ReactRouter}'; // or your router library
import { PersonContactSection } from '../components/person/PersonContactSection';
import { PersonAddressSection } from '../components/person/PersonAddressSection';
import { PersonPersonalInfoSection } from '../components/person/PersonPersonalInfoSection';
import { PersonPhotoSection } from '../components/person/PersonPhotoSection';

export const PersonProfilePage = () => {
  const { personId } = useParams(); // Integer ID from route
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="profile-page">
      <h2>Person Profile #{personId}</h2>
      
      <div className="tabs">
        <button onClick={() => setActiveTab('personal')}>Personal Info</button>
        <button onClick={() => setActiveTab('contacts')}>Contacts</button>
        <button onClick={() => setActiveTab('addresses')}>Addresses</button>
        <button onClick={() => setActiveTab('photos')}>Photos</button>
      </div>

      <div className="tab-content">
        {activeTab === 'personal' && <PersonPersonalInfoSection personId={personId} />}
        {activeTab === 'contacts' && <PersonContactSection personId={personId} />}
        {activeTab === 'addresses' && <PersonAddressSection personId={personId} />}
        {activeTab === 'photos' && <PersonPhotoSection personId={personId} />}
      </div>
    </div>
  );
};