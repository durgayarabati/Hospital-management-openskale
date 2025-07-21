import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Guitar as Hospital, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardData {
  hospital: any;
  doctors: any[];
  totalConsultations: number;
  totalRevenue: number;
  revenuePerDoctor: any[];
  revenuePerDepartment: Record<string, number>;
  recentAppointments: any[];
}

const HospitalDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For demo purposes, we'll simulate dashboard data
      // In a real app, this would come from the API
      const mockData: DashboardData = {
        hospital: {
          name: 'City General Hospital',
          location: 'Downtown Medical District',
          departments: [
            { name: 'Cardiology' },
            { name: 'Orthopedics' },
            { name: 'Pediatrics' },
            { name: 'Neurology' }
          ]
        },
        doctors: [
          { name: 'Dr. Sarah Johnson', specializations: ['Cardiology'] },
          { name: 'Dr. Michael Chen', specializations: ['Orthopedics'] },
          { name: 'Dr. Emily Davis', specializations: ['Pediatrics'] }
        ],
        totalConsultations: 245,
        totalRevenue: 98000,
        revenuePerDoctor: [
          { doctorName: 'Dr. Sarah Johnson', revenue: 42000, consultations: 105 },
          { doctorName: 'Dr. Michael Chen', revenue: 35000, consultations: 87 },
          { doctorName: 'Dr. Emily Davis', revenue: 21000, consultations: 53 }
        ],
        revenuePerDepartment: {
          'Cardiology': 42000,
          'Orthopedics': 35000,
          'Pediatrics': 21000,
          'Neurology': 0
        },
        recentAppointments: []
      };

      setDashboardData(mockData);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  const departmentChartData = Object.entries(dashboardData.revenuePerDepartment).map(([name, revenue]) => ({
    name,
    revenue
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Dashboard</h1>
          <p className="text-gray-600">{dashboardData.hospital.name} - {dashboardData.hospital.location}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.doctors.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.totalConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{dashboardData.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. per Consultation</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Math.round(dashboardData.totalRevenue / dashboardData.totalConsultations || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Doctor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.revenuePerDoctor}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="doctorName" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {departmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Associated Doctors</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.doctors.map((doctor, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">
                    {doctor.specializations.join(', ')}
                  </p>
                  <div className="mt-2 text-sm text-blue-600">
                    {dashboardData.revenuePerDoctor.find(r => r.doctorName === doctor.name)?.consultations || 0} consultations
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;