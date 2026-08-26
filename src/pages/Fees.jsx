import { useEffect, useState } from "react";
import axios from "axios";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [historyFee, setHistoryFee] = useState(null);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [paymentNote, setPaymentNote] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);

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

  const openPaymentForm = (fee) =>{
    const paid = (fee.payments || [] ).reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    
    const pending = Number(fee.amountDue || 0) - paid;
    
    setSelectedFee({
      ...fee,
      pending,
    });

    setPaymentAmount("");
    setPaymentMode("UPI");
    setPaymentNote("");
    setShowPaymentForm(true);

  };

  const openPaymentHistory = (fee) =>{
      setHistoryFee(fee);
      setShowPaymentHistory(true);
    }
  
  const handlePayment = async(e) =>{
    e.preventDefault();

    const amount = Number(paymentAmount);

    if(!amount || amount<=0){
      alert("Please enter a valid payment amount");
      return;
    }

    if(amount > selectedFee.pending ){
      alert(`Maximum payment allowed is ${selectedFee.pending}`);
     return;
    }

    try{
      setPaymentLoading(true);

      const response = await axios.put(
        `https://smartwayacademy.onrender.com/api/fees/pay/${selectedFee._id}`,
        {
          amount,
          paymentMode,
          note: paymentNote,
        }
      );

      if(response.data.success){
        alert("payment recorded successfully");

        setShowPaymentForm(false);
        setSelectedFee(null);

        await fetchFees();
      }


    }catch(error) {
      console.error("Payment  error: ", error);

      alert(
        error.response?.data?.message || "Failed to record payment"
      );
    } finally {
      setPaymentLoading(false);
    }

  };


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

                  <th className="p-4 text-center">Action</th>

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

                      <td className="p-4 text-center">
                    {fee.status !== "Paid" ? (
                      <button
                        onClick={() => openPaymentForm(fee)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Pay Fee
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Paid
                      </span>
                    )}
                     
                     {(fee.payments || []).length >0 && (
                      <button onClick={() => openPaymentHistory(fee)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >History</button>
                     )}


                  </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

          {/* Payment Form */}
{showPaymentForm && selectedFee && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Pay Fee
      </h2>

      <div className="bg-gray-100 rounded-lg p-4 mb-5">

        <p>
          <strong>Student:</strong>{" "}
          {selectedFee.student?.studentName}
        </p>

        <p>
          <strong>Fee Due:</strong>{" "}
          ₹{selectedFee.amountDue}
        </p>

        <p>
          <strong>Pending:</strong>{" "}
          ₹{selectedFee.pending}
        </p>

      </div>

      <form onSubmit={handlePayment}>

        <label className="block mb-2 font-semibold">
          Payment Amount
        </label>

        <input
          type="number"
          min="1"
          max={selectedFee.pending}
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Enter amount"
          required
        />

        <label className="block mb-2 font-semibold">
          Payment Mode
        </label>

        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">
            Bank Transfer
          </option>
          <option value="Other">Other</option>
        </select>

        <label className="block mb-2 font-semibold">
          Note
        </label>

        <textarea
          value={paymentNote}
          onChange={(e) => setPaymentNote(e.target.value)}
          className="w-full border p-3 rounded-lg mb-5"
          placeholder="Optional note"
          rows="3"
        />

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => {
              setShowPaymentForm(false);
              setSelectedFee(null);
            }}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={paymentLoading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {paymentLoading ? "Saving..." : "Pay Fee"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}

{/* Payment History Modal */}
{showPaymentHistory && historyFee && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <div>
          <h2 className="text-2xl font-bold text-blue-700">
            Payment History
          </h2>

          <p className="text-gray-600 mt-1">
            {historyFee.student?.studentName} —{" "}
            {historyFee.month}/{historyFee.year}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowPaymentHistory(false);
            setHistoryFee(null);
          }}
          className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">

        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Fee Due
          </p>
          <p className="text-xl font-bold">
            ₹{historyFee.amountDue}
          </p>
        </div>

        <div className="bg-green-100 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Total Paid
          </p>

          <p className="text-xl font-bold text-green-700">
            ₹
            {(historyFee.payments || []).reduce(
              (sum, payment) =>
                sum + Number(payment.amount || 0),
              0
            )}
          </p>
        </div>

        <div className="bg-red-100 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="text-xl font-bold text-red-700">
            ₹
            {Number(historyFee.amountDue || 0) -
              (historyFee.payments || []).reduce(
                (sum, payment) =>
                  sum + Number(payment.amount || 0),
                0
              )}
          </p>
        </div>

      </div>

      {/* Payment List */}
      <div className="border rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Mode
              </th>

              <th className="p-3 text-left">
                Note
              </th>
            </tr>

          </thead>

          <tbody>

            {(historyFee.payments || []).map(
              (payment) => (

                <tr
                  key={payment._id}
                  className="border-b"
                >

                  <td className="p-3">
                    {new Date(
                      payment.paymentDate
                    ).toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-3 font-bold text-green-600">
                    ₹{payment.amount}
                  </td>

                  <td className="p-3">
                    {payment.paymentMode}
                  </td>

                  <td className="p-3">
                    {payment.note || "-"}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* Close */}
      <div className="flex justify-end mt-5">

        <button
          type="button"
          onClick={() => {
            setShowPaymentHistory(false);
            setHistoryFee(null);
          }}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}

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