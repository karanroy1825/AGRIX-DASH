import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const hardcodedEmail = 'admin@agrix.com';
    const hardcodedPassword = 'admin123';
    if (email === hardcodedEmail && password === hardcodedPassword) {
      alert('Login successful');
      navigate('/dashboard');
    } else {
      console.log('Invalid credentials');
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{' '}
          <a href="#" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
