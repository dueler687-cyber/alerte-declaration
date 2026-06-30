const express = require('express');
const { sendReminders } = require('../services/scheduler');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/send', verifyToken, async (req, res) => {
  try {
    const { reminderDate } = req.body;

    if (!reminderDate || reminderDate < 1 || reminderDate > 28) {
      return res.status(400).json({ error: 'Date de rappel invalide (1-28)' });
    }

    await sendReminders(reminderDate);
    res.json({ message: 'Rappels envoyés avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
