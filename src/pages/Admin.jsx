import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {

  const [inquiries, setInquiries] = useState([]);

  // FETCH DATA
  const fetchInquiries = async () => {
    try {

      const response = await axios.get(
        "https://smartwayacademy.onrender.com/api/inquiries"
      );

      setInquiries(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  // DELETE INQUIRY
  const deleteInquiry = async (id) => {

    try {

      await axios.delete(
        `https://smartwayacademy.onrender.com/api/inquiries/${id}`
      );

      alert("Inquiry Deleted");

      fetchInquiries();

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">
            SmartWayAcademy Admin
          </h1>

          <div className="bg-blue-600 text-white px-5 py-2 rounded-xl">
            Total Inquiries: {inquiries.length}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-blue-600 text-white">

                <tr>
                  <th className="p-4 text-left">Student Name</th>
                  <th className="p-4 text-left">Class</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-center">Action</th>
                </tr>

              </thead>

              <tbody>

                {inquiries.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-4 font-medium">
                      {item.name}
                    </td>

                    <td className="p-4">
                      {item.studentClass}
                    </td>

                    <td className="p-4">
                      {item.phone}
                    </td>

                    <td className="p-4">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">

                      <button
                        onClick={() => deleteInquiry(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}