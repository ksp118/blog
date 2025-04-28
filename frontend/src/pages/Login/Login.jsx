import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // 로그인 성공 후 페이지 새로고침
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "로그인 중 오류가 발생했습니다.");
      } else {
        setError("서버와의 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-body">
        <div className="login-form">
          <h1>환영합니다!</h1>
          <p>
            <strong>로그인</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="login-inputs">
              <input
                className="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                required
              />
              <input
                className="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button className="submit-button" type="submit">
                로그인
              </button>
            </div>
          </form>
          <div className="auth-links">
            <Link to="/register" className="register-link">
              회원가입
            </Link>
            <a className="forget-password" href="#">
              비밀번호 찾기
            </a>
          </div>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <footer className="footer">Copyright 2025</footer>
    </div>
  );
}

export default Login;
