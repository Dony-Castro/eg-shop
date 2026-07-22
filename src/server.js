const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');

const server = app.listen(env.port, () => {
  console.log(`E&G Shop ejecutándose en http://localhost:${env.port}`);
});

const shutdown = async () => {
  await pool.end();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
