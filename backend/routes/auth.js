const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('nom').notEmpty(),
  validateInput,
  async (req, res) => {
    try {
      const { email, password, nom } = req.body;

      const existingUser = await query('SELECT * FROM administrateurs WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await query(
        'INSERT INTO administrateurs (nom, email, password) VALUES (?, ?, ?)',
        [nom, email, hashedPassword]
      );

      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  validateInput,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const users = await query('SELECT * FROM administrateurs WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const user = users[0];

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Connexion réussie',
        token: token,
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
