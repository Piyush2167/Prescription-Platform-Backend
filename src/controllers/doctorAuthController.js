const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'doctor' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const registerDoctor = async (req, res) => {
  try {
    const { name, specialty, email, phone, experience, password } = req.body;
    
    const doctorExists = await Doctor.findOne({ $or: [{ email }, { phone }] });
    if (doctorExists) {
      return res.status(400).json({ message: 'Doctor already exists with this email or phone' });
    }

    let profilePicture = '';
    if (req.file) {
      profilePicture = req.file.path;
    }

    const doctor = await Doctor.create({
      name,
      specialty,
      email,
      phone,
      experience,
      password,
      profilePicture
    });

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      token: generateToken(doctor._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during doctor registration' });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const doctor = await Doctor.findOne({ email });
    if (doctor && (await doctor.comparePassword(password))) {
      res.json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        token: generateToken(doctor._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during doctor login' });
  }
};

module.exports = { registerDoctor, loginDoctor };
