import express from 'express';
import Hospital from '../models/Hospital.js';
import DoctorAssociation from '../models/DoctorAssociation.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create hospital (Hospital Admin only)
router.post('/', authenticate, authorize('hospital_admin'), async (req, res) => {
  try {
    const { name, location, departments } = req.body;

    const hospital = new Hospital({
      name,
      location,
      adminId: req.user._id,
      departments: departments || []
    });

    await hospital.save();
    
    // Update user's hospitalId
    await User.findByIdAndUpdate(req.user._id, { hospitalId: hospital._id });

    res.status(201).json({ message: 'Hospital created successfully', hospital });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Hospital name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate('adminId', 'name email');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get hospital by ID
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('adminId', 'name email');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update hospital departments
router.put('/:id/departments', authenticate, authorize('hospital_admin'), async (req, res) => {
  try {
    const { departments } = req.body;
    const hospital = await Hospital.findOne({ _id: req.params.id, adminId: req.user._id });
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found or access denied' });
    }

    hospital.departments = departments;
    await hospital.save();

    res.json({ message: 'Departments updated successfully', hospital });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get hospital dashboard data
router.get('/:id/dashboard', authenticate, authorize('hospital_admin'), async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ _id: req.params.id, adminId: req.user._id });
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found or access denied' });
    }

    // Get associated doctors
    const doctorAssociations = await DoctorAssociation.find({ hospitalId: hospital._id })
      .populate('doctorId', 'name specializations experience');

    // Get appointments and revenue data
    const appointments = await Appointment.find({ hospitalId: hospital._id })
      .populate('doctorId', 'name')
      .populate('patientId', 'name');

    // Calculate statistics
    const totalConsultations = appointments.length;
    const totalRevenue = appointments.reduce((sum, apt) => sum + apt.hospitalEarning, 0);
    
    // Revenue per doctor
    const revenuePerDoctor = {};
    appointments.forEach(apt => {
      const doctorId = apt.doctorId._id.toString();
      if (!revenuePerDoctor[doctorId]) {
        revenuePerDoctor[doctorId] = {
          doctorName: apt.doctorId.name,
          revenue: 0,
          consultations: 0
        };
      }
      revenuePerDoctor[doctorId].revenue += apt.hospitalEarning;
      revenuePerDoctor[doctorId].consultations += 1;
    });

    // Revenue per department
    const revenuePerDepartment = {};
    hospital.departments.forEach(dept => {
      revenuePerDepartment[dept.name] = 0;
    });

    doctorAssociations.forEach(assoc => {
      const doctorAppointments = appointments.filter(apt => 
        apt.doctorId._id.toString() === assoc.doctorId._id.toString()
      );
      
      assoc.departments.forEach(dept => {
        if (revenuePerDepartment[dept] !== undefined) {
          revenuePerDepartment[dept] += doctorAppointments.reduce((sum, apt) => sum + apt.hospitalEarning, 0);
        }
      });
    });

    res.json({
      hospital,
      doctors: doctorAssociations.map(assoc => assoc.doctorId),
      totalConsultations,
      totalRevenue,
      revenuePerDoctor: Object.values(revenuePerDoctor),
      revenuePerDepartment,
      recentAppointments: appointments.slice(-10)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;