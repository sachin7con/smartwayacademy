import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DemoInquiries() {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadInquiries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/demo/inquiries",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setInquiries(response.data.inquiries);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load demo inquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const updateInquiry = async (id, status) => {
    
  try {
    setUpdatingId(id);

    const response = await axios.put(
      `http://localhost:5000/api/demo/inquiries/${id}`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      setInquiries((current) =>
        current.map((item) =>
          item._id === id
            ? { ...item, status: response.data.inquiry.status }
            : item
        )
      );
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "Unable to update demo inquiry."
    );
  } finally {
    setUpdatingId(null);
  }
};

const updateRemarks = async (id, remarks) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/demo/inquiries/${id}`,
      {
        remarks,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      setInquiries((current) =>
        current.map((item) =>
          item._id === id
            ? {
                ...item,
                remarks: response.data.inquiry.remarks,
              }
            : item
        )
      );
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "Unable to update demo remarks."
    );
  }
};


const filteredInquiries = inquiries.filter((inquiry) => {
  const searchText = search.toLowerCase();

  return (
    inquiry.studentName?.toLowerCase().includes(searchText) ||
    inquiry.parentName?.toLowerCase().includes(searchText) ||
    inquiry.className?.toLowerCase().includes(searchText) ||
    inquiry.course?.toLowerCase().includes(searchText) ||
    inquiry.status?.toLowerCase().includes(searchText)
  );
});


  const getStatusClass = (status) => {
    if (status === "New") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Contacted") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Interested") {
      return "bg-purple-100 text-purple-700";
    }

    if (status === "Admitted") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Demo Inquiries
            </h1>

            <p className="text-gray-500 mt-1">
              Recruiter demonstration — fictional inquiry data
            </p>
          </div>

          <button
            onClick={() => navigate("/demo")}
            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Back to Demo
          </button>
        </div>

        {/* Demo Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 font-semibold">
            DEMO MODE
          </p>

          <p className="text-yellow-700 text-sm mt-1">
            These inquiries are fictional and are used only to
            demonstrate the SmartWay Academy CRM workflow.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Total Inquiries
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {inquiries.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              New
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {inquiries.filter((item) => item.status === "New").length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Interested
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-2">
              {
                inquiries.filter(
                  (item) => item.status === "Interested"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Admitted
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {
                inquiries.filter(
                  (item) => item.status === "Admitted"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Search */}
<div className="bg-white rounded-xl shadow p-5 mb-6">
  <input
    type="text"
    placeholder="Search student, parent, class, course or status..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-3 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading demo inquiries...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No demo inquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Parent
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Class
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Course
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Source
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                      Remarks
                    </th>
                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredInquiries.map((inquiry) => (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800">
                          {inquiry.studentName}
                        </div>

                        <div className="text-sm text-gray-500">
                          {inquiry.phone}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {inquiry.parentName}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {inquiry.className}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {inquiry.course || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {inquiry.source}
                      </td>

                      <td className="px-5 py-4">
                        <select
                            value={inquiry.status}
                            disabled={updatingId === inquiry._id}
                            onChange={(e) =>
                            updateInquiry(inquiry._id, e.target.value)
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-semibold border ${getStatusClass(
                            inquiry.status
                            )}`}
                        >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Interested">Interested</option>
                            <option value="Admitted">Admitted</option>
                        </select>
                        </td>

                      <td className="px-5 py-4">
                      <input
                        type="text"
                        defaultValue={inquiry.remarks || ""}
                        placeholder="Add follow-up remark..."
                        onBlur={(e) =>
                          updateRemarks(inquiry._id, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                      <td className="px-5 py-4">
  <button
    onClick={async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/demo/inquiries/${inquiry._id}/whatsapp`,
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
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Unable to open Demo WhatsApp."
        );
      }
    }}
    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
  >
    WhatsApp
  </button>
</td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}