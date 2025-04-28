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

// 아이디 중복 확인
router.get("/check-username/:username", (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "아이디를 입력해주세요." });
  }

  if (username.length < 4) {
    return res.status(400).json({ error: "아이디는 4자 이상이어야 합니다." });
  }

  db.query(
    "SELECT COUNT(*) as count FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        console.error("아이디 중복 확인 오류:", error);
        return res.status(500).json({ error: "서버 오류가 발생했습니다." });
      }

      const isAvailable = result[0].count === 0;
      res.json({
        success: true,
        isAvailable,
        message: isAvailable
          ? "사용 가능한 아이디입니다."
          : "이미 사용 중인 아이디입니다.",
      });
    }
  );
});

// 입력값 검증 미들웨어
const validateRegisterInput = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "아이디와 비밀번호를 모두 입력해주세요." });
  }

  if (username.length < 4) {
    return res.status(400).json({ error: "아이디는 4자 이상이어야 합니다." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "비밀번호는 6자 이상이어야 합니다." });
  }

  next();
};

router.post("/register", validateRegisterInput, async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const userId = uuidToBinary(v4());

    db.query(
      "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
      [userId, username, hashedPassword],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "이미 존재하는 아이디입니다." });
          }
          console.error("회원가입 오류:", err);
          return res.status(500).json({ error: "회원가입에 실패했습니다." });
        }
        res.status(201).json({
          success: true,
          message: "회원가입이 완료되었습니다.",
        });
      }
    );
  } catch (error) {
    console.error("회원가입 처리 중 오류:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "아이디와 비밀번호를 모두 입력해주세요." });
  }

  db.query(
    "SELECT id, password FROM users WHERE username = ?",
    [username],
    async (error, result) => {
      if (error) {
        console.error("로그인 쿼리 오류:", error);
        return res.status(500).json({ error: "서버 오류가 발생했습니다." });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: "아이디가 존재하지 않습니다." });
      }

      const user = result[0];
      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
      }

      const sessionId = uuidToBinary(v4());
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 180);

      db.query(
        "INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)",
        [sessionId, user.id, expiresAt],
        (err) => {
          if (err) {
            console.error("세션 저장 오류:", err);
            return res
              .status(500)
              .json({ error: "로그인 처리 중 오류가 발생했습니다." });
          }

          res.cookie("session_id", binaryToUuid(sessionId), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 180,
          });

          res.json({
            success: true,
            message: "로그인이 완료되었습니다.",
          });
        }
      );
    }
  );
});

// 세션 확인
router.get("/check", (req, res) => {
  const sessionId = req.cookies.session_id;
  if (!sessionId) {
    return res.json({ isLoggedIn: false });
  }

  db.query(
    "SELECT u.username FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.session_id = ? AND s.expires_at > NOW()",
    [uuidToBinary(sessionId)],
    (error, results) => {
      if (error) {
        console.error("세션 확인 오류:", error);
        return res.json({ isLoggedIn: false });
      }

      if (results.length === 0) {
        return res.json({ isLoggedIn: false });
      }

      res.json({
        isLoggedIn: true,
        username: results[0].username,
      });
    }
  );
});

// 로그아웃
router.post("/logout", (req, res) => {
  const sessionId = req.cookies.session_id;
  if (!sessionId) {
    return res.json({ success: true });
  }

  db.query(
    "DELETE FROM sessions WHERE session_id = ?",
    [uuidToBinary(sessionId)],
    (error) => {
      if (error) {
        console.error("로그아웃 오류:", error);
        return res.status(500).json({ error: "서버 오류가 발생했습니다." });
      }

      res.clearCookie("session_id");
      res.json({ success: true });
    }
  );
});

module.exports = router;
