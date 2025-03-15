// Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform authentication (Add backend integration here)
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 max-w-[90%]">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 text-blue-600 rounded border-gray-300" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-300 shadow-md"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;