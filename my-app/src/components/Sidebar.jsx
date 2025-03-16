import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUser, 
  FaMoneyBillWave, 
  FaUsers, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaQuestionCircle,
  FaFileAlt
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/loans", name: "Loan Management", icon: <FaMoneyBillWave /> },
    { path: "/customers", name: "Customers", icon: <FaUsers /> },
    { path: "/reports", name: "Reports", icon: <FaChartLine /> },
    { path: "/documents", name: "Documents", icon: <FaFileAlt /> },
    { path: "/settings", name: "Settings", icon: <FaCog /> },
    { path: "/help", name: "Help & Support", icon: <FaQuestionCircle /> }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Remove token from storage
    navigate("/"); // Redirect to home page
  };

  return (
    <div 
      className={`h-screen bg-gray-800 text-white fixed transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex justify-between items-center p-5 border-b border-gray-700">
        <h1 className={`text-xl font-bold ${!isOpen && "hidden"}`}>Loan System</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="bg-blue-500 p-3 rounded-lg">
            <FaUser className="text-white text-xl" />
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          )}
        </div>

        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-md p-3 transition duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`absolute bottom-0 w-full p-4 border-t border-gray-700 ${!isOpen && "text-center"}`}>
        <button
          onClick={handleLogout}
          className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md transition duration-200 w-full"
        >
          <FaSignOutAlt />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
