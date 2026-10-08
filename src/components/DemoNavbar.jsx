import { useLocation, useNavigate } from "react-router-dom";

export default function DemoNavbar() {
  const navigate = useNavigate();

  const location = useLocation();

const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate("/demo")}
          className="text-xl font-bold"
        >
          SmartWay Academy
          <span className="text-yellow-400 ml-2 text-sm">
            DEMO
          </span>
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/demo")}
            className="px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/demo/students")}
            className={`px-4 py-2 rounded-lg transition ${
            isActive("/demo/students")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-800 text-gray-300"
          }`}
            >
            Students                                                            
            </button>

          <button
            onClick={() => navigate("/demo/fees")}
            className={`px-4 py-2 rounded-lg transition ${
            isActive("/demo/fees")
              ? "bg-green-600 text-white"
              : "hover:bg-gray-800 text-gray-300"
          }`}
            >
            Fees
            </button>

          <button
            onClick={() => navigate("/demo/inquiries")}
            className={`px-4 py-2 rounded-lg transition ${
            isActive("/demo/inquiries")
              ? "bg-purple-600 text-white"
              : "hover:bg-gray-800 text-gray-300"
          }`}
            >
            Inquiries
            </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}