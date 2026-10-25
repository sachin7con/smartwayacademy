
import { useLocation, useNavigate } from "react-router-dom";

export default function DemoNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/demo", color: "bg-blue-600" },
    { label: "Students", path: "/demo/students", color: "bg-blue-600" },
    { label: "Fees", path: "/demo/fees", color: "bg-green-600" },
    { label: "Inquiries", path: "/demo/inquiries", color: "bg-purple-600" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/demo")}
            className="self-start text-lg sm:text-xl font-bold text-left"
          >
            SmartWay Academy
            <span className="text-yellow-400 ml-2 text-sm">DEMO</span>
          </button>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                  isActive(item.path)
                    ? `${item.color} text-white`
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm sm:text-base font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
