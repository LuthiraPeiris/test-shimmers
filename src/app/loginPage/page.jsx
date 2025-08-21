'use client'
import '../globals.css'
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to homepage
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-2">
      <div className="w-full max-w-md shadow-xl rounded-2xl bg-white dark:bg-gray-800 py-10 px-8 sm:p-12">
        <Logo />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Sign In to Your Account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signin-userid" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              USER ID
            </label>
            <input
              id="signin-userid"
              name="userId"
              type="text"
              autoComplete="username"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <input
                id="signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 pr-12 text-gray-900 dark:text-gray-100"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
          <a href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
