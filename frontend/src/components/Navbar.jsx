import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("isAuth") === "true";
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-link">
        Trang chủ
      </Link>

      <Link to="/about" className="navbar-link">
        About
      </Link>

      <Link to="/stats" className="navbar-link">
        Stats
      </Link>

      {isAuth && (
        <Link to="/new-post" className="navbar-link">
          Tạo bài viết
        </Link>
      )}

      {isAuth ? (
        <>
          <span>{username || "Người dùng"} ({role})</span>
          <button
            onClick={handleLogout}
            className="navbar-logout-btn"
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="navbar-link">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
