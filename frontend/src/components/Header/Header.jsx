import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Header.css";

function Header({ onLogout }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/auth/check",
          {
            withCredentials: true,
          }
        );
        setIsLoggedIn(response.data.isLoggedIn);
        if (response.data.isLoggedIn) {
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        setIsLoggedIn(false);
      }
    };

    // 초기 상태 확인
    checkLoginStatus();

    // 1분마다 상태 확인
    const interval = setInterval(checkLoginStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(false);
      setUsername("");
      onLogout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Gyuho Lee</Link>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <span className="username">안녕하세요, {username}님</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">로그인</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
