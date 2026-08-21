const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const { generatePrescriptionPDF } = require('../utils/generatePDF');

const getPrescriptionByConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const consultation = await Consultation.findById(consultationId)
      .populate('patient', 'name age')
      .populate('doctor', 'name specialty phone');

    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    const isOwningDoctor = req.user.role === 'doctor' && consultation.doctor._id.toString() === req.user._id.toString();
    const isOwningPatient = req.user.role === 'patient' && consultation.patient._id.toString() === req.user._id.toString();
    if (!isOwningDoctor && !isOwningPatient) {
      return res.status(403).json({ message: 'Not authorized for this consultation' });
    }

    const prescription = await Prescription.findOne({ consultation: consultationId });
    res.json({ prescription, consultation });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescription details' });
  }
};

const getPatientPrescriptions = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patient: req.user._id }).select('_id');
    const prescriptions = await Prescription.find({ consultation: { $in: consultations.map((c) => c._id) } })
      .populate({ path: 'consultation', populate: { path: 'doctor', select: 'name specialty' } })
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
};

const savePrescription = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { careToBeTaken, medicines } = req.body;
    const doctor = req.user;

    const consultation = await Consultation.findById(consultationId).populate('patient');
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
    
    if (consultation.doctor.toString() !== doctor._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this consultation' });
    }

    let prescription = await Prescription.findOne({ consultation: consultationId });
    
    if (prescription) {
      // Update existing
      prescription.careToBeTaken = careToBeTaken;
      prescription.medicines = medicines;
      prescription.version += 1;
    } else {
      // Create new
      prescription = new Prescription({
        consultation: consultationId,
        careToBeTaken,
        medicines,
        version: 1
      });
    }
    
    // Generate PDF
    const pdfUrl = await generatePrescriptionPDF(prescription, consultation, doctor, consultation.patient);
    prescription.pdfUrl = pdfUrl;
    
    await prescription.save();
    
    // Update consultation status
    consultation.status = 'completed';
    await consultation.save();
    
    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving prescription' });
  }
};

module.exports = { getPrescriptionByConsultation, savePrescription, getPatientPrescriptions };
