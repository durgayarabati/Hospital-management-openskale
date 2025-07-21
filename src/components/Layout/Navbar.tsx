import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Guitar as Hospital, LogOut, User, Calendar, BarChart3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'hospital_admin':
        return '/hospital-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'patient':
        return '/patient-dashboard';
      default:
        return '/';
    }
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case 'hospital_admin':
        return [
          { to: '/hospital-dashboard', icon: BarChart3, label: 'Dashboard' },
          { to: '/manage-hospital', icon: Hospital, label: 'Manage Hospital' }
        ];
      case 'doctor':
        return [
          { to: '/doctor-dashboard', icon: BarChart3, label: 'Dashboard' },
          { to: '/manage-schedule', icon: Calendar, label: 'Schedule' },
          { to: '/doctor-associations', icon: Hospital, label: 'Hospitals' }
        ];
      case 'patient':
        return [
          { to: '/patient-dashboard', icon: User, label: 'My Profile' },
          { to: '/book-appointment', icon: Calendar, label: 'Book Appointment' },
          { to: '/my-appointments', icon: BarChart3, label: 'My Appointments' }
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={getDashboardLink()} className="flex items-center space-x-2">
            <Hospital className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">MediCare</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              {getNavLinks().map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{label}</span>
                </Link>
              ))}
              
              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  {user.name} ({user.role.replace('_', ' ')})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;