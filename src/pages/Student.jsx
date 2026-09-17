import { useEffect, useState } from "react";
import axios from "axios";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

const [formData, setFormData] = useState({
      studentName: "",
      className: "",
      fatherName: "",
      phone: "",
      monthlyFee: "",
      admissionDate: new Date().toISOString().split("T")[0],
    });
  
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
      admissionDate: new Date().toISOString().split("T")[0],
    });
      fetchStudents();

    } catch (error) {
      console.log(error);
    }
  };

 // Edit Student
const editStudent = (student) => {
  setEditingStudent(student._id);

  setFormData({
  studentName: student.studentName || "",
  className: student.className || "",
  fatherName: student.fatherName || "",
  phone: student.phone || "",
  monthlyFee: student.monthlyFee || "",
  admissionDate: student.admissionDate
    ? new Date(student.admissionDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
});

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleUpdateStudent = async (e) => {
  e.preventDefault();

  try {
    await axios.put(
      `https://smartwayacademy.onrender.com/api/students/${editingStudent}`,
      formData
    );

    alert("Student Updated Successfully");

    setEditingStudent(null);

    setFormData({
    studentName: "",
    className: "",
    fatherName: "",
    phone: "",
    monthlyFee: "",
    admissionDate: new Date().toISOString().split("T")[0],
  });

    fetchStudents();
  } catch (error) {
    console.log(error);
    alert("Failed to update student");
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

      

      </div>

        {/* Add Student Form */}

        <div className="bg-white p-6 rounded-2xl shadow mb-10">

          <h2 className="text-2xl font-bold mb-4">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h2>

          <form
            onSubmit={editingStudent ? handleUpdateStudent : handleSubmit}
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
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                  required
                />

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              {editingStudent ? "Update Student" : "Add Student"}
            </button>

            {editingStudent && (
  <button
    type="button"
    onClick={() => {
      setEditingStudent(null);

      setFormData({
        studentName: "",
        className: "",
        fatherName: "",
        phone: "",
        monthlyFee: "",
        admissionDate: new Date().toISOString().split("T")[0],
      });
    }}
    className="bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
  >
    Cancel
  </button>
)}

          </form>

        </div>

        {/* Student Table */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-4 text-center">#</th>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Parent</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Join Date</th>
                <th className="p-4 text-left">Monthly Fee</th>
                <th className="p-4 text-center">
                  Reminder
                </th>
                
                <th className="p-4 text-center">
                  Action
                </th>
              </tr>

            </thead>

            <tbody>
  {students.map((student, index) => {
    

    return (
      <tr
        key={student._id}
        className="border-b hover:bg-gray-50"
      >
        <td className="p-4 text-center">
          {index + 1}
        </td>
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

        <td>
          { student.admissionDate ? 
            new Date(student.admissionDate).toLocaleDateString("en-IN")
            : "-"
           }
        </td>

        <td className="p-4">
          ₹{student.monthlyFee}
        </td>

        
        {/* Reminder */}
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

        

        {/* Actions */}
        <td className="p-4">
  <div className="flex gap-2 justify-center flex-wrap">

    <button
      onClick={() => editStudent(student)}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      Edit
    </button>

  

    <button
      onClick={() => deleteStudent(student._id)}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      Delete
    </button>

  </div>
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