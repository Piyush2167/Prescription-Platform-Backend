const express = require('express');
const cors = require('cors');
const path = require('path');

const doctorAuthRoutes = require('./routes/doctorAuthRoutes');
const patientAuthRoutes = require('./routes/patientAuthRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/doctor/auth', doctorAuthRoutes);
app.use('/api/patient/auth', patientAuthRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const consultationRoutes = require('./routes/consultationRoutes');
app.use('/api/consultations', consultationRoutes);

const prescriptionRoutes = require('./routes/prescriptionRoutes');
app.use('/api/prescriptions', prescriptionRoutes);

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is running' });
});

module.exports = app;
