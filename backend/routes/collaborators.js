const express = require('express');
const { query } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', verifyToken, async (req, res) => {
  try {
    const collaborators = await query('SELECT * FROM collaborateurs ORDER BY created_at DESC');
    res.json(collaborators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const collaborators = await query('SELECT * FROM collaborateurs WHERE id = ?', [req.params.id]);
    if (collaborators.length === 0) {
      return res.status(404).json({ error: 'Collaborateur non trouvé' });
    }
    res.json(collaborators[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/',
  verifyToken,
  body('nom').notEmpty(),
  body('email').isEmail(),
  validateInput,
  async (req, res) => {
    try {
      const { nom, email, whatsapp, actif } = req.body;

      const existing = await query('SELECT * FROM collaborateurs WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      await query(
        'INSERT INTO collaborateurs (nom, email, whatsapp, actif) VALUES (?, ?, ?, ?)',
        [nom, email, whatsapp || null, actif !== false ? 1 : 0]
      );

      res.status(201).json({ message: 'Collaborateur créé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { nom, email, whatsapp, actif } = req.body;
    
    await query(
      'UPDATE collaborateurs SET nom = ?, email = ?, whatsapp = ?, actif = ? WHERE id = ?',
      [nom, email, whatsapp || null, actif ? 1 : 0, req.params.id]
    );

    res.json({ message: 'Collaborateur modifié avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await query('DELETE FROM collaborateurs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Collaborateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
