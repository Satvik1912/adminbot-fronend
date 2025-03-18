import { useState, useEffect } from "react";
import Chatbot from "../components/Chatbot.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom"; // Make sure react-router is installed

const Dashboard = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Close sidebar when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent back button navigation
  useEffect(() => {
    // Push a new entry to history stack
    window.history.pushState(null, "", window.location.pathname);

    // Listen for popstate events (when back button is pressed)
    const preventNavigation = (e) => {
      // Push another state to prevent going back
      window.history.pushState(null, "", window.location.pathname);
      
      // Optional: Show a message that back navigation is disabled
      // You could replace this with a modal or custom notification
      const confirmMessage = "Navigation is disabled for security reasons.";
      alert(confirmMessage);
    };

    window.addEventListener("popstate", preventNavigation);
    
    return () => {
      window.removeEventListener("popstate", preventNavigation);
    };
  }, [navigate]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`fixed z-30 h-full transition-transform duration-300 transform 
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        lg:relative lg:translate-x-0`}
      >
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen} 
          setIsMobileOpen={setIsMobileSidebarOpen} 
        />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Navbar */}
        <Navbar toggleMobileSidebar={toggleMobileSidebar} />
        
        {/* Page content */}
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Admin Dashboard</h1>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4">Active Loans</h2>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">215</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4">Pending Approvals</h2>
              <p className="text-2xl sm:text-3xl font-bold text-orange-500">42</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4">Total Customers</h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">1,254</p>
            </div>
          </div>
          
          {/* Additional content sections could go here */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="font-medium">New loan application received</p>
                  <p className="text-sm text-gray-500">10 minutes ago</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <p className="font-medium">Loan #12345 approved</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-1">
                  <p className="font-medium">Document verification pending</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition">
                  New Loan
                </button>
                <button className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition">
                  Add Customer
                </button>
                <button className="bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition">
                  Generate Report
                </button>
                <button className="bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition">
                  View Documents
                </button>
              </div>
            </div>
          </div>
          
          {/* Chatbot */}
          <div className="mt-8">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;