const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'patient' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const registerPatient = async (req, res) => {
  try {
    const { name, age, email, phone, password, surgeryHistory, illnessHistory } = req.body;
    
    const patientExists = await Patient.findOne({ $or: [{ email }, { phone }] });
    if (patientExists) {
      return res.status(400).json({ message: 'Patient already exists with this email or phone' });
    }

    let profilePicture = '';
    if (req.file) {
      profilePicture = req.file.path;
    }

    // Convert illnessHistory string back to array if sent as comma-separated string
    let parsedIllnessHistory = [];
    if (illnessHistory) {
      parsedIllnessHistory = illnessHistory.split(',').map(item => item.trim());
    }

    const patient = await Patient.create({
      name,
      age,
      email,
      phone,
      password,
      surgeryHistory,
      illnessHistory: parsedIllnessHistory,
      profilePicture
    });

    res.status(201).json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      token: generateToken(patient._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during patient registration' });
  }
};

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const patient = await Patient.findOne({ email });
    if (patient && (await patient.comparePassword(password))) {
      res.json({
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        token: generateToken(patient._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during patient login' });
  }
};

module.exports = { registerPatient, loginPatient };
