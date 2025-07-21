import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Stethoscope } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  doctorId: {
    name: string;
    specializations: string[];
  };
  hospitalId: {
    name: string;
    location: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  consultationFee: number;
  status: string;
}

const PatientDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // For demo purposes, we'll simulate appointment data
      const mockAppointments: Appointment[] = [
        {
          _id: '1',
          doctorId: {
            name: 'Dr. Sarah Johnson',
            specializations: ['Cardiology']
          },
          hospitalId: {
            name: 'City General Hospital',
            location: 'Downtown Medical District'
          },
          date: '2024-01-15',
          startTime: '10:00',
          endTime: '10:30',
          consultationFee: 1000,
          status: 'completed'
        },
        {
          _id: '2',
          doctorId: {
            name: 'Dr. Michael Chen',
            specializations: ['Orthopedics']
          },
          hospitalId: {
            name: 'Metro Medical Center',
            location: 'Uptown Healthcare Complex'
          },
          date: '2024-01-20',
          startTime: '14:00',
          endTime: '14:30',
          consultationFee: 1200,
          status: 'scheduled'
        }
      ];

      setAppointments(mockAppointments);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalSpent = appointments.reduce((sum, apt) => sum + apt.consultationFee, 0);
  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled').length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Health Dashboard</h1>
          <p className="text-gray-600">Track your appointments and medical history</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Stethoscope className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
          </div>
          <div className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-medium text-gray-900">
                              {appointment.doctorId.name}
                            </h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {appointment.doctorId.specializations.map((spec, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {appointment.hospitalId.name}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(parseISO(appointment.date), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {appointment.startTime} - {appointment.endTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{appointment.consultationFee}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;