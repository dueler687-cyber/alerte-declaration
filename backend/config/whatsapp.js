const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = async (phoneNumber, message) => {
  try {
    const msg = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
      body: message
    });
    console.log(`✅ WhatsApp envoyé à ${phoneNumber}:`, msg.sid);
    return { success: true, messageSid: msg.sid };
  } catch (error) {
    console.error(`❌ Erreur WhatsApp à ${phoneNumber}:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWhatsApp,
  client
};
