const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient } = require('../controllers/patientAuthController');
const upload = require('../middleware/upload');

router.post('/register', upload.single('profilePicture'), registerPatient);
router.post('/login', loginPatient);

module.exports = router;
