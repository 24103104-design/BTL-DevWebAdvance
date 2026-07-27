const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 14959),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });

  const [rows] = await conn.query("SHOW COLUMNS FROM SACH LIKE 'AnhBia'");
  if (!rows.length) {
    await conn.query('ALTER TABLE SACH ADD COLUMN AnhBia TEXT NULL');
    console.log('Added column AnhBia to SACH');
  } else {
    console.log('Column AnhBia already exists');
  }

  await conn.end();
})();
