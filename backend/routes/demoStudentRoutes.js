const express = require("express");
const DemoStudent = require("../models/DemoStudent");
const authMiddleware = require("../middleware/authMiddleware");
const demoMiddleware = require("../middleware/demoMiddleware");
const DEMO_WHATSAPP_NUMBER = process.env.DEMO_WHATSAPP_NUMBER;

const router = express.Router();

router.use(authMiddleware);
router.use(demoMiddleware);

// GET all demo students
router.get("/", async (req, res) => {
  try {
    const students = await DemoStudent.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE DEMO STUDENTS
router.post("/seed", async (req, res) => {
  try {
    const existingCount = await DemoStudent.countDocuments();

    if (existingCount > 0) {
      return res.json({
        success: true,
        message: "Demo students already exist",
        count: existingCount,
      });
    }

    const demoStudents = [
      {
        studentName: "Aarav Sharma",
        className: "10th",
        fatherName: "Rajesh Sharma",
        phone: "9999900001",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Ananya Verma",
        className: "9th",
        fatherName: "Suresh Verma",
        phone: "9999900002",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Vivaan Gupta",
        className: "12th",
        fatherName: "Amit Gupta",
        phone: "9999900003",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Diya Singh",
        className: "8th",
        fatherName: "Manoj Singh",
        phone: "9999900004",
        monthlyFee: 1600,
        status: "Active",
      },
      {
        studentName: "Aditya Kumar",
        className: "11th",
        fatherName: "Rakesh Kumar",
        phone: "9999900005",
        monthlyFee: 2200,
        status: "Active",
      },
      {
        studentName: "Ishita Mehta",
        className: "10th",
        fatherName: "Vikas Mehta",
        phone: "9999900006",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Arjun Malhotra",
        className: "12th",
        fatherName: "Sanjay Malhotra",
        phone: "9999900007",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Myra Kapoor",
        className: "9th",
        fatherName: "Rohit Kapoor",
        phone: "9999900008",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Reyansh Joshi",
        className: "8th",
        fatherName: "Nitin Joshi",
        phone: "9999900009",
        monthlyFee: 1600,
        status: "Active",
      },
      {
        studentName: "Sara Bansal",
        className: "10th",
        fatherName: "Pankaj Bansal",
        phone: "9999900010",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Kabir Arora",
        className: "11th",
        fatherName: "Deepak Arora",
        phone: "9999900011",
        monthlyFee: 2200,
        status: "Active",
      },
      {
        studentName: "Meera Jain",
        className: "12th",
        fatherName: "Alok Jain",
        phone: "9999900012",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Vihaan Sethi",
        className: "9th",
        fatherName: "Ravi Sethi",
        phone: "9999900013",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Aanya Khanna",
        className: "8th",
        fatherName: "Neeraj Khanna",
        phone: "9999900014",
        monthlyFee: 1600,
        status: "Active",
      },
      {
        studentName: "Rudra Yadav",
        className: "10th",
        fatherName: "Mukul Yadav",
        phone: "9999900015",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Kiara Chawla",
        className: "11th",
        fatherName: "Akhil Chawla",
        phone: "9999900016",
        monthlyFee: 2200,
        status: "Active",
      },
      {
        studentName: "Atharv Mishra",
        className: "12th",
        fatherName: "Praveen Mishra",
        phone: "9999900017",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Navya Tiwari",
        className: "9th",
        fatherName: "Ramesh Tiwari",
        phone: "9999900018",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Dhruv Saxena",
        className: "8th",
        fatherName: "Karan Saxena",
        phone: "9999900019",
        monthlyFee: 1600,
        status: "Active",
      },
      {
        studentName: "Anvi Agarwal",
        className: "10th",
        fatherName: "Gaurav Agarwal",
        phone: "9999900020",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Yuvan Roy",
        className: "11th",
        fatherName: "Siddharth Roy",
        phone: "9999900021",
        monthlyFee: 2200,
        status: "Active",
      },
      {
        studentName: "Riya Nair",
        className: "12th",
        fatherName: "Vivek Nair",
        phone: "9999900022",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Krish Patel",
        className: "9th",
        fatherName: "Harish Patel",
        phone: "9999900023",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Tara Kapoor",
        className: "10th",
        fatherName: "Manish Kapoor",
        phone: "9999900024",
        monthlyFee: 2000,
        status: "Active",
      },
    ];

    const students = await DemoStudent.insertMany(demoStudents);

    res.status(201).json({
      success: true,
      message: "Demo students created successfully",
      count: students.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE DEMO STUDENTS
router.post("/seed", async (req, res) => {
  try {
    const existingCount = await DemoStudent.countDocuments();

    if (existingCount > 0) {
      return res.json({
        success: true,
        message: "Demo students already exist",
        count: existingCount,
      });
    }

    const demoStudents = [
      {
        studentName: "Aarav Sharma",
        className: "10th",
        fatherName: "Rajesh Sharma",
        phone: "9999900001",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Ananya Verma",
        className: "9th",
        fatherName: "Suresh Verma",
        phone: "9999900002",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Vivaan Gupta",
        className: "12th",
        fatherName: "Amit Gupta",
        phone: "9999900003",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Diya Singh",
        className: "8th",
        fatherName: "Manoj Singh",
        phone: "9999900004",
        monthlyFee: 1600,
        status: "Active",
      },
      {
        studentName: "Aditya Kumar",
        className: "11th",
        fatherName: "Rakesh Kumar",
        phone: "9999900005",
        monthlyFee: 2200,
        status: "Active",
      },
      {
        studentName: "Ishita Mehta",
        className: "10th",
        fatherName: "Vikas Mehta",
        phone: "9999900006",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Arjun Malhotra",
        className: "12th",
        fatherName: "Sanjay Malhotra",
        phone: "9999900007",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Myra Kapoor",
        className: "9th",
        fatherName: "Rohit Kapoor",
        phone: "9999900008",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Reyansh Joshi",
        className: "8th",
        fatherName: "Nitin Joshi",
        phone: "9999900009",
        monthlyFee: 1600,
        status: "Active",
      },
      {
        studentName: "Sara Bansal",
        className: "10th",
        fatherName: "Pankaj Bansal",
        phone: "9999900010",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Kabir Arora",
        className: "11th",
        fatherName: "Deepak Arora",
        phone: "9999900011",
        monthlyFee: 2200,
        status: "Active",
      },
      {
        studentName: "Meera Jain",
        className: "12th",
        fatherName: "Alok Jain",
        phone: "9999900012",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Vihaan Sethi",
        className: "9th",
        fatherName: "Ravi Sethi",
        phone: "9999900013",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Aanya Khanna",
        className: "8th",
        fatherName: "Neeraj Khanna",
        phone: "9999900014",
        monthlyFee: 1600,
        status: "Active",
      },
      {
        studentName: "Rudra Yadav",
        className: "10th",
        fatherName: "Mukul Yadav",
        phone: "9999900015",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Kiara Chawla",
        className: "11th",
        fatherName: "Akhil Chawla",
        phone: "9999900016",
        monthlyFee: 2200,
        status: "Active",
      },
      {
        studentName: "Atharv Mishra",
        className: "12th",
        fatherName: "Praveen Mishra",
        phone: "9999900017",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Navya Tiwari",
        className: "9th",
        fatherName: "Ramesh Tiwari",
        phone: "9999900018",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Dhruv Saxena",
        className: "8th",
        fatherName: "Karan Saxena",
        phone: "9999900019",
        monthlyFee: 1600,
        status: "Active",
      },
      {
        studentName: "Anvi Agarwal",
        className: "10th",
        fatherName: "Gaurav Agarwal",
        phone: "9999900020",
        monthlyFee: 2000,
        status: "Active",
      },
      {
        studentName: "Yuvan Roy",
        className: "11th",
        fatherName: "Siddharth Roy",
        phone: "9999900021",
        monthlyFee: 2200,
        status: "Active",
      },
      {
        studentName: "Riya Nair",
        className: "12th",
        fatherName: "Vivek Nair",
        phone: "9999900022",
        monthlyFee: 2500,
        status: "Active",
      },
      {
        studentName: "Krish Patel",
        className: "9th",
        fatherName: "Harish Patel",
        phone: "9999900023",
        monthlyFee: 1800,
        status: "Active",
      },
      {
        studentName: "Tara Kapoor",
        className: "10th",
        fatherName: "Manish Kapoor",
        phone: "9999900024",
        monthlyFee: 2000,
        status: "Active",
      },
    ];

    const students = await DemoStudent.insertMany(demoStudents);

    res.status(201).json({
      success: true,
      message: "Demo students created successfully",
      count: students.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Open WhatsApp for demo student
router.post("/:id/whatsapp", async (req, res) => {
  try {
    const student = await DemoStudent.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Demo student not found",
      });
    }

    if (!DEMO_WHATSAPP_NUMBER) {
      return res.status(500).json({
        success: false,
        message: "Demo WhatsApp number is not configured",
      });
    }

    const message = `SmartWay Academy DEMO

Demo Student Follow-up

Student: ${student.studentName}
Class: ${student.className}
Father Name: ${student.fatherName || "-"}
Monthly Fee: ₹${Number(student.monthlyFee || 0).toLocaleString("en-IN")}
Status: ${student.status}

This is a recruiter demonstration using fictional data.`;

    const whatsappUrl = `https://wa.me/${DEMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    res.json({
      success: true,
      whatsappUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;