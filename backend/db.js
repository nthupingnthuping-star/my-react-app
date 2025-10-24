const mysql = require("mysql");
const { promisify } = require("util");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "luct_reporting_database",
  port: process.env.DB_PORT || 3306,
});
pool.query = promisify(pool.query).bind(pool);

module.exports = pool;