const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio',
  password: 'mysecretpassword',
  port: 5432,
});

module.exports = pool;
