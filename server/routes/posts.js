const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM posts", (err, result) => {
    if (err) {
      console.error("MySQL: query error:", err);
      res.status(500).json({ error: "server error" });
    }
    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  const postId = req.params.id;
  db.query("SELECT * FROM posts WHERE id = ?", [postId], (err, result) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "서버 오류" });
    } else {
      res.json(result[0] || {});
    }
  });
});

module.exports = router;
