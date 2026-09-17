
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [inquiries, setInquiries] = useState([]);
 

  const today = new Date();

const [selectedMonth, setSelectedMonth] = useState(
  today.getMonth() + 1
);

const [selectedYear, setSelectedYear] = useState(
  today.getFullYear()
);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const feeMonth = selectedMonth;
const feeYear = selectedYear;


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsResponse, feesResponse, inquiriesResponse] =
        await Promise.all([
          axios.get(
            "https://smartwayacademy.onrender.com/api/students"
          ),

          axios.get(
            `https://smartwayacademy.onrender.com/api/fees/month/${feeYear}/${feeMonth}`
          ),

          axios.get(
            "https://smartwayacademy.onrender.com/api/inquiries"
          ),
        ]);

      setStudents(studentsResponse.data || []);
      setFees(feesResponse.data?.fees || []);
      setInquiries(inquiriesResponse.data || []);
    } catch (error) {
      console.log(error);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchDashboardData();
}, [selectedMonth, selectedYear]);


  // -----------------------------
  // STUDENT SUMMARY
  // -----------------------------

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status !== "Inactive"
  ).length;

  // -----------------------------
  // FEE SUMMARY
  // -----------------------------

  const totalDue = fees.reduce(
    (sum, fee) => sum + Number(fee.amountDue || 0),
    0
  );

  const totalCollected = fees.reduce(
    (sum, fee) =>
      sum +
      (fee.payments || []).reduce(
        (paymentSum, payment) =>
          paymentSum + Number(payment.amount || 0),
        0
      ),
    0
  );

  const totalPending = totalDue - totalCollected;

  // -----------------------------
  // RECENT PAYMENTS
  // -----------------------------

  const recentPayments = fees
    .flatMap((fee) =>
      (fee.payments || []).map((payment) => ({
        ...payment,
        studentName:
          fee.student?.studentName || "Unknown Student",
        className:
          fee.student?.className || "-",
      }))
    )
    .sort((a, b) => {
      const dateA = new Date(
        a.date || a.paymentDate || 0
      ).getTime();

      const dateB = new Date(
        b.date || b.paymentDate || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  // -----------------------------
  // RECENT INQUIRIES
  // -----------------------------

  const recentInquiries = [...inquiries]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // -----------------------------
  // HELPERS
  // -----------------------------

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";

      case "Contacted":
        return "bg-yellow-100 text-yellow-700";

      case "Interested":
        return "bg-purple-100 text-purple-700";

      case "Admitted":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Admin Dashboard
          </h1>

          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-500">
              Loading dashboard...
            </p>
          </div>

        </div>
      </div>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Admin Dashboard
          </h1>

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <p className="text-red-600 mb-4">
              {error}
            </p>

            <button
              onClick={fetchDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  // -----------------------------
  // DASHBOARD UI
  // -----------------------------

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              SmartWay Academy overview
            </p>
          </div>

          <div className="flex items-center gap-2">

  <select
    value={selectedMonth}
    onChange={(e) =>
      setSelectedMonth(Number(e.target.value))
    }
    className="bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm text-sm font-medium"
  >
    <option value={1}>January</option>
    <option value={2}>February</option>
    <option value={3}>March</option>
    <option value={4}>April</option>
    <option value={5}>May</option>
    <option value={6}>June</option>
    <option value={7}>July</option>
    <option value={8}>August</option>
    <option value={9}>September</option>
    <option value={10}>October</option>
    <option value={11}>November</option>
    <option value={12}>December</option>
  </select>

  <select
    value={selectedYear}
    onChange={(e) =>
      setSelectedYear(Number(e.target.value))
    }
    className="bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm text-sm font-medium"
  >
    <option value={2026}>2026</option>
    <option value={2025}>2025</option>
    <option value={2024}>2024</option>
  </select>

</div>

        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* TOTAL STUDENTS */}

            <Link
            to="/students"
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 hover:shadow-md transition cursor-pointer block"
            >

            <p className="text-sm text-gray-500">
              Total Students
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {totalStudents}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              All registered students
            </p>

          </Link>

          {/* ACTIVE STUDENTS */}

          <Link
            to="/students"
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-md transition cursor-pointer block"
            >

            <p className="text-sm text-gray-500">
              Active Students
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {activeStudents}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Currently active
            </p>

          </Link>

          {/* COLLECTION */}

          <Link
            to={`/admin/fees?month=${selectedMonth}&year=${selectedYear}`}
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-md transition cursor-pointer block"
            >
            <p className="text-sm text-gray-500">
              Monthly Collection
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {formatCurrency(totalCollected)}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(selectedYear, selectedMonth - 1).toLocaleDateString(
                "en-IN",
                {
                    month: "long",
                    year: "numeric",
                }
                )}
            </p>

          </Link>

          {/* PENDING */}

          <Link
            to={`/admin/fees?month=${selectedMonth}&year=${selectedYear}`}
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500 hover:shadow-md transition cursor-pointer block"
            >

            <p className="text-sm text-gray-500">
              Pending Fees
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {formatCurrency(totalPending)}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(selectedYear, selectedMonth - 1).toLocaleDateString(
                "en-IN",
                {
                    month: "long",
                    year: "numeric",
                }
                )}
            </p>

          </Link>

        </div>

                {/* QUICK ACTIONS */}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Link
  to="/students"
  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 text-center font-semibold transition"
>
  ➕ Add Student
</Link>

<Link
  to="/admin/fees"
  className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 text-center font-semibold transition"
>
  💰 Manage Fees
</Link>

<Link
  to="/admin/inquiries"
  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 text-center font-semibold transition"
>
  📋 View Inquiries
</Link>
          </div>

        </div>

        {/* SECOND ROW */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* RECENT PAYMENTS */}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className="p-5 border-b">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Payments
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Latest fee payments
                  </p>
                  <Link
                      to={`/admin/fees?month=${selectedMonth}&year=${selectedYear}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                    View All →
                    </Link>
                </div>

                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {formatCurrency(totalCollected)}
                </div>

              </div>

            </div>

            <div className="overflow-x-auto">

              {recentPayments.length === 0 ? (

                <div className="p-8 text-center text-gray-500">
                  No payments found for this month.
                </div>

              ) : (

                <table className="w-full">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Student
                      </th>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Amount
                      </th>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Mode
                      </th>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {recentPayments.map((payment, index) => (

                      <tr
                        key={`${payment._id || "payment"}-${index}`}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-5 py-4">

                          <p className="font-medium text-gray-800">
                            {payment.studentName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {payment.className}
                          </p>

                        </td>

                        <td className="px-5 py-4 font-semibold text-green-600">
                          {formatCurrency(payment.amount)}
                        </td>

                        <td className="px-5 py-4">

                          <span className="text-sm text-gray-600">
                            {payment.paymentMode || "UPI"}
                          </span>

                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {formatDate( payment.paymentDate
                          )}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

          {/* RECENT INQUIRIES */}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className="p-5 border-b">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Inquiries
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Latest admission leads
                  </p>
                   <Link
                    to="/admin/inquiries"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    View All →
                </Link>
                </div>

                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {inquiries.length} Total
                </div>

              </div>

            </div>

            <div className="overflow-x-auto">

              {recentInquiries.length === 0 ? (

                <div className="p-8 text-center text-gray-500">
                  No inquiries found.
                </div>

              ) : (

                <table className="w-full">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Name
                      </th>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Class
                      </th>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {recentInquiries.map((inquiry) => (

                      <tr
                        key={inquiry._id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-5 py-4">

                          <p className="font-medium text-gray-800">
                            {inquiry.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {inquiry.phone}
                          </p>

                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {inquiry.studentClass || "-"}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                              inquiry.status
                            )}`}
                          >
                            {inquiry.status || "New"}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </div>

        {/* FEE OVERVIEW */}

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-5">
            {new Date(selectedYear, selectedMonth - 1).toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric",
            }
            )} Fee Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="bg-gray-50 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Total Fee Due
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                {formatCurrency(totalDue)}
              </p>

            </div>

            <div className="bg-green-50 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Collected
              </p>

              <p className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(totalCollected)}
              </p>

            </div>

            <div className="bg-red-50 rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(totalPending)}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}