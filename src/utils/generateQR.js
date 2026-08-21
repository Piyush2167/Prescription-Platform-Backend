const QRCode = require('qrcode');

const generatePaymentQR = async (amount = 500, upiId = 'dummy@upi') => {
  try {
    const upiString = `upi://pay?pa=${upiId}&pn=DoctorConsultation&am=${amount}&cu=INR`;
    const qrDataUrl = await QRCode.toDataURL(upiString);
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code', error);
    return null;
  }
};

module.exports = { generatePaymentQR };
