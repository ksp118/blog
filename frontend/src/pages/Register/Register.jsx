import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameStatus, setUsernameStatus] = useState({
    checked: false,
    available: false,
    message: "",
  });
  const navigate = useNavigate();

  const checkUsername = async () => {
    if (username.length < 4) {
      setUsernameStatus({
        checked: true,
        available: false,
        message: "아이디는 4자 이상이어야 합니다.",
      });
      return;
    }

    try {
      const response = await axios.get(`/api/auth/check-username/${username}`);
      setUsernameStatus({
        checked: true,
        available: response.data.isAvailable,
        message: response.data.message,
      });
    } catch (error) {
      setError(
        error.response?.data?.error || "아이디 확인 중 오류가 발생했습니다."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameStatus.checked) {
      setError("아이디 중복 확인을 해주세요.");
      return;
    }

    if (!usernameStatus.available) {
      setError("사용할 수 없는 아이디입니다.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        username,
        password,
      });
      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.error || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>회원가입</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <div className="username-input-group">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameStatus({
                    checked: false,
                    available: false,
                    message: "",
                  });
                }}
                required
                placeholder="4자 이상 입력해주세요"
              />
              <button
                type="button"
                className="check-button"
                onClick={checkUsername}
              >
                중복확인
              </button>
            </div>
            {usernameStatus.checked && (
              <div
                className={`status-message ${
                  usernameStatus.available ? "success" : "error"
                }`}
              >
                {usernameStatus.message}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="6자 이상 입력해주세요"
            />
          </div>
          <button type="submit" disabled={!usernameStatus.available}>
            회원가입
          </button>
        </form>
        <div className="login-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
