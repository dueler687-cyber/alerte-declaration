const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const collaboratorRoutes = require('./routes/collaborators');
const alertRoutes = require('./routes/alerts');
const historyRoutes = require('./routes/history');
const { initializeScheduler } = require('./services/scheduler');
const { connectDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/history', historyRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur'
  });
});

// Démarrage du serveur
app.listen(PORT, async () => {
  try {
    // Connexion à la base de données
    await connectDatabase();
    console.log('✅ Connecté à la base de données');
    
    // Initialisation du scheduler
    initializeScheduler();
    console.log('✅ Scheduler d\'alertes initialisé');
    
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Erreur de démarrage:', error);
    process.exit(1);
  }
});

module.exports = app;
