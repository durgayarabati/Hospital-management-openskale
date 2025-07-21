import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar, Guitar as Hospital, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardData {
  totalEarnings: number;
  totalConsultations: number;
  earningsByHospital: any[];
  associations: any[];
  recentAppointments: any[];
}

const DoctorDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For demo purposes, we'll simulate dashboard data
      const mockData: DashboardData = {
        totalEarnings: 156000,
        totalConsultations: 312,
        earningsByHospital: [
          { hospitalName: 'City General Hospital', earnings: 84000, consultations: 168 },
          { hospitalName: 'Metro Medical Center', earnings: 72000, consultations: 144 }
        ],
        associations: [
          {
            hospitalId: { name: 'City General Hospital', location: 'Downtown' },
            consultationFee: 1000,
            departments: ['Cardiology']
          },
          {
            hospitalId: { name: 'Metro Medical Center', location: 'Uptown' },
            consultationFee: 1200,
            departments: ['Cardiology', 'Internal Medicine']
          }
        ],
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your practice overview</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{dashboardData.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.totalConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Hospital className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Associated Hospitals</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.associations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. per Consultation</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Math.round(dashboardData.totalEarnings / dashboardData.totalConsultations || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Hospital</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.earningsByHospital}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hospitalName" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hospital Associations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Hospital Associations</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.associations.map((association, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{association.hospitalId.name}</h4>
                    <span className="text-sm font-medium text-green-600">₹{association.consultationFee}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{association.hospitalId.location}</p>
                  <div className="flex flex-wrap gap-1">
                    {association.departments.map((dept: string, deptIndex: number) => (
                      <span
                        key={deptIndex}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {dashboardData.earningsByHospital.find(h => h.hospitalName === association.hospitalId.name)?.consultations || 0} consultations
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

export default DoctorDashboard;