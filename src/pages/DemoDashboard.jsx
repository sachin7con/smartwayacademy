import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DemoNavbar from "../components/DemoNavbar";

export default function DemoDashboard() {
          const [demoStudents, setDemoStudents] = useState([]);
          const [demoFees, setDemoFees] = useState([]);
          const [demoInquiries, setDemoInquiries] = useState([]);
          const [loading, setLoading] = useState(true);
          const navigate = useNavigate();

        useEffect(() => {
    const loadDemoDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [studentsResponse, feesResponse, inquiriesResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/demo/students",
              { headers }
            ),

            axios.get(
              "http://localhost:5000/api/demo/fees/month/2026/10",
              { headers }
            ),

            axios.get(
              "http://localhost:5000/api/demo/inquiries",
              { headers }
            ),
          ]);

        if (studentsResponse.data.success) {
          setDemoStudents(studentsResponse.data.students || []);
        }

        if (feesResponse.data.success) {
          setDemoFees(feesResponse.data.fees || []);
        }

        if (inquiriesResponse.data.success) {
          setDemoInquiries(
            inquiriesResponse.data.inquiries || []
          );
        }
      } catch (error) {
        console.error(
          "Unable to load demo dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDemoDashboard();
  }, []);

    const totalStudents = demoStudents.length;

  const totalCollected = demoFees.reduce(
    (total, fee) =>
      total +
      (fee.payments || []).reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
      ),
    0
  );

  const totalPending = demoFees.reduce(
    (total, fee) => {
      const paid = (fee.payments || []).reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
      );

      return total + Math.max(0, Number(fee.amountDue || 0) - paid);
    },
    0
  );

  const totalDue = totalCollected + totalPending;


  const paidFees = demoFees.filter(
  (fee) => fee.status === "Paid"
).length;

const partialFees = demoFees.filter(
  (fee) => fee.status === "Partial"
).length;

const dueFees = demoFees.filter(
  (fee) => fee.status === "Due"
).length;

  const totalInquiries = demoInquiries.length;

  const newInquiries = demoInquiries.filter(
  (inquiry) => inquiry.status === "New"
).length;

const contactedInquiries = demoInquiries.filter(
  (inquiry) => inquiry.status === "Contacted"
).length;

const interestedInquiries = demoInquiries.filter(
  (inquiry) => inquiry.status === "Interested"
).length;

const admittedInquiries = demoInquiries.filter(
  (inquiry) => inquiry.status === "Admitted"
).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <DemoNavbar />

      <div className="max-w-7xl mx-auto">
                    
        {/* Recruiter Demo Banner */}
<div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
          RECRUITER DEMO
        </span>

        <span className="text-gray-400 text-sm">
          SmartWay Academy
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold">
        Student Management System
      </h1>

      <p className="text-gray-300 mt-2 max-w-2xl">
        A working MERN-based education management application demonstrating
        student management, fee collection, CRM inquiries, payments,
        receipts and WhatsApp workflows.
      </p>
    </div>

    <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4 min-w-[190px]">
      <p className="text-gray-400 text-xs uppercase tracking-wide">
        Environment
      </p>

      <p className="text-lg font-bold text-yellow-300 mt-1">
        Fictional Demo Data
      </p>

      <p className="text-gray-400 text-xs mt-1">
        No real student records
      </p>
    </div>

  </div>

</div>

        {/* Dashboard Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            Demo Dashboard
          </h2>

          <p className="text-gray-600">
            Explore the SmartWay Academy student-management system using
            sample data.
          </p>

        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Demo Students</p>
            <h3 className="text-3xl font-bold text-blue-700 mt-2">
              {loading ? "..." : totalStudents}
                         </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Monthly Collection</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {loading ? "..." : `₹${totalCollected.toLocaleString("en-IN")}`}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Pending Fees</p>
            <h3 className="text-3xl font-bold text-red-600 mt-2">
              {loading ? "..." : `₹${totalPending.toLocaleString("en-IN")}`}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Demo Inquiries</p>
            <h3 className="text-3xl font-bold text-purple-600 mt-2">
              {loading ? "..." : totalInquiries}
            </h3>
          </div>

        </div>

         {/* Inquiry Pipeline */}
<div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">
        Inquiry Pipeline
      </h2>

      <p className="text-gray-500 mt-1">
        Track demo leads from first inquiry through admission.
      </p>
    </div>

    <span className="mt-3 md:mt-0 text-sm font-semibold text-gray-500">
      CRM Workflow
    </span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

    {/* New */}
    <div className="border border-blue-200 bg-blue-50 rounded-2xl p-5">
      <p className="text-blue-700 text-sm font-semibold">
        New Leads
      </p>

      <p className="text-3xl font-bold text-blue-700 mt-2">
        {loading ? "..." : newInquiries}
      </p>

      <p className="text-sm text-blue-600 mt-1">
        New inquiries received
      </p>
    </div>

    {/* Contacted */}
    <div className="border border-yellow-200 bg-yellow-50 rounded-2xl p-5">
      <p className="text-yellow-700 text-sm font-semibold">
        Contacted
      </p>

      <p className="text-3xl font-bold text-yellow-700 mt-2">
        {loading ? "..." : contactedInquiries}
      </p>

      <p className="text-sm text-yellow-600 mt-1">
        Follow-up in progress
      </p>
    </div>

    {/* Interested */}
    <div className="border border-purple-200 bg-purple-50 rounded-2xl p-5">
      <p className="text-purple-700 text-sm font-semibold">
        Interested
      </p>

      <p className="text-3xl font-bold text-purple-700 mt-2">
        {loading ? "..." : interestedInquiries}
      </p>

      <p className="text-sm text-purple-600 mt-1">
        Potential admissions
      </p>
    </div>

    {/* Admitted */}
    <div className="border border-green-200 bg-green-50 rounded-2xl p-5">
      <p className="text-green-700 text-sm font-semibold">
        Admitted
      </p>

      <p className="text-3xl font-bold text-green-700 mt-2">
        {loading ? "..." : admittedInquiries}
      </p>

      <p className="text-sm text-green-600 mt-1">
        Converted to admission
      </p>
    </div>

  </div>

</div>

      {/* Fee Collection Snapshot */}
<div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">
        Fee Collection Snapshot
      </h2>

      <p className="text-gray-500 mt-1">
        Current demo fee collection and payment overview.
      </p>
    </div>

    <span className="mt-3 md:mt-0 text-sm font-semibold text-gray-500">
      Demo Financial Overview
    </span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

    {/* Total Due */}
    <div className="border border-gray-200 bg-gray-50 rounded-2xl p-5">
      <p className="text-gray-500 text-sm font-semibold">
        Total Due
      </p>

      <p className="text-3xl font-bold text-gray-800 mt-2">
        {loading ? "..." : `₹${totalDue.toLocaleString("en-IN")}`}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Expected collection
      </p>
    </div>

    {/* Collected */}
    <div className="border border-green-200 bg-green-50 rounded-2xl p-5">
      <p className="text-green-700 text-sm font-semibold">
        Collected
      </p>

      <p className="text-3xl font-bold text-green-700 mt-2">
        {loading ? "..." : `₹${totalCollected.toLocaleString("en-IN")}`}
      </p>

      <p className="text-sm text-green-600 mt-1">
        Payments received
      </p>
    </div>

    {/* Pending */}
    <div className="border border-orange-200 bg-orange-50 rounded-2xl p-5">
      <p className="text-orange-700 text-sm font-semibold">
        Pending
      </p>

      <p className="text-3xl font-bold text-orange-600 mt-2">
        {loading ? "..." : `₹${totalPending.toLocaleString("en-IN")}`}
      </p>

      <p className="text-sm text-orange-600 mt-1">
        Payment still pending
      </p>
    </div>

    {/* Collection Rate */}
    <div className="border border-blue-200 bg-blue-50 rounded-2xl p-5">
      <p className="text-blue-700 text-sm font-semibold">
        Collection Rate
      </p>

      <p className="text-3xl font-bold text-blue-700 mt-2">
        {loading
          ? "..."
          : totalDue > 0
          ? `${((totalCollected / totalDue) * 100).toFixed(1)}%`
          : "0%"}
      </p>

      <p className="text-sm text-blue-600 mt-1">
        Collected vs total due
      </p>
    </div>

  </div>

</div>


        {/* Demo Modules */}
<div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Explore Demo Modules
    </h2>

    <p className="text-gray-500 mt-1">
      Explore the main workflows of the SmartWay Academy management system.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* Students */}
    <div className="border border-blue-200 bg-blue-50 rounded-2xl p-6">

      <div className="text-3xl mb-4">
        👨‍🎓
      </div>

      <h3 className="text-xl font-bold text-gray-800">
        Student Management
      </h3>

      <p className="text-gray-600 text-sm mt-2 min-h-[48px]">
        Manage student profiles, classes, monthly fees and student status.
      </p>

      <div className="mt-5 mb-4">
        <span className="text-2xl font-bold text-blue-700">
          {loading ? "..." : totalStudents}
        </span>

        <span className="text-sm text-gray-500 ml-2">
          Demo Students
        </span>
      </div>

      <button
        onClick={() => navigate("/demo/students")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Open Students →
      </button>

    </div>

    {/* Fees */}
    <div className="border border-green-200 bg-green-50 rounded-2xl p-6">

      <div className="text-3xl mb-4">
        💰
      </div>

      <h3 className="text-xl font-bold text-gray-800">
        Fee Management
      </h3>

      <p className="text-gray-600 text-sm mt-2 min-h-[48px]">
        Track monthly fees, record payments, generate receipts and follow up.
      </p>

      <div className="mt-5 mb-4">
        <span className="text-2xl font-bold text-green-700">
          {loading
            ? "..."
            : `₹${totalCollected.toLocaleString("en-IN")}`}
        </span>

        <span className="text-sm text-gray-500 ml-2">
          Collected
        </span>
      </div>

      <button
        onClick={() => navigate("/demo/fees")}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Open Fees →
      </button>

    </div>

    {/* Inquiries */}
    <div className="border border-purple-200 bg-purple-50 rounded-2xl p-6">

      <div className="text-3xl mb-4">
        📋
      </div>

      <h3 className="text-xl font-bold text-gray-800">
        Inquiry CRM
      </h3>

      <p className="text-gray-600 text-sm mt-2 min-h-[48px]">
        Track leads, update inquiry status, add remarks and follow up.
      </p>

      <div className="mt-5 mb-4">
        <span className="text-2xl font-bold text-purple-700">
          {loading ? "..." : totalInquiries}
        </span>

        <span className="text-sm text-gray-500 ml-2">
          Demo Inquiries
        </span>
      </div>

      <button
        onClick={() => navigate("/demo/inquiries")}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Open Inquiries →
      </button>

    </div>

  </div>

</div>


{/* Recruiter Demo Workflow */}
<div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Recruiter Demo Workflow
    </h2>

    <p className="text-gray-500 mt-1">
      A quick path to explore the application's main business workflows.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Student & Fee Workflow */}
    <div className="border border-blue-200 bg-blue-50 rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">
          🎓
        </span>

        <h3 className="text-lg font-bold text-gray-800">
          Student → Fee → Payment
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">

        <span className="bg-white border border-blue-200 px-3 py-2 rounded-lg">
          Students
        </span>

        <span className="text-blue-500">
          →
        </span>

        <span className="bg-white border border-blue-200 px-3 py-2 rounded-lg">
          Fees
        </span>

        <span className="text-blue-500">
          →
        </span>

        <span className="bg-white border border-blue-200 px-3 py-2 rounded-lg">
          Payment
        </span>

        <span className="text-blue-500">
          →
        </span>

        <span className="bg-white border border-blue-200 px-3 py-2 rounded-lg">
          Receipt
        </span>

      </div>

      <p className="text-gray-600 text-sm mt-4">
        Demonstrates student records, monthly fee tracking, payment recording
        and receipt generation.
      </p>

    </div>


    {/* Inquiry Workflow */}
    <div className="border border-purple-200 bg-purple-50 rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">
          📋
        </span>

        <h3 className="text-lg font-bold text-gray-800">
          Inquiry → Follow-up → Admission
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">

        <span className="bg-white border border-purple-200 px-3 py-2 rounded-lg">
          Inquiry
        </span>

        <span className="text-purple-500">
          →
        </span>

        <span className="bg-white border border-purple-200 px-3 py-2 rounded-lg">
          Follow-up
        </span>

        <span className="text-purple-500">
          →
        </span>

        <span className="bg-white border border-purple-200 px-3 py-2 rounded-lg">
          Status
        </span>

        <span className="text-purple-500">
          →
        </span>

        <span className="bg-white border border-purple-200 px-3 py-2 rounded-lg">
          Admission
        </span>

      </div>

      <p className="text-gray-600 text-sm mt-4">
        Demonstrates lead tracking, status updates, remarks and admission
        conversion workflow.
      </p>

    </div>

  </div>

  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-600">
    💡 <span className="font-semibold text-gray-800">Recruiter tip:</span>
    Start with Students, then demonstrate Fees and Payments. Finish with
    Inquiry CRM to show the complete education-management workflow.
  </div>

</div>
        {/* Safety Notice */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Demo environment • Fictional data only • No real student records
        </div>

      </div>

    </div>
  );
}