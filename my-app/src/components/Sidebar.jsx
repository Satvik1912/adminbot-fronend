import { useState, useEffect } from "react";
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

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, setIsMobileOpen]);

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
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
      isCollapsed ? "lg:w-20" : "lg:w-64"
    } w-64`}>
      <div className="flex justify-between items-center p-5 border-b border-gray-700">
        <h1 className={`text-xl font-bold ${isCollapsed && "lg:hidden"}`}>Loan System</h1>
        <div className="flex">
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="text-white lg:hidden mr-2"
          >
            <FaTimes />
          </button>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="text-white hidden lg:block"
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
      </div>

      <div className="p-4 flex-grow overflow-y-auto">
        <div className="flex items-center mb-6">
          <div className="bg-blue-500 p-3 rounded-lg">
            <FaUser className="text-white text-xl" />
          </div>
          {!isCollapsed && (
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
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`p-4 border-t border-gray-700 ${isCollapsed && "lg:text-center"}`}>
        <button
          onClick={handleLogout}
          className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md transition duration-200 w-full"
        >
          <FaSignOutAlt />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;