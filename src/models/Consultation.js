const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  currentIllnessHistory: { type: String, required: true },
  recentSurgery: { type: String },
  recentSurgeryTimeSpan: { type: String },
  diabetic: { type: Boolean, required: true },
  allergies: { type: String },
  others: { type: String },
  qrPaymentTransactionId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
