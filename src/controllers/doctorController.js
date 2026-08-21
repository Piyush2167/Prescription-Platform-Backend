const Doctor = require('../models/Doctor');

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select('-password');
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
};

module.exports = { getAllDoctors };
