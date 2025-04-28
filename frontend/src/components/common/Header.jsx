import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <div className="header-container">
      <Link to={"/"}>
        <img className="header-logo" src="/img/logo.svg"></img>
      </Link>
      <Link to={"/login"}>
        <span>login</span>
      </Link>
    </div>
  );
}

export default Header;
