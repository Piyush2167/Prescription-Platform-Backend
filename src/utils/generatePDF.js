const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePrescriptionPDF = async (prescription, consultation, doctor, patient) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `prescription-${consultation._id}-v${prescription.version}.pdf`;
      const filepath = path.join(__dirname, '../../uploads/', filename);
      const writeStream = fs.createWriteStream(filepath);
      
      doc.pipe(writeStream);
      
      // Header
      doc.fontSize(20).text('Medical Prescription', { align: 'center' });
      doc.moveDown();
      
      // Doctor Info
      doc.fontSize(12).text(`Doctor: ${doctor.name} (${doctor.specialty})`);
      doc.text(`Email: ${doctor.email} | Phone: ${doctor.phone}`);
      doc.moveDown();
      
      // Patient Info
      doc.text(`Patient: ${patient.name} | Age: ${patient.age}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      
      // Medicines
      doc.fontSize(14).text('Medicines:', { underline: true });
      doc.moveDown(0.5);
      
      prescription.medicines.forEach((med, i) => {
        doc.fontSize(12).text(`${i + 1}. ${med.name}`);
        doc.fontSize(10).text(`   Dosage: ${med.dosage} | Duration: ${med.duration}`);
        doc.moveDown(0.5);
      });
      
      doc.moveDown();
      
      // Care to be taken
      doc.fontSize(14).text('Care to be taken:', { underline: true });
      doc.fontSize(12).text(prescription.careToBeTaken);
      
      doc.moveDown(2);
      doc.fontSize(10).text(`Prescription Version: ${prescription.version}`, { align: 'right' });
      
      doc.end();
      
      writeStream.on('finish', () => resolve(`uploads/${filename}`));
      writeStream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePrescriptionPDF };
