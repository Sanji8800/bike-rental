import { Motorbike } from 'lucide-react';
import { useState, type RefObject } from 'react';
import { Link } from 'react-router';

interface NavbarProps {
  scrollToSection: (ref: RefObject<HTMLDivElement>) => void;
  activeSection: string;
  navbarRef: RefObject<HTMLDivElement>;
}

const Navbar = ({ activeSection, navbarRef }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', ref: null, id: 'home' },
    { name: 'About', ref: null, id: 'about' },
    { name: 'Bikes', ref: null, id: 'bikes' },
    { name: 'How it works', ref: null, id: 'how-it-works' },
    { name: 'Contact Us', ref: null, id: 'contact' },
  ];

  const handleNavLinkClick = (id: string) => {
    setIsOpen(false);
    // The actual scrolling will be handled by the parent component (App.tsx)
    // We just need to update the URL hash
    window.location.hash = id;
  };

  return (
    <nav ref={navbarRef} className="bg-[#0f0f0f] fixed top-0 left-0 right-0 z-50 mx-auto max-w-full rounded-xl">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <Motorbike className="size-10" color="#4a9d6a" />
          <span className="self-center text-[28px] font-bold whitespace-nowrap text-[#4a9d6a]">BikeRent</span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden 
          hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 
          dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbar-default"
          aria-expanded={isOpen}>
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul
            className="font-medium flex flex-col p-4 md:p-0 mt-4   rounded-lg 
             md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0">
            {navItems.map((item, i) => (
              <li key={i}>
                <a
                  href={`#${item.id}`}
                  onClick={() => handleNavLinkClick(item.id)}
                  className={`block py-2 px-3 text-md font-semibold rounded-sm md:p-0 
                    ${
                      activeSection === item.id
                        ? 'text-white bg-[#4a9d6a] md:bg-transparent md:text-[#4a9d6a] dark:text-white md:dark:text-[#4a9d6a]'
                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#4a9d6a] dark:text-white md:dark:hover:text-[#4a9d6a] dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                    }`}
                  aria-current={activeSection === item.id ? 'page' : undefined}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
