'use client';

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faBoxes, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "/overview" },
      { name: "Inventory", href: "/inventory" },
      { name: "Analytics", href: "/analytics" },
      { name: "Alerts", href: "/alerts" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Reports", href: "/reports" },
      { name: "Certificates", href: "/certificates" },
      { name: "Sales ", href: "/sales-orders" },
      { name: "Purchases ", href: "/purchase-orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      
    ],
  },
];

const socialLinks = [
  {
    icon: faFacebookF,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: faTwitter,
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: faLinkedinIn,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: faGithub,
    href: "https://github.com",
    label: "GitHub",
  },
  {
    icon: faEnvelope,
    href: "mailto:support@inventrackpro.com",
    label: "Email",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Logo and description */}
          <div className="flex flex-col items-start mb-6 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faBoxes} className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Shimmers
              </span>
            </div>
            <p className="text-gray-600 max-w-xs text-sm">
              Powerful, modern inventory management for growing businesses.
            </p>
            <div className="flex space-x-3 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <FontAwesomeIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>
          {/* Navigation links */}
          <div className="flex flex-1 flex-wrap gap-8 justify-between">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-gray-900 font-semibold mb-3">
                  {section.title}
                </h4>
                <ul>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="block py-1 text-gray-600 hover:text-blue-600 transition"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom section */}
        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <span>
            &copy; {new Date().getFullYear()} Shimmers. All rights reserved
          </span>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="/privacy" className="hover:text-blue-600 transition">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-600 transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
