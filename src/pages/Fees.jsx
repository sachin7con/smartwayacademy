import { useEffect, useState } from "react";
import axios from "axios";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState(8);
  const [year, setYear] = useState(2026);

  const fetchFees = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://smartwayacademy.onrender.com/api/fees/month/${year}/${month}`
      );

      setFees(response.data.fees || []);
    } catch (error) {
      console.log("Fee fetch error:", error);
      alert("Failed to fetch fee records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [month, year]);

  // Calculate totals
  const totalStudents = fees.length;

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-blue-700">
              Fee Management
            </h1>

            <p className="text-gray-600 mt-2">
              Manage monthly student fees
            </p>
          </div>

          {/* Month / Year */}
          <div className="flex gap-3">

            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border bg-white p-3 rounded-lg"
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
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border bg-white p-3 rounded-lg"
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
            </select>

          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-blue-600 text-white p-5 rounded-xl shadow">
            <h3 className="text-sm">
              Total Students
            </h3>

            <p className="text-3xl font-bold">
              {totalStudents}
            </p>
          </div>

          <div className="bg-yellow-500 text-white p-5 rounded-xl shadow">
            <h3 className="text-sm">
              Total Fee
            </h3>

            <p className="text-3xl font-bold">
  ₹{totalDue}
</p>
          </div>

          <div className="bg-green-600 text-white p-5 rounded-xl shadow">
            <h3 className="text-sm">
              Collected
            </h3>

            <p className="text-3xl font-bold">
  ₹{totalCollected}
</p>
          </div>

          <div className="bg-red-600 text-white p-5 rounded-xl shadow">
            <h3 className="text-sm">
              Pending
            </h3>

            <p className="text-3xl font-bold">
  ₹{totalPending}
</p>
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white p-6 rounded-xl shadow mb-6 text-center">
            Loading fee records...
          </div>
        )}

        {/* Fee Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-blue-600 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Student
                  </th>

                  <th className="p-4 text-left">
                    Class
                  </th>

                  <th className="p-4 text-left">
                    Father
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Fee Due
                  </th>

                  <th className="p-4 text-left">
                    Paid
                  </th>

                  <th className="p-4 text-left">
                    Pending
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {fees.map((fee) => {

                  const paid = (fee.payments || []).reduce(
                    (sum, payment) =>
                      sum + Number(payment.amount || 0),
                    0
                  );

                  const pending =
                    Number(fee.amountDue || 0) - paid;

                  return (
                    <tr
                      key={fee._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium">
                        {fee.student?.studentName}
                      </td>

                      <td className="p-4">
                        {fee.student?.className}
                      </td>

                      <td className="p-4">
                        {fee.student?.fatherName || "-"}
                      </td>

                      <td className="p-4">
                        {fee.student?.phone}
                      </td>

                      <td className="p-4 font-semibold">
  ₹{fee.amountDue}
</td>

                      <td className="p-4 text-green-600 font-bold">
  ₹{paid}
</td>

                      <td className="p-4 text-red-600 font-bold">
                        ₹{pending}
                      </td>

                      <td className="p-4 text-center">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            fee.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : fee.status === "Partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {fee.status}
                        </span>

                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

          {/* No Records */}
          {!loading && fees.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No fee records found for this month.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}