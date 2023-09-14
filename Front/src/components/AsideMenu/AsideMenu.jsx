import './hamburmenu.css'
import { Link } from "react-router-dom";
import React, { useState } from "react";
import './asidemenu.css';

export function AsideMenu(props) {
  const [menuVisible, setMenuVisible] = useState(true);

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className={`asidemenu ${menuVisible ? 'hidden' : 'visible'}`}>
      <img src="../../src/assets/menu.png" alt="asdassadsa" />
      <span className="close" onClick={handleMenuToggle}>X</span>
      <ul className="list">
        <li>
          <Link to={props.homeUrl} style={{ textDecoration: 'none' }}>Home</Link>
        </li>
        <li>
          <Link to={props.switchesUrl} style={{ textDecoration: 'none' }}>Switches</Link>
        </li>
      </ul>
    </div>
  );
};

