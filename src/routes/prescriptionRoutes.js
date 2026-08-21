const express = require('express');
const router = express.Router();
const { getPrescriptionByConsultation, savePrescription, getPatientPrescriptions } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/auth');

router.get('/mine', protect, getPatientPrescriptions);
router.get('/:consultationId', protect, getPrescriptionByConsultation);
router.post('/:consultationId', protect, savePrescription);

module.exports = router;
