import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosinstance.js'
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/home');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/login`, {
        email,
        password,
      });
      
      console.log(response.data)
      

      const { accessToken, refreshToken, user } = response.data.data;

      login(accessToken, {
        name: user.name,
        userName: user.userName,
        avatar: user.avatar,
        coverImage: user.coverImage,
        _id: user._id
      });
      localStorage.setItem('refreshToken', refreshToken);

      console.log('Login success');
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dlqlufuqa/image/upload/v1753537598/greenbg_oqfszw.png')",
      }}
    >
      <div className="w-full max-w-6xl rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl flex flex-col md:flex-row h-full md:h-[90vh] overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-end p-6 md:pr-16 md:pl-0 text-center md:text-right">
          <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-2 md:mb-4">Log in to YUI</h1>
          <p className="text-lg md:text-2xl text-white mb-6 md:mb-0">
            Your people, your posts — all waiting for you.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:pl-16">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center text-white">LOGIN</h2>

            {error && (
              <div className="mb-4 text-red-400 text-sm text-center">{error}</div>
            )}

            <div className="mb-4">
              <label
                className="block font-bold text-white mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-white rounded bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-2 relative">
              <label
                className="block font-bold text-white mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-white rounded bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-400 pr-10"
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[44px] text-white/70"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-right text-sm text-blue-300 mb-4">
              <Link to="/forgot-password" className="hover:underline">
                Forgotten password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
              Login
            </button>

            <p className="text-sm text-white mt-6 text-center">
              Don’t have an Account?{" "}
              <Link
                to="/register"
                className="text-red-400 hover:underline font-medium"
              >
                Register Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );


}

export default Login;
