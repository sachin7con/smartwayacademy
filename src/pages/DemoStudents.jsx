import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DemoStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
  "http://localhost:5000/api/demo/students",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      setStudents(response.data.students || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load demo students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id, studentName) => {
    const confirmed = window.confirm(
      `Delete demo student "${studentName}"?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
  `http://localhost:5000/api/demo/students/${id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      setStudents((currentStudents) =>
        currentStudents.filter((student) => student._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Unable to delete demo student.");
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.studentName?.toLowerCase().includes(searchText) ||
      student.className?.toLowerCase().includes(searchText) ||
      student.fatherName?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              Demo Students
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              SmartWay Academy — Recruiter Demo
            </p>
          </div>

          <button
            onClick={() => navigate("/demo")}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
          >
            ← Dashboard
          </button>

        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Demo Notice */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
          <p className="font-semibold text-yellow-800">
            DEMO MODE
          </p>

          <p className="text-sm text-yellow-700 mt-1">
            All students shown here are fictional recruiter-demo data.
            No real student information is displayed.
          </p>
        </div>

        {/* Search + Count */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <input
              type="text"
              placeholder="Search student, class or father name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filteredStudents.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {students.length}
              </span>{" "}
              demo students
            </div>

          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            Loading demo students...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
            {error}
          </div>
        )}

        {/* Students Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">
                  <tr>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Class
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Father Name
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Monthly Fee
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredStudents.map((student) => (

                    <tr
                      key={student._id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-5 py-4">

                        <div className="font-semibold text-gray-900">
                          {student.studentName}
                        </div>

                        <div className="text-xs text-gray-500">
                          DEMO STUDENT
                        </div>

                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {student.className}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {student.fatherName || "-"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ₹{student.monthlyFee?.toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {student.status}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                        onClick={async () => {
                          try {
                            const response = await axios.post(
                              `http://localhost:5000/api/demo/students/${student._id}/whatsapp`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              }
                            );

                            if (response.data.success && response.data.whatsappUrl) {
                              window.open(response.data.whatsappUrl, "_blank");
                            }
                          } catch (err) {
                            console.error(err);

                            alert(
                              err.response?.data?.message ||
                                "Unable to open Demo WhatsApp."
                            );
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        WhatsApp
                      </button>

                          <button
                          onClick={() =>
                            alert(
                              "Demo Mode: Delete is disabled for recruiter demonstrations. Demo data is intentionally preserved so the complete workflow remains available."
                            )
                          }
                          className="bg-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm cursor-not-allowed"
                        >
                          Delete Disabled
                        </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No demo students found.
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}