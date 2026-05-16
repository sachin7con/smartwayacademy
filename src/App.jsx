// SGN
import classroomImage from "./assets/class2.jpeg";
import Navbar from "./components/Navbar";

export default function SmartWayAcademyWebsite() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Build Your Future With SmartWayAcademy
            </h2>

            <p className="text-lg text-blue-100 mb-8">
              Quality coaching for Classes 8th to 12th with expert guidance,
              personalized attention, and modern learning methods.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
                Explore Courses
              </button>

              <button className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition">
                Contact Us
              </button>
            </div>
          </div>

          <div>
          <img
          src={classroomImage}
          alt="SmartWay Academy Classroom"
          className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
          />
        </div>


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
              Street no. 6, (Near N. R. Public School) <br/>
              Raj Nagar 2, New Delhi-110077
            </p>
          </div>

          <div className="bg-white text-gray-800 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Send Message</h3>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-xl"
              />

              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full p-3 border rounded-xl"
              ></textarea>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-6">
        <p>
          © 2026 SmartWayAcademy. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
