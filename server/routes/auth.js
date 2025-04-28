const express = require("express");
const router = express.Router();
const db = require("../db");
const cookieParser = require("cookie-parser");
const {
  hashPassword,
  uuidToBinary,
  v4,
  verifyPassword,
  binaryToUuid,
} = require("../utils");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await hashPassword(password);
  const userId = uuidToBinary(v4());

  db.query(
    "insert into users (id, username, password) values (?,?,?)",
    [userId, username, hashedPassword],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "user already exist" });
        }
        return res.status(500).json({ error: "failed to register" });
      }
      res.json({ message: "succeed to register" });
    }
  );
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "select id, password from users where username = ?",
    [username],
    async (error, result) => {
      if (err) return res.status(500).json({ error: "server error" });
      if (result.length === 0)
        return res.status(401).json({ message: "no such user" });

      const user = result[0];
      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "incorrect password" });

      const sessionId = uuidToBinary(v4());
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 180);

      db.query(
        "insert into sessions (session_id, user_id, expires_at) values (?, ?, ?)",
        [sessionId, user.id, expiresAt],
        (err) => {
          if (err)
            return res.status(500).json({ error: "failed to save session" });

          res.cookie("session_id", binaryToUuid(sessionId), {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 180,
          });

          res.json({ message: "login success" });
        }
      );
    }
  );
});

module.exports = router;
