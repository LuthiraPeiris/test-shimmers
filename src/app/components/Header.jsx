'use client';

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faChevronDown,
  faCog,
  faSignOutAlt,
  faBars,
  faTimes,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const navLinks = [
  { name: "Overview", href: "/overview" },
  { name: "Inventory", href: "/inventory" },
  { name: "Sales", href: "/sales" },  // Removed dropdown
  { name: "Purchases", href: "/purchases" },  // Removed dropdown
  { name: "Management", dropdown: [  // New Management item with dropdown
      { name: "Suppliers", href: "/suppliers" },
      { name: "Customers", href: "/customers" },
    ],
  },
  { name: "Analytics", href: "/analytics" },
  { name: "Certificates", href: "/certificates" },  // Replaced Documents with Certificates
  { name: "Alerts", href: "/alerts" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Handle dropdowns for desktop
  const handleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Close mobile menu on navigation
  const handleNavClick = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faBoxes} className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Shimmers
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      openDropdown === link.name
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === link.name}
                  >
                    {link.name}
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </button>
                  {/* Dropdown */}
                  <div
                    className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-200 ${
                      openDropdown === link.name
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                  >
                    {link.dropdown.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={handleNavClick}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-2 py-1 rounded text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={handleNavClick}
                >
                  {link.name}
                </a>
              )
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                3
              </span>
            </button>
            {/* User Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User  "
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-700 font-medium hidden sm:block">
                  John Smith
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-xs text-gray-600"
                />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a
                  href="/user-settings"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  User Settings
                </a>
                <a
                  href="/login"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </a>
              </div>
            </div>
            {/* Hamburger for mobile */}
            <button
              className="md:hidden ml-2 p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      <nav
        className={`md:hidden fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 transform transition-transform duration-200 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full py-6 px-6 space-y-2">
          {navLinks.map((link) =>
            link.dropdown ? (
              <MobileDropdown key={link.name} link={link} onNav={handleNavClick} />
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="block px-2 py-2 rounded text-gray-700 hover:text-blue-600 font-medium"
                onClick={handleNavClick}
              >
                {link.name}
              </a>
            )
          )}
          <div className="border-t border-gray-200 mt-4 pt-4">
            <a
              href="/user-settings"
              className="block px-2 py-2 text-gray-700 hover:text-blue-600"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              User Settings
            </a>
            <a
              href="/login"
              className="block px-2 py-2 text-gray-700 hover:text-blue-600"
              onClick={handleNavClick}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

// Mobile dropdown helper
function MobileDropdown({ link, onNav }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="flex items-center justify-between w-full px-2 py-2 rounded text-gray-700 hover:text-blue-600 font-medium"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{link.name}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pl-4">
          {link.dropdown.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-2 py-2 rounded text-gray-600 hover:text-blue-600"
              onClick={onNav}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
