import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Abonnes from './pages/Abonnes';
import Abonnements from './pages/Abonnements';
import Etudes from './pages/Etudes';
import MouvementsCompteur from './pages/MouvementsCompteur';
import Agences from './pages/Agences';
import Tournees from './pages/Tournees';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analytics"   element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/abonnes"     element={<ProtectedRoute><Abonnes /></ProtectedRoute>} />
          <Route path="/abonnements" element={<ProtectedRoute><Abonnements /></ProtectedRoute>} />
          <Route path="/etudes"      element={<ProtectedRoute><Etudes /></ProtectedRoute>} />
          <Route path="/mouvements"  element={<ProtectedRoute><MouvementsCompteur /></ProtectedRoute>} />
          <Route path="/agences"     element={<ProtectedRoute><Agences /></ProtectedRoute>} />
          <Route path="/tournees"    element={<ProtectedRoute><Tournees /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
