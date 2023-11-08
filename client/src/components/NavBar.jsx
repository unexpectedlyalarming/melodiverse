import React, { useState, useContext } from "react";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import userContext from "../contexts/userContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(userContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const modOptions = (
    <>
      <li className="p-2 hover:bg-gray-800">
        <Link to="/mod/genres/create">Create Genre</Link>
      </li>
      <li className="p-2 hover:bg-gray-800">
        <Link to="/mod/genres">Edit Genres</Link>
      </li>
    </>
  );

  return (
    <div className="bg-black text-white">
      <div className="flex justify-between items-center">
        <div className="lg:hidden">
          <button className="p-2" onClick={toggleMenu}>
            <CaretDownIcon />
          </button>
        </div>
      </div>

      <ul
        className={`lg:flex lg:space-x-4 mt-4 ${
          menuOpen ? "flex" : "hidden"
        } lg:items-center lg:justify-center`}
      >
        <li className="block lg:inline-block p-2">
          <Link to="/" className="block lg:inline-block p-2">
            Home
          </Link>
        </li>

        <li className="block lg:inline-block p-2">
          <Link to="/samples" className="block lg:inline-block p-2">
            Samples
          </Link>
        </li>
        <li className="block lg:inline-block p-2">
          <Link to="/groups" className="block lg:inline-block p-2">
            Groups
          </Link>
        </li>
        <li className="block lg:inline-block p-2">
          <Link to="/about" className="block lg:inline-block p-2">
            About
          </Link>
        </li>
        {user?.moderator ? modOptions : null}
      </ul>
    </div>
  );
}
