const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const port = process.env.PORT || 8000;

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '';
const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const jwtSecret = process.env.JWT_SECRET || 'very-secret-string';

module.exports = { port, dbHost, dbPort, dbName, dbUser, dbPassword, jwtSecret };
