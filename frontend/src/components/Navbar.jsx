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
    <nav
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        padding: "16px",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "20px",
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        Trang chủ
      </Link>

      <Link to="/about" style={{ textDecoration: "none" }}>
        About
      </Link>

      <Link to="/stats" style={{ textDecoration: "none" }}>
        Stats
      </Link>

      {isAuth && (
        <Link to="/new-post" style={{ textDecoration: "none" }}>
          Tạo bài viết
        </Link>
      )}

      {isAuth ? (
        <>
          <span>{username || "Người dùng"} ({role})</span>
          <button
            onClick={handleLogout}
            style={{ cursor: "pointer", border: "1px solid #ccc", borderRadius: "6px", padding: "6px 12px" }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" style={{ textDecoration: "none" }}>
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
