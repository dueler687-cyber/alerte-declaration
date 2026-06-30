const express = require('express');
const { query } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;

    const history = await query(`
      SELECT ha.*, c.nom, c.email, c.whatsapp
      FROM historique_alertes ha
      JOIN collaborateurs c ON ha.collaborateur_id = c.id
      ORDER BY ha.date_rappel DESC
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    const countResult = await query('SELECT COUNT(*) as total FROM historique_alertes');
    const total = countResult[0].total;

    res.json({
      data: history,
      total: total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/collaborateur/:id', verifyToken, async (req, res) => {
  try {
    const history = await query(`
      SELECT * FROM historique_alertes
      WHERE collaborateur_id = ?
      ORDER BY date_rappel DESC
    `, [req.params.id]);

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
