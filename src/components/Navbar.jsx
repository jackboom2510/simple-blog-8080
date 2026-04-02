import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
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

      <Link to="/login" style={{ textDecoration: "none" }}>
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
