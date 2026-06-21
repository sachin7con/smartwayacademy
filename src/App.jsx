// SGN
import classroomImage from "./assets/class2.jpeg";
import Navbar from "./components/Navbar";
import { useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Student from "./pages/Students";

import Login from "./pages/Login";
import {motion } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";

export default function SmartWayAcademyWebsite() {
    const [formData, setFormData] = useState({
      name: "",
      studentClass: "",
      phone: "",
    })

    const handleChange = (e) =>{
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) =>{
      e.preventDefault();
      
      try{
        const response = await axios.post(
          "https://smartwayacademy.onrender.com/api/inquiries", formData
        );

        alert("Inquiry Submitted Successfully")

        setFormData({
          name: "",
          studentClass: "",
          phone:"",
        });
      } catch (error) {
        console.log(error);

        alert("Something went wrong");
      }
    }


  return (

    <Routes>
    <Route path="/" element={<div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 md:py-24 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

    {/* LEFT CONTENT */}
    <motion.div
     initial={{ opacity: 0, x: -50}}
     animate={{ opacity: 1, x:0}}
     transition={{ duration: 0.8 }}
    >

      <p className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
        Welcome to SmartWayAcademy
      </p>

      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
        Build Your Future With SmartWayAcademy
      </h2>

      <p className="text-base sm:text-lg text-blue-100 mb-8 leading-relaxed">
        Quality coaching for Classes 8th to 12th with expert guidance,
        personalized attention, and modern learning methods.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">

        <button className="bg-white text-blue-700 px-6 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition">
          Explore Courses
        </button>

        <button className="border border-white px-6 py-4 rounded-2xl font-semibold hover:bg-white hover:text-blue-700 transition">
          Contact Us
        </button>

      </div>
    </motion.div>

    {/* RIGHT IMAGE */}
    <motion.div 
    className="flex justify-center"
    initial={{ opacity:0, x:50}}
    animate={{ opacity:1, x:0}}
    transition={{duration:1}}
    >

      <img
        src={classroomImage}
        alt="SmartWay Academy Classroom"
        className="w-full max-w-md md:max-w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white/20"
      />

    </motion.div>

  </div>
</section>

      {/* Courses Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Our Courses</h2>
          <p className="text-gray-600 text-lg">
            Comprehensive coaching programs for academic excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Classes 8th - 10th',
              desc: 'Strong foundation in Math and Science with regular tests.',
            },
            {
              title: 'Classes 11th - 12th',
              desc: 'Advanced preparation for board examinations and concepts.',
            },
            {
              title: 'Competitive Exams',
              desc: 'Focused preparation for Olympiads and entrance exams.',
            },
          ].map((course, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-6">{course.desc}</p>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Our Achievements</h2>
          <p className="text-gray-600 text-lg mb-14">
            Proud results of our students.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Aman Sharma',
                score: '95% in Class 10',
              },
              {
                name: 'Priya Verma',
                score: '97% in Class 12',
              },
              {
                name: 'Rahul Singh',
                score: 'Olympiad Rank Holder',
              },
            ].map((student, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold mb-2">{student.name}</h3>
                <p className="text-blue-700 font-semibold">{student.score}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 text-lg">
            We focus on quality education and student growth.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            'Experienced Faculty',
            'Regular Tests',
            'Personal Attention',
            'Modern Learning Methods',
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-blue-700">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-4xl font-bold mb-6">Contact SmartWayAcademy</h2>
            <p className="text-gray-300 mb-4">
              Phone: +91 7906826818
            </p>
            <p className="text-gray-300 mb-4">
              Email: smartwayacademy@gmail.com
            </p>
            <p className="text-gray-300">
              Address: Smart Way Academy <br/>
              Street no. 6, (Near N. R. Publi c School) <br/>
              Raj Nagar 2, New Delhi-110077
            </p>
          </div>

          <div className="bg-white text-gray-800 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Send Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="text"
                name="studentClass"
                value={formData.studentClass}
                onChange={handleChange}
                placeholder="Class"
                className="w-full p-3 border rounded-xl"
              />

              <input 
               type="tel"
               name="phone"
               placeholder="Phone number"
               value={formData.phone}
               onChange={handleChange}
               className="w-full p-3 border rounded-xl"
              />
              {/* <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full p-3 bord  er rounded-xl"
              ></textarea> */}

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3 rounded-xl font-bold transition"
                >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      <a 
        href="https://wa.me/917906826818"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-full shadow-2xl z-50"
      >
          WhatsApp 

      </a>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-6">
        <p>
          © 2026 SmartWayAcademy. All Rights Reserved.
        </p>
      </footer>
    </div>} 
     />

         {/* LOGIN PAGE */}
    <Route path="/login" element={<Login />} />
    
         {/* ADMIN PAGE */}
    <Route
      path="/admin"
      element={<ProtectedRoute>
                <Admin />
              </ProtectedRoute>
      }
    />
    <Route
      path="/students"
      element={<Students />}
      />

</Routes>
  );
}

