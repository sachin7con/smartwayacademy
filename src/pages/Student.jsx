import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function Student() {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    studentName: "",
    className: "",
    fatherName: "",
    phone: "",
    monthlyFee: "",
    paidFee: "",
  });

  const totalCollection = students.reduce(
  (sum, s) => sum + Number(s.paidFee || 0),
  0
);

const totalPending = students.reduce(
  (sum, s) =>
    sum +
    (Number(s.monthlyFee || 0) -
      Number(s.paidFee || 0)),
  0
);

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "https://smartwayacademy.onrender.com/api/students"
      );

      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://smartwayacademy.onrender.com/api/students",
        formData
      );

      alert("Student Added Successfully");

      setFormData({
        studentName: "",
        className: "",
        fatherName: "",
        phone: "",
        monthlyFee: "",
        paidFee: "",
      });

      fetchStudents();

    } catch (error) {
      console.log(error);
    }
  };

  // Delete Student
  const deleteStudent = async (id) => {
    try {
      await axios.delete(
        `https://smartwayacademy.onrender.com/api/students/${id}`
      );

      alert("Student Deleted");

      fetchStudents();

    } catch (error) {
      console.log(error);
    }
  };

  const payFee = async (id) => {
  const amount = prompt("Enter fee amount");

  if (!amount) return;

  try {
    await axios.put(
      `https://smartwayacademy.onrender.com/api/students/pay/${id}`,
      {
        amount: Number(amount),
      }
    );

    alert("Fee Updated Successfully");

    fetchStudents();

  } catch (error) {
    console.log(error);
  }
};

const generateReceipt = (student) => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    "SmartWay Academy Fee Receipt",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Student: ${student.studentName}`,
    20,
    40
  );

  doc.text(
    `Class: ${student.className}`,
    20,
    50
  );

  doc.text(
    `Phone: ${student.phone}`,
    20,
    60
  );

  doc.text(
    `Paid Fee: ₹${student.paidFee}`,
    20,
    70
  );

  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    20,
    80
  );

  doc.save(
    `${student.studentName}-receipt.pdf`
  );
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          Student Management
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-blue-600 text-white p-5 rounded-xl">
          <h3>Total Students</h3>
          <p className="text-3xl font-bold">
            {students.length}
          </p>
        </div>

        <div className="bg-green-600 text-white p-5 rounded-xl">
          <h3>Total Collection</h3>
          <p className="text-3xl font-bold">
            ₹{totalCollection}
          </p>
        </div>

        <div className="bg-red-600 text-white p-5 rounded-xl">
          <h3>Pending Fee</h3>
          <p className="text-3xl font-bold">
            ₹{totalPending}
          </p>
        </div>

      </div>

        {/* Add Student Form */}

        <div className="bg-white p-6 rounded-2xl shadow mb-10">

          <h2 className="text-2xl font-bold mb-4">
            Add New Student
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-3 gap-4"
          >

            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="className"
              placeholder="Class"
              value={formData.className}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="fatherName"
              placeholder="Father Name"
              value={formData.fatherName}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="monthlyFee"
              placeholder="Monthly Fee"
              value={formData.monthlyFee}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="paidFee"
              placeholder="Paid Fee"
              value={formData.paidFee}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Add Student
            </button>

          </form>

        </div>

        {/* Student Table */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Father</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Monthly Fee</th>
                <th className="p-4 text-left">Paid</th>
                <th className="p-4 text-left">Pending</th>
                <th className="p-4 text-center">
                  Reminder
                </th>
                <th className="p-4 text-center">
                  Receipt
                </th>
                <th className="p-4 text-center">
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {students.map((student) => {

                const pendingFee =
                  Number(student.monthlyFee) -
                  Number(student.paidFee);

                return (
                  <tr
                    key={student._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {student.studentName}
                    </td>

                    <td className="p-4">
                      {student.fatherName}
                    </td>

                    <td className="p-4">
                      {student.className}
                    </td>

                    <td className="p-4">
                      {student.phone}
                    </td>

                    <td className="p-4">
                      ₹{student.monthlyFee}
                    </td>

                    <td className="p-4 text-green-600 font-bold">
                      ₹{student.paidFee}
                    </td>

                    <td className="p-4 text-red-600 font-bold">
                      ₹{pendingFee}
                    </td>

                    <td className="p-4 text-center">

                      <button
                        onClick={() => payFee(student._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
                      >
                        Pay Fee
                      </button>

                      <td className="p-4 text-center">

                      <a
                        href={`https://wa.me/91${student.phone}?text=Dear Parent, Fee Pending for ${student.studentName}. Kindly pay soon.`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                      >
                        Reminder
                      </a>

                    </td>

                    <td className="p-4 text-center">

                    <button
                      onClick={() =>
                        generateReceipt(student)
                      }
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                    >
                      Receipt
                    </button>

                  </td>

                      <button
                        onClick={() => deleteStudent(student._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </td>

                    <td>

                    <button
                      onClick={() => payFee(student._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Pay Fee
                    </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}