const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // We don't know if it's a doctor or patient from just the ID,
      // but usually the route implies the context or we can add a role to the token.
      // Let's look up both just in case, or rely on the decoded role if we add one.
      
      if (decoded.role === 'doctor') {
        req.user = await Doctor.findById(decoded.id).select('-password');
        req.user.role = 'doctor';
      } else if (decoded.role === 'patient') {
        req.user = await Patient.findById(decoded.id).select('-password');
        req.user.role = 'patient';
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
