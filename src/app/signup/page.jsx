'use client'
import '../globals.css'

import React, { useState } from "react";


function Logo() {
  return (
    <div className="flex justify-center mb-8">
      <img
        className="w-20 h-20 rounded-full shadow-lg border-4 border-blue-500 bg-white object-contain"
        src="https://placehold.co/160x160/png?text=Logo"
        alt="Company logo"
      />
    </div>
  );
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-2">
      <div className="w-full max-w-md shadow-xl rounded-2xl bg-white dark:bg-gray-800 py-10 px-8 sm:p-12">
        <Logo />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Create Your Account
        </h2>
        <form className="space-y-5">
          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Full Name
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 pr-12 text-gray-900 dark:text-gray-100"
                placeholder="Create a password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showCPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 pr-12 text-gray-900 dark:text-gray-100"
                placeholder="Retype your password"
              />
              <button
                type="button"
                aria-label={showCPassword ? "Hide password" : "Show password"}
                onClick={() => setShowCPassword(v => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-gray-500"
                tabIndex={-1}
              >
                {showCPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
          <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Already have an account? Log In
          </a>
        </div>
      </div>
    </div>
  );
}
