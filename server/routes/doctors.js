import express from 'express';
import DoctorAssociation from '../models/DoctorAssociation.js';
import TimeSlot from '../models/TimeSlot.js';
import Appointment from '../models/Appointment.js';
import Hospital from '../models/Hospital.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Associate doctor with hospital
router.post('/associate', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const { hospitalId, departments, consultationFee } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Check if departments exist in hospital
    const validDepartments = departments.filter(dept => 
      hospital.departments.some(hospitalDept => hospitalDept.name === dept)
    );

    if (validDepartments.length === 0) {
      return res.status(400).json({ message: 'No matching departments found in hospital' });
    }

    const association = new DoctorAssociation({
      doctorId: req.user._id,
      hospitalId,
      departments: validDepartments,
      consultationFee
    });

    await association.save();

    res.status(201).json({ message: 'Successfully associated with hospital', association });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already associated with this hospital' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add time slots
router.post('/timeslots', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const { hospitalId, date, timeSlots } = req.body;

    // Verify doctor is associated with hospital
    const association = await DoctorAssociation.findOne({
      doctorId: req.user._id,
      hospitalId,
      isActive: true
    });

    if (!association) {
      return res.status(403).json({ message: 'Not associated with this hospital' });
    }

    // Check for conflicts across all hospitals
    const existingSlots = await TimeSlot.find({
      doctorId: req.user._id,
      date: new Date(date)
    });

    for (const newSlot of timeSlots) {
      for (const existingSlot of existingSlots) {
        if (isTimeConflict(newSlot, existingSlot)) {
          return res.status(400).json({ 
            message: `Time slot conflict: ${newSlot.startTime}-${newSlot.endTime} conflicts with existing slot` 
          });
        }
      }
    }

    const slots = timeSlots.map(slot => ({
      doctorId: req.user._id,
      hospitalId,
      date: new Date(date),
      startTime: slot.startTime,
      endTime: slot.endTime
    }));

    await TimeSlot.insertMany(slots);

    res.status(201).json({ message: 'Time slots added successfully', slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctor dashboard
router.get('/dashboard', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('hospitalId', 'name location')
      .populate('patientId', 'name');

    const totalEarnings = appointments.reduce((sum, apt) => sum + apt.doctorEarning, 0);
    const totalConsultations = appointments.length;

    // Earnings by hospital
    const earningsByHospital = {};
    appointments.forEach(apt => {
      const hospitalId = apt.hospitalId._id.toString();
      if (!earningsByHospital[hospitalId]) {
        earningsByHospital[hospitalId] = {
          hospitalName: apt.hospitalId.name,
          earnings: 0,
          consultations: 0
        };
      }
      earningsByHospital[hospitalId].earnings += apt.doctorEarning;
      earningsByHospital[hospitalId].consultations += 1;
    });

    // Get associations
    const associations = await DoctorAssociation.find({ doctorId: req.user._id })
      .populate('hospitalId', 'name location');

    res.json({
      totalEarnings,
      totalConsultations,
      earningsByHospital: Object.values(earningsByHospital),
      associations,
      recentAppointments: appointments.slice(-10)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search doctors
router.get('/search', async (req, res) => {
  try {
    const { specialization, hospitalId, date } = req.query;
    
    let query = { role: 'doctor' };
    if (specialization) {
      query.specializations = { $in: [specialization] };
    }

    const doctors = await User.find(query).select('-password');
    
    // Filter by hospital association if specified
    let filteredDoctors = doctors;
    if (hospitalId) {
      const associations = await DoctorAssociation.find({ hospitalId, isActive: true });
      const associatedDoctorIds = associations.map(assoc => assoc.doctorId.toString());
      filteredDoctors = doctors.filter(doctor => associatedDoctorIds.includes(doctor._id.toString()));
    }

    // Get consultation fees for each doctor-hospital combination
    const doctorsWithFees = await Promise.all(filteredDoctors.map(async (doctor) => {
      const associations = await DoctorAssociation.find({ doctorId: doctor._id, isActive: true })
        .populate('hospitalId', 'name location');
      
      return {
        ...doctor.toObject(),
        hospitalAssociations: associations.map(assoc => ({
          hospital: assoc.hospitalId,
          consultationFee: assoc.consultationFee,
          departments: assoc.departments
        }))
      };
    }));

    res.json(doctorsWithFees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available time slots for a doctor at a hospital
router.get('/:doctorId/timeslots/:hospitalId', async (req, res) => {
  try {
    const { doctorId, hospitalId } = req.params;
    const { date } = req.query;

    const slots = await TimeSlot.find({
      doctorId,
      hospitalId,
      date: new Date(date),
      isBooked: false
    }).sort({ startTime: 1 });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

function isTimeConflict(slot1, slot2) {
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);

  return (start1 < end2 && start2 < end1);
}

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

export default router;