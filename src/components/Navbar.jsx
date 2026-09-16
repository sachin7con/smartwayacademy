import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-700"
        >
          SmartWayAcademy
        </Link>

        <ul className="hidden md:flex gap-8 font-medium">
          <li>
            <a href="/#courses" className="hover:text-blue-600">
              Courses
            </a>
          </li>

          <li>
            <a href="/#results" className="hover:text-blue-600">
              Results
            </a>
          </li>

          <li>
            <a href="/#contact" className="hover:text-blue-600">
              Contact
            </a>
          </li>

          <li>
            <Link
              to="/login"
              className="hover:text-blue-600"
            >
              Login
            </Link>
          </li>
        </ul>

        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
        >
          Admin Login
        </Link>

      </div>
    </nav>
  );
}

export function AdminNavbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/admin"
          className="text-2xl font-bold text-blue-700"
        >
          SmartWayAcademy
        </Link>

        <div className="hidden md:flex items-center gap-3">

          <Link
            to="/admin"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700"
          >
            Dashboard
          </Link>

          <Link
            to="/students"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700"
          >
            Students
          </Link>

          <Link
            to="/admin/fees"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700"
          >
            Fees
          </Link>

          <Link
            to="/admin/inquiries"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700"
          >
          Inquiries
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}