import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaUserCircle, FaBell, FaEnvelope, FaSearch, FaBars } from "react-icons/fa";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); 
    navigate("/"); 
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md p-4 flex justify-between items-center z-10">
      <div className="flex items-center">
        <button className="lg:hidden mr-4">
          <FaBars className="text-xl" />
        </button>
        <div className="text-xl font-bold text-blue-600">Loan Assistance System</div>
      </div>
      
      <div className="hidden md:flex items-center px-4 py-2 bg-gray-100 rounded-lg flex-1 max-w-xl mx-8">
        <FaSearch className="text-gray-500 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none w-full text-gray-700"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FaBell className="text-xl text-gray-600" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
        
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FaEnvelope className="text-xl text-gray-600" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">5</span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
          >
            <FaUserCircle className="text-2xl text-gray-600" />
            <span className="hidden md:inline-block">Pradeep Sharma</span>
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Your Profile</a>
              <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
