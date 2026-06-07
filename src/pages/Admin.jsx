import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {

  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");

  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((item) => item.status === "New").length;
  const contactedLeads = inquiries.filter((item) => item.status === "Contacted").length;
  const interestedLeads= inquiries.filter((item) => item.status === "Interested").length;
  const admittedLeads = inquiries.filter((item) => item.status === "Admitted").length;




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

  //UPDATE Status
        const updateStatus = async (id, status) => {
        try {
            await axios.put(
            `https://smartwayacademy.onrender.com/api/inquiries/${id}`,
            { status }
            );

            fetchInquiries();

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

const filteredInquiries = inquiries.filter((item) => {
  return (
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.phone.includes(search)
  );
});



  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">
            SmartWayAcademy Admin
          </h1>

          <div className="flex justify-between items-center mb-6">
            <input
                type="text"
                placeholder="Search by Name or Phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-3 rounded-lg w-80"
            />
            </div>

          <div className="bg-blue-600 text-white px-5 py-2 rounded-xl">
            Total Inquiries: {inquiries.length}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

  <div className="bg-blue-600 text-white p-5 rounded-xl shadow">
    <h3 className="text-sm">Total Leads</h3>
    <p className="text-3xl font-bold">{totalLeads}</p>
  </div>

  <div className="bg-yellow-500 text-white p-5 rounded-xl shadow">
    <h3 className="text-sm">New</h3>
    <p className="text-3xl font-bold">{newLeads}</p>
  </div>

  <div className="bg-purple-500 text-white p-5 rounded-xl shadow">
    <h3 className="text-sm">Contacted</h3>
    <p className="text-3xl font-bold">{contactedLeads}</p>
  </div>

  <div className="bg-green-500 text-white p-5 rounded-xl shadow">
    <h3 className="text-sm">Interested</h3>
    <p className="text-3xl font-bold">{interestedLeads}</p>
  </div>

  <div className="bg-emerald-700 text-white p-5 rounded-xl shadow">
    <h3 className="text-sm">Admitted</h3>
    <p className="text-3xl font-bold">{admittedLeads}</p>
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
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">WhatsApp</th>
                  <th className="p-4 text-center">Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredInquiries.map((item) => (

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

                    <td>
                    <select
                        value={item.status}
                        onChange={(e) =>
                        updateStatus(item._id, e.target.value)
                        }
                        className="border p-2 rounded"
                    >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Not Interested">Not Interested</option>
                    </select>
                    </td>

                    <td className="p-4 text-center"> 
                        <a 
                         href={`https://wa.me/91${item.phone}`}
                         target="_blank"
                         rel="noreferrer"
                         className="bg-green-500 text-white px-3 py-2 rounded-lg"
                         >WhatsApp</a>
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