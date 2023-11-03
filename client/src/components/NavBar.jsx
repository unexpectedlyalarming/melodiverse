
import React, { useState } from 'react';
import { CaretDownIcon } from '@radix-ui/react-icons';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);



  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-black text-white">
      <div className="flex justify-between items-center">
        <div className="lg:hidden">
          <button className="p-2" onClick={toggleMenu}>
            <CaretDownIcon />
          </button>
        </div>
      </div>

      <div className={`lg:flex lg:space-x-4 mt-4 ${menuOpen ? 'block' : 'hidden'} lg:items-center lg:justify-center`}>
        <a href="#" className="block lg:inline-block p-2">Home</a>
        <a href="#" className="block lg:inline-block p-2">Samples</a>
        <a href="#" className="block lg:inline-block p-2">Groups</a>
        <a href="#" className="block lg:inline-block p-2">About</a>
      </div>
    </div>
  );
}
