import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

export function Navbar(props) {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/monitoreo/home">
          <img src="/candelaria.png" alt="Logo" />
        </Link>
      </div>
      <Link
        to="/monitoreo/home"
        className="home-link"
        style={{ color: "white" }}
      >
        Home
      </Link>
      <h1 className="main-title">{props.title}</h1>

      <Link
        to="/admin/home"
        className="admin-link"
        style={{ color: "white" }}
      >
        Admin
      </Link>
    </nav>
  );
}
