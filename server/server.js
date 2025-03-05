const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.get("/api/posts", (req, res) => {
  db.query("SELECT * FROM posts", (err, result) => {
    if (err) {
      console.error("MySQL: query error:", err);
      res.status(500).json({ error: "server error" });
    }
    res.json(result);
  });
});

app.get("/api/posts/:id", (req, res) => {
  const postId = req.params.id;
  db.query("SELECT * FROM posts WHERE id = ?", [postId], (err, result) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "서버 오류" });
    } else {
      res.json(result[0]);
    }
  });
});

app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`);
});
