import React, { useState, useContext } from "react";
import { BellIcon, CaretDownIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import useAuth from "../hooks/useAuth";
import { useMediaQuery } from "react-responsive";
import "../css/nav.css";

export default function NavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { user } = useContext(UserContext);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const modOptions = (
    <>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
    </>
  );
  const userOptions = (
    <>
      <li>
        <Link to={`/profile/${user._id}`}>Profile</Link>
      </li>
      <li>
        <button onClick={handleLogout}>Logout</button>
      </li>
      <li className="nav-inbox">
        <Link to="/inbox">Inbox</Link>
        <BellIcon />
      </li>
    </>
  );
  return (
    <nav className="nav">
      <div className={isMobile ? "" : "hidden"}>
        <button className="mobile-menu" onClick={toggleMenu}>
          <CaretDownIcon />
        </button>
      </div>

      <ul className={isMobile && menuOpen ? "hidden" : null}>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/samples">Samples</Link>
        </li>
        <li>
          <Link to="/groups">Groups</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {user ? userOptions : null}
        {user?.moderator ? modOptions : null}
      </ul>
    </nav>
  );
}
