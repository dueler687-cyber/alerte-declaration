const cron = require('node-cron');
const { query } = require('../config/database');
const { sendEmail } = require('../config/email');
const { sendWhatsApp } = require('../config/whatsapp');
require('dotenv').config();

const REMINDER_DATES = (process.env.REMINDER_DATES || '5,8,12').split(',').map(Number);
const REMINDER_COUNT = parseInt(process.env.REMINDER_COUNT) || 3;
const REMINDER_INTERVAL_HOURS = parseInt(process.env.REMINDER_INTERVAL_HOURS) || 2;
const REMINDER_DURATION_MINUTES = parseInt(process.env.REMINDER_DURATION_MINUTES) || 5;

const sendReminders = async (reminderDate) => {
  try {
    console.log(`🔔 Envoi des rappels pour le ${reminderDate} du mois`);
    
    const collaborators = await query(
      'SELECT id, nom, email, whatsapp FROM collaborateurs WHERE actif = 1'
    );

    if (collaborators.length === 0) {
      console.log('⚠️  Aucun collaborateur trouvé');
      return;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">🚨 Rappel Important : Déclaration Fiscale</h2>
        <p>Bonjour,</p>
        <p>Nous vous rappelons que votre <strong>déclaration fiscale</strong> doit être complétée avant la date limite du mois.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
          <strong>⚠️ Important :</strong> Le non-respect de cette obligation peut entraîner des pénalités.
        </div>
        <p>Veuillez soumettre votre déclaration dès que possible.</p>
        <p>Cordialement,<br/>L'équipe Comptable</p>
      </div>
    `;

    const whatsappMessage = `🚨 Rappel Important:\n\nN'oubliez pas de soumettre votre déclaration fiscale avant la fin du mois.\n\nLe non-respect peut entraîner des pénalités.\n\nMerci! 📋`;

    for (const collab of collaborators) {
      if (collab.email) {
        await sendEmail(
          collab.email,
          '🚨 Rappel : Déclaration Fiscale à Soumettre',
          htmlContent
        );
      }

      if (collab.whatsapp) {
        await sendWhatsApp(collab.whatsapp, whatsappMessage);
      }

      await query(
        `INSERT INTO historique_alertes (collaborateur_id, date_rappel, email_envoye, whatsapp_envoye, statut)
         VALUES (?, ?, ?, ?, 'envoyé')`,
        [collab.id, new Date(), collab.email ? 1 : 0, collab.whatsapp ? 1 : 0]
      );
    }

    console.log(`✅ Rappels envoyés à ${collaborators.length} collaborateurs`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des rappels:', error);
  }
};

const initializeScheduler = () => {
  REMINDER_DATES.forEach(date => {
    cron.schedule('0 9 * * *', async () => {
      const today = new Date().getDate();
      if (today === date) {
        await sendReminders(date);
      }
    });
  });

  console.log(`⏰ Scheduler configuré pour les rappels les ${REMINDER_DATES.join(', ')} du mois`);
  console.log(`📅 Configuration: ${REMINDER_COUNT} rappels tous les ${REMINDER_INTERVAL_HOURS}h`);
};

module.exports = {
  initializeScheduler,
  sendReminders
};
