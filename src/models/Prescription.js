const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  careToBeTaken: { type: String, required: true },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true }
  }],
  pdfUrl: { type: String },
  version: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
