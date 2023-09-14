import "./hamburmenu.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Hamburmenu(props) {
  const [menuVisible, setMenuVisible] = useState(true);
  const [hamburMenu, setHamburMenu] = useState(false);

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <div className="hambur-container">
        <img onClick={handleMenuToggle} src="/menu.png" alt="menu" />
      </div>
    <div className={`asidemenu ${menuVisible ? "hidden" : "visible"}`}>
      <span className="close" onClick={handleMenuToggle}>
        X
      </span>
      <ul className="list">
        {/* <li>
          <Link to="/concentradora/dcs/home" style={{ textDecoration: "none", color: 'inherit' }}>
            Home
          </Link>
        </li> */}
        <li>
          <Link to={`/concentradora/dcs/${props.urlRedirect}`} style={{ textDecoration: "none", color: 'inherit' }}>
          {props.buttonTag}
          </Link>
        </li>
      </ul>
    </div>
    </>
  );
}
