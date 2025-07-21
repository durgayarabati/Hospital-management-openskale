import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, MapPin, User } from 'lucide-react';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';

interface Doctor {
  _id: string;
  name: string;
  specializations: string[];
  experience: number;
  hospitalAssociations: {
    hospital: {
      _id: string;
      name: string;
      location: string;
    };
    consultationFee: number;
    departments: string[];
  }[];
}

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  date: string;
}

const AppointmentBooking: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [filters, setFilters] = useState({
    specialization: '',
    hospital: '',
    search: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      // For demo purposes, we'll simulate doctor data
      const mockDoctors: Doctor[] = [
        {
          _id: '1',
          name: 'Dr. Sarah Johnson',
          specializations: ['Cardiology'],
          experience: 12,
          hospitalAssociations: [
            {
              hospital: {
                _id: '1',
                name: 'City General Hospital',
                location: 'Downtown Medical District'
              },
              consultationFee: 1000,
              departments: ['Cardiology']
            }
          ]
        },
        {
          _id: '2',
          name: 'Dr. Michael Chen',
          specializations: ['Orthopedics'],
          experience: 8,
          hospitalAssociations: [
            {
              hospital: {
                _id: '2',
                name: 'Metro Medical Center',
                location: 'Uptown Healthcare Complex'
              },
              consultationFee: 1200,
              departments: ['Orthopedics']
            }
          ]
        },
        {
          _id: '3',
          name: 'Dr. Emily Davis',
          specializations: ['Pediatrics'],
          experience: 6,
          hospitalAssociations: [
            {
              hospital: {
                _id: '1',
                name: 'City General Hospital',
                location: 'Downtown Medical District'
              },
              consultationFee: 800,
              departments: ['Pediatrics']
            }
          ]
        }
      ];

      // Apply filters
      let filteredDoctors = mockDoctors;
      
      if (filters.specialization) {
        filteredDoctors = filteredDoctors.filter(doctor =>
          doctor.specializations.some(spec => 
            spec.toLowerCase().includes(filters.specialization.toLowerCase())
          )
        );
      }

      if (filters.search) {
        filteredDoctors = filteredDoctors.filter(doctor =>
          doctor.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setDoctors(filteredDoctors);
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  const fetchAvailableSlots = async (doctorId: string, hospitalId: string, date: string) => {
    try {
      // For demo purposes, we'll simulate time slots
      const mockSlots: TimeSlot[] = [
        { _id: '1', startTime: '09:00', endTime: '09:30', date },
        { _id: '2', startTime: '10:00', endTime: '10:30', date },
        { _id: '3', startTime: '11:00', endTime: '11:30', date },
        { _id: '4', startTime: '14:00', endTime: '14:30', date },
        { _id: '5', startTime: '15:00', endTime: '15:30', date },
      ];

      setAvailableSlots(mockSlots);
    } catch (error) {
      toast.error('Failed to load available slots');
    }
  };

  const handleDoctorSelect = (doctor: Doctor, hospitalAssociation: any) => {
    setSelectedDoctor(doctor);
    setSelectedHospital(hospitalAssociation);
    fetchAvailableSlots(doctor._id, hospitalAssociation.hospital._id, selectedDate);
  };

  const handleBookAppointment = async (slotId: string) => {
    try {
      // For demo purposes, we'll simulate booking
      toast.success('Appointment booked successfully!');
      setAvailableSlots(slots => slots.filter(slot => slot._id !== slotId));
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const specializations = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Dermatology'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Find and book appointments with our expert doctors</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Doctors
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by doctor name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={filters.specialization}
                onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={format(new Date(), 'yyyy-MM-dd')}
                max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (selectedDoctor && selectedHospital) {
                    fetchAvailableSlots(selectedDoctor._id, selectedHospital.hospital._id, e.target.value);
                  }
                }}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Available Doctors</h3>
              </div>
              <div className="p-6">
                {doctors.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No doctors found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div key={doctor._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{doctor.name}</h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {doctor.specializations.map((spec, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{doctor.experience} years experience</p>
                            
                            <div className="space-y-2">
                              {doctor.hospitalAssociations.map((association, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900">{association.hospital.name}</p>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {association.hospital.location}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">₹{association.consultationFee}</p>
                                    <button
                                      onClick={() => handleDoctorSelect(doctor, association)}
                                      className="mt-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
                                    >
                                      Select
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Available Time Slots</h3>
                {selectedDoctor && selectedHospital && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedDoctor.name} at {selectedHospital.hospital.name}
                  </p>
                )}
              </div>
              <div className="p-6">
                {!selectedDoctor || !selectedHospital ? (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a doctor to view available slots</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No slots available for selected date</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
                      >
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <button
                          onClick={() => handleBookAppointment(slot._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
                        >
                          Book
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;