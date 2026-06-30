const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

const connectDatabase = async () => {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'alerte_declaration',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    return pool;
  } catch (error) {
    console.error('Erreur de connexion DB:', error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Base de données non connectée');
  }
  return pool;
};

const query = async (sql, values = []) => {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
};

module.exports = {
  connectDatabase,
  getPool,
  query
};
