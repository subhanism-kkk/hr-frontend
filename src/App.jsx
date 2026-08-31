import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PersonsPage from './pages/PersonsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/persons" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/persons" element={<PersonsPage />} />
      </Routes>
    </BrowserRouter>
  );
}