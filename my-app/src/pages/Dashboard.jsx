// Dashboard.jsx
import Chatbot from "../components/Chatbot.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";


const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <div className="p-8 w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Loans</h2>
              <p className="text-3xl font-bold text-blue-600">215</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Pending Approvals</h2>
              <p className="text-3xl font-bold text-orange-500">42</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Customers</h2>
              <p className="text-3xl font-bold text-green-600">1,254</p>
            </div>
          </div>
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;