const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: true,
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error connecting to the database", err.stack);
  }
  console.log("Connected to PostgreSQL database");
  release();
});

module.exports = pool;
