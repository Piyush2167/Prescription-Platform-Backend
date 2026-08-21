const express = require('express');
const router = express.Router();
const { getAllDoctors } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllDoctors);

module.exports = router;
