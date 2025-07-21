# Hospital & Appointment Management System

A comprehensive MERN stack application for managing hospitals, doctors, patients, and appointments with revenue tracking and analytics.

## Features

### User Roles & Authentication
- **Hospital Admin**: Manage hospitals and departments
- **Doctor**: Associate with hospitals, manage schedules, track earnings
- **Patient**: Book appointments, view medical history

### Core Functionality
- Multi-role registration and authentication
- Hospital and department management
- Doctor-hospital associations with specialization matching
- Conflict-free appointment scheduling
- Revenue tracking with 60/40 split (Doctor/Hospital)
- Comprehensive dashboards for all user types
- Advanced search and filtering

### Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Charts**: Recharts
- **UI Components**: Lucide React icons

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Update the values in .env file
   ```

4. Start MongoDB (ensure MongoDB is running locally)

5. Start the backend server:
   ```bash
   npm run server
   ```

6. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Database Schema

### Users Collection
- Hospital admins, doctors, and patients
- Role-based fields (qualifications, specializations, patient info)

### Hospitals Collection
- Hospital information and departments
- Revenue tracking

### Doctor Associations Collection
- Doctor-hospital relationships
- Department mappings and consultation fees

### Time Slots Collection
- Doctor availability with conflict prevention
- Booking status tracking

### Appointments Collection
- Complete appointment records
- Revenue distribution tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Hospitals
- `POST /api/hospitals` - Create hospital (Admin only)
- `GET /api/hospitals` - List all hospitals
- `GET /api/hospitals/:id/dashboard` - Hospital dashboard data

### Doctors
- `POST /api/doctors/associate` - Associate with hospital
- `POST /api/doctors/timeslots` - Add time slots
- `GET /api/doctors/search` - Search doctors
- `GET /api/doctors/dashboard` - Doctor dashboard

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/patient` - Patient appointments
- `GET /api/appointments/doctor` - Doctor appointments

## Key Features

### Revenue Sharing
- Automatic 60/40 split between doctor and hospital
- Real-time revenue tracking and analytics
- Department-wise revenue breakdown

### Conflict Prevention
- Time slot overlap detection across hospitals
- Unique constraints on critical data
- Comprehensive validation

### Analytics & Reporting
- Interactive charts and visualizations
- Revenue trends and breakdowns
- Consultation statistics

### Responsive Design
- Mobile-first approach
- Clean, professional UI
- Smooth animations and transitions

## Usage

1. **Hospital Admin**: Register and create a hospital with departments
2. **Doctor**: Register, associate with hospitals, add availability
3. **Patient**: Register, search doctors, book appointments
4. **All Users**: Access role-specific dashboards with analytics

## Security Features
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Protected routes and API endpoints

## Future Enhancements
- Payment gateway integration
- Email notifications
- Real-time chat
- Medical records management
- Prescription system
- Multi-language support