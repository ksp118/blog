const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "blog",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL: connection failed:", err);
    return;
  }
  console.log("MySQL: connection success");
});

module.exports = db;
