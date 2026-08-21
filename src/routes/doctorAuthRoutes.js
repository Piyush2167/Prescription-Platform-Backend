const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor } = require('../controllers/doctorAuthController');
const upload = require('../middleware/upload');

router.post('/register', upload.single('profilePicture'), registerDoctor);
router.post('/login', loginDoctor);

module.exports = router;
