import express from 'express';
import Appointment from '../models/Appointment.js';
import TimeSlot from '../models/TimeSlot.js';
import DoctorAssociation from '../models/DoctorAssociation.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Book appointment
router.post('/book', authenticate, authorize('patient'), async (req, res) => {
  try {
    const { timeSlotId } = req.body;

    const timeSlot = await TimeSlot.findById(timeSlotId);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    if (timeSlot.isBooked) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    // Get consultation fee
    const association = await DoctorAssociation.findOne({
      doctorId: timeSlot.doctorId,
      hospitalId: timeSlot.hospitalId
    });

    if (!association) {
      return res.status(404).json({ message: 'Doctor not associated with hospital' });
    }

    const consultationFee = association.consultationFee;
    const doctorEarning = Math.round(consultationFee * 0.6);
    const hospitalEarning = consultationFee - doctorEarning;

    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId: timeSlot.doctorId,
      hospitalId: timeSlot.hospitalId,
      timeSlotId: timeSlot._id,
      date: timeSlot.date,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      consultationFee,
      doctorEarning,
      hospitalEarning
    });

    await appointment.save();

    // Mark time slot as booked
    timeSlot.isBooked = true;
    timeSlot.appointmentId = appointment._id;
    await timeSlot.save();

    // Update hospital revenue
    await Hospital.findByIdAndUpdate(
      timeSlot.hospitalId,
      { $inc: { totalRevenue: hospitalEarning } }
    );

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name specializations')
      .populate('hospitalId', 'name location');

    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointment: populatedAppointment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get patient appointments
router.get('/patient', authenticate, authorize('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name specializations qualifications')
      .populate('hospitalId', 'name location')
      .sort({ date: -1, startTime: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get doctor appointments
router.get('/doctor', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('patientId', 'name gender')
      .populate('hospitalId', 'name location')
      .sort({ date: -1, startTime: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment status
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to update
    const canUpdate = appointment.doctorId.toString() === req.user._id.toString() ||
                     appointment.patientId.toString() === req.user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;