import { useState } from "react";
import "./Login.css";
import axios from "axios";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [loginMessage, setLoginMessage] = useState("");

  const doLogin = async () => {
    await axios
      .post("/api/auth/login", {
        username: userName,
        password: password,
      })
      .then((res) => {
        setLoginMessage("success");
      })
      .catch(setLoginMessage("failed"));
  };

  return (
    <div className="login-container">
      <div className="login-body">
        <div className="login-form">
          <h1>WELCOME!</h1>
          <p>
            <strong>LOGIN</strong>
          </p>
          <div className="login-inputs">
            <input
              className="username"
              onChange={(event) => {
                setUserName(event.target.value);
              }}
            ></input>
            <input
              className="password"
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            ></input>
            <button className="submit-button" onClick={doLogin}>
              LOGIN
            </button>
            <a className="forget-password" href="#">
              Forgot password?
            </a>
          </div>
        </div>
        {loginMessage && loginMessage !== "success" && <p>실패!</p>}
      </div>
      <footer className="footer">Copyright 2025</footer>
    </div>
  );
}

export default Login;
