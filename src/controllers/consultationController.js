const Consultation = require('../models/Consultation');
const { generatePaymentQR } = require('../utils/generateQR');

const getPaymentQR = async (req, res) => {
  try {
    // Generate a dummy QR for Rs 500
    const qrDataUrl = await generatePaymentQR(500, 'doctor@ybl');
    res.json({ qr: qrDataUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR' });
  }
};

const createConsultation = async (req, res) => {
  try {
    const { 
      doctorId, 
      currentIllnessHistory, 
      recentSurgery, 
      recentSurgeryTimeSpan, 
      diabetic, 
      allergies, 
      others, 
      qrPaymentTransactionId 
    } = req.body;

    const patientId = req.user._id;

    const consultation = await Consultation.create({
      doctor: doctorId,
      patient: patientId,
      currentIllnessHistory,
      recentSurgery,
      recentSurgeryTimeSpan,
      diabetic,
      allergies,
      others,
      qrPaymentTransactionId,
      status: 'pending'
    });

    res.status(201).json(consultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating consultation' });
  }
};

const getDoctorConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctor: req.user._id })
      .populate('patient', 'name age profilePicture email')
      .sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations' });
  }
};

const getPatientConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patient: req.user._id })
      .populate('doctor', 'name specialty profilePicture')
      .sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations' });
  }
};

const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patient', 'name age profilePicture email phone')
      .populate('doctor', 'name specialty');

    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
    if (consultation.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this consultation' });
    }

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultation' });
  }
};

module.exports = { createConsultation, getPaymentQR, getDoctorConsultations, getConsultationById, getPatientConsultations };
