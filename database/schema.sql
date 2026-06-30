-- Base de données pour le système d'alerte de déclaration fiscale

CREATE DATABASE IF NOT EXISTS alerte_declaration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE alerte_declaration;

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS administrateurs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des collaborateurs
CREATE TABLE IF NOT EXISTS collaborateurs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  whatsapp VARCHAR(20),
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_actif (actif)
);

-- Table de l'historique des alertes
CREATE TABLE IF NOT EXISTS historique_alertes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  collaborateur_id INT NOT NULL,
  date_rappel TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_envoye BOOLEAN DEFAULT FALSE,
  whatsapp_envoye BOOLEAN DEFAULT FALSE,
  statut VARCHAR(50) DEFAULT 'envoyé',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collaborateur_id) REFERENCES collaborateurs(id) ON DELETE CASCADE,
  INDEX idx_collaborateur (collaborateur_id),
  INDEX idx_date (date_rappel)
);

-- Table des configurations
CREATE TABLE IF NOT EXISTS configurations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cle VARCHAR(255) UNIQUE NOT NULL,
  valeur TEXT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insérer les configurations par défaut
INSERT INTO configurations (cle, valeur, description) VALUES
('reminder_dates', '5,8,12', 'Dates des rappels dans le mois'),
('reminder_count', '3', 'Nombre de rappels par intervalle'),
('reminder_interval_hours', '2', 'Intervalle en heures entre les rappels'),
('reminder_duration_minutes', '5', 'Durée de chaque rappel en minutes'),
('email_enabled', 'true', 'Activer les rappels par email'),
('whatsapp_enabled', 'true', 'Activer les rappels par WhatsApp');
