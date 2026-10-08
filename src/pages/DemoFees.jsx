import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

export default function DemoFees() {
  const navigate = useNavigate();

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const year = 2026;
  const month = 10;

  const loadFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/api/demo/fees/month/${year}/${month}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFees(response.data.fees || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load demo fees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const getTotalPaid = (fee) => {
    return (fee.payments || []).reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );
  };

  const getPending = (fee) => {
    return Math.max(
      0,
      Number(fee.amountDue || 0) - getTotalPaid(fee)
    );
  };

  const generateDemoReceipt = (fee) => {
  const paid = getTotalPaid(fee);

  if (paid <= 0) {
    alert("No payment has been recorded for this student yet.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("SmartWay Academy", 20, 25);

  doc.setFontSize(14);
  doc.text("FEE PAYMENT RECEIPT", 20, 38);

  doc.setFontSize(11);
  doc.text("DEMO RECEIPT — RECRUITER DEMONSTRATION", 20, 48);

  doc.line(20, 55, 190, 55);

  doc.text(
    `Student: ${fee.student?.studentName || "Demo Student"}`,
    20,
    68
  );

  doc.text(
    `Class: ${fee.student?.className || "-"}`,
    20,
    78
  );

  doc.text(
    `Fee Month: ${String(fee.month).padStart(2, "0")}/${fee.year}`,
    20,
    88
  );

  doc.text(
    `Fee Due: Rs. ${Number(fee.amountDue).toLocaleString("en-IN")}`,
    20,
    100
  );

  doc.text(
    `Total Paid: Rs. ${paid.toLocaleString("en-IN")}`,
    20,
    110
  );

  doc.text(
    `Pending: Rs. ${getPending(fee).toLocaleString("en-IN")}`,
    20,
    120
  );

  doc.text(`Status: ${fee.status}`, 20, 130);

  doc.line(20, 140, 190, 140);

  doc.setFontSize(10);
  doc.text(
    "This receipt is generated from fictional DEMO data.",
    20,
    153
  );

  doc.text(
    "No real student or payment information is involved.",
    20,
    161
  );

  doc.save(
    `SmartWay-DEMO-Receipt-${fee.student?.studentName || "Student"}.pdf`
  );
};

  const filteredFees = useMemo(() => {
    const searchText = search.toLowerCase();

    return fees.filter((fee) => {
      const studentName =
        fee.student?.studentName?.toLowerCase() || "";

      const className =
        fee.student?.className?.toLowerCase() || "";

      return (
        studentName.includes(searchText) ||
        className.includes(searchText)
      );
    });
  }, [fees, search]);

  const totalDue = fees.reduce(
    (sum, fee) => sum + Number(fee.amountDue || 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, fee) => sum + getTotalPaid(fee),
    0
  );

  const totalPending = Math.max(0, totalDue - totalPaid);

  const openPayment = (fee) => {
    const pending = getPending(fee);

    setSelectedFee(fee);
    setPaymentAmount(pending > 0 ? String(pending) : "");
    setPaymentMode("UPI");
    setPaymentNote("");
  };

  const closePayment = () => {
    setSelectedFee(null);
    setPaymentAmount("");
    setPaymentMode("UPI");
    setPaymentNote("");
  };

  const recordPayment = async () => {
    if (!selectedFee) return;

    const amount = Number(paymentAmount);
    const pending = getPending(selectedFee);

    if (!amount || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    if (amount > pending) {
      alert(`Maximum payable amount is ₹${pending}.`);
      return;
    }

    try {
      setPaymentLoading(true);

      await axios.post(
        `http://localhost:5000/api/demo/fees/${selectedFee._id}/payment`,
        {
          amount,
          mode: paymentMode,
          note: paymentNote,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      closePayment();
      await loadFees();

      alert("Demo payment recorded successfully.");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to record demo payment."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              Demo Fees
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              October 2026 · Recruiter Demo
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

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Demo Notice */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
          <p className="font-semibold text-yellow-800">
            DEMO MODE
          </p>

          <p className="text-sm text-yellow-700 mt-1">
            All fee records are fictional recruiter-demo data.
            Payments recorded here do not affect real SmartWay Academy data.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">
              Total Fee
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-2">
              ₹{totalDue.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">
              Collected
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              ₹{totalPaid.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="text-2xl font-bold text-red-600 mt-2">
              ₹{totalPending.toLocaleString("en-IN")}
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <input
            type="text"
            placeholder="Search student or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            Loading demo fees...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
            {error}
          </div>
        )}

        {/* Fee Table */}
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

                    <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                      Due
                    </th>

                    <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                      Paid
                    </th>

                    <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                      Pending
                    </th>

                    <th className="text-center px-5 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {filteredFees.map((fee) => {

                    const paid = getTotalPaid(fee);
                    const pending = getPending(fee);

                    return (
                      <tr
                        key={fee._id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-5 py-4">

                          <div className="font-semibold text-gray-900">
                            {fee.student?.studentName || "Unknown"}
                          </div>

                          <div className="text-xs text-gray-500">
                            DEMO STUDENT
                          </div>

                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {fee.student?.className || "-"}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold">
                          ₹{Number(fee.amountDue).toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4 text-right text-green-700 font-semibold">
                          ₹{paid.toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4 text-right text-red-700 font-semibold">
                          ₹{pending.toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4 text-center">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

                        <td className="px-5 py-4 text-right">

                          <div className="flex justify-end gap-2">
                            {pending > 0 ? (
                                <button
                                onClick={() => openPayment(fee)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                                >
                                Pay Fee
                                </button>
                            ) : (
                                <span className="text-green-600 font-semibold text-sm mr-2">
                                Fully Paid
                                </span>
                            )}

                            {paid > 0 && (
                                <button
                                onClick={() => generateDemoReceipt(fee)}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                                >
                                Receipt
                                </button>
                            )}

                            {paid > 0 && (
  <button
    onClick={async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/demo/fees/${fee._id}/whatsapp`,
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
    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
  >
    WhatsApp
  </button>
)}
                            </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {filteredFees.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No demo fees found.
              </div>
            )}

          </div>
        )}

      </div>

      {/* Payment Modal */}
      {selectedFee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Record Demo Payment
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedFee.student?.studentName}
                </p>
              </div>

              <button
                onClick={closePayment}
                className="text-gray-500 hover:text-gray-900 text-xl"
              >
                ×
              </button>

            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Fee Due
                </span>

                <span className="font-semibold">
                  ₹{Number(selectedFee.amountDue).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-gray-600">
                  Already Paid
                </span>

                <span className="font-semibold text-green-600">
                  ₹{getTotalPaid(selectedFee).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-gray-600">
                  Pending
                </span>

                <span className="font-bold text-red-600">
                  ₹{getPending(selectedFee).toLocaleString("en-IN")}
                </span>
              </div>

            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount Received
            </label>

            <input
              type="number"
              min="1"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Mode
            </label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
            >
              <option>UPI</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Other</option>
            </select>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note
            </label>

            <input
              type="text"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="Optional note"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6"
            />

            <div className="flex gap-3">

              <button
                onClick={closePayment}
                disabled={paymentLoading}
                className="flex-1 border border-gray-300 hover:bg-gray-50 px-4 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={recordPayment}
                disabled={paymentLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold"
              >
                {paymentLoading
                  ? "Recording..."
                  : "Record Payment"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}