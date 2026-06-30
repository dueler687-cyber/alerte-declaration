# 📋 Système d'Alerte de Déclaration Fiscale

## Description

Un système automatisé pour envoyer des rappels de déclaration fiscale aux collaborateurs via Email et WhatsApp.

### ✨ Fonctionnalités

- ✅ **Rappels automatiques** aux dates : 5, 8 et 12 du mois
- ✅ **Notifications intensives** : 3 rappels dans un intervalle de 2 heures
- ✅ **Multi-canal** : Email + WhatsApp
- ✅ **Tableau de bord** : Gestion des collaborateurs et suivi des alertes
- ✅ **Authentification sécurisée** : JWT
- ✅ **Historique complet** : Logs de tous les rappels envoyés
- ✅ **API REST** : Intégration facile

---

## 🚀 Installation

### Prérequis

- Node.js v14+
- MySQL 5.7+
- Compte Twilio (pour WhatsApp)
- Compte Gmail (pour email)

### Étapes

1. **Cloner le repo**
   ```bash
   git clone https://github.com/dueler687-cyber/alerte-declaration.git
   cd alerte-declaration
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos configurations
   ```

4. **Créer la base de données**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. **Démarrer le serveur**
   ```bash
   npm start
   ```

---

## 📖 Configuration

### Base de données MySQL

La structure de la base de données est créée automatiquement via `database/schema.sql`

### Email (Gmail)

1. Activer l'authentification à deux facteurs
2. Générer un mot de passe d'application
3. Ajouter dans `.env`

### WhatsApp (Twilio)

1. Créer un compte Twilio
2. Configurer WhatsApp Sandbox
3. Récupérer Account SID et Auth Token

---

## 🔧 API Endpoints

### Authentification

```bash
POST /api/auth/register
POST /api/auth/login
```

### Collaborateurs

```bash
GET    /api/collaborators
POST   /api/collaborators
PUT    /api/collaborators/:id
DELETE /api/collaborators/:id
```

### Alertes

```bash
GET  /api/alerts
GET  /api/alerts/:id
POST /api/alerts/send
```

### Historique

```bash
GET /api/history
GET /api/history/:id
```

---

## 📱 Interface Web

Accédez au tableau de bord : `http://localhost:3000`

---

## 🔒 Sécurité

- Authentification JWT
- Hachage des mots de passe (bcryptjs)
- Validation des données
- CORS configuré
- Helmet pour les headers de sécurité

---

## 📝 License

MIT
