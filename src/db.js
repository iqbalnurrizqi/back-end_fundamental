const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool using environment variables
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};