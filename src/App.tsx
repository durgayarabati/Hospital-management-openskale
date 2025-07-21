import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import HospitalDashboard from './components/Dashboard/HospitalDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import AppointmentBooking from './components/Booking/AppointmentBooking';
import ProtectedRoute from './components/ProtectedRoute';



// Configure axios base URL
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;


const AppContent: React.FC = () => {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'hospital_admin':
        return '/hospital-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'patient':
        return '/patient-dashboard';
      default:
        return '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Router>
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={!user ? <LoginForm /> : <Navigate to={getDashboardRoute()} />} />
          <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to={getDashboardRoute()} />} />
          
          <Route path="/hospital-dashboard" element={
            <ProtectedRoute allowedRoles={['hospital_admin']}>
              <HospitalDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/patient-dashboard" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/book-appointment" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <AppointmentBooking />
            </ProtectedRoute>
          } />
          
          <Route path="/my-appointments" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to={getDashboardRoute()} />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;