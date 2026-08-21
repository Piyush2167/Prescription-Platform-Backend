const express = require('express');
const router = express.Router();
const { createConsultation, getPaymentQR, getDoctorConsultations, getConsultationById, getPatientConsultations } = require('../controllers/consultationController');
const { protect } = require('../middleware/auth');

router.get('/qr', protect, getPaymentQR);
router.get('/doctor', protect, getDoctorConsultations);
router.get('/patient', protect, getPatientConsultations);
router.get('/:id', protect, getConsultationById);
router.post('/', protect, createConsultation);

module.exports = router;
