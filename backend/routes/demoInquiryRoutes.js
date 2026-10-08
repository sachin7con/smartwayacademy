const express = require("express");
const DemoInquiry = require("../models/DemoInquiry");
const authMiddleware = require("../middleware/authMiddleware");
const demoMiddleware = require("../middleware/demoMiddleware");
const DEMO_WHATSAPP_NUMBER = process.env.DEMO_WHATSAPP_NUMBER;

const router = express.Router();

router.use(authMiddleware);
router.use(demoMiddleware);

// Get all demo inquiries
router.get("/", async (req, res) => {
  try {
    const inquiries = await DemoInquiry.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Seed fictional demo inquiries
router.post("/seed", async (req, res) => {
  try {
    const existingCount = await DemoInquiry.countDocuments();

    if (existingCount > 0) {
      return res.json({
        success: true,
        message: "Demo inquiries already exist",
        count: existingCount,
      });
    }
    const inquiries = [
      {
        studentName: "Riya Sharma",
        parentName: "Amit Sharma",
        phone: "9999910001",
        className: "10th",
        course: "Maths + Science",
        source: "Website",
        status: "New",
        remarks: "Interested in regular coaching",
      },
      {
        studentName: "Arjun Mehta",
        parentName: "Rajesh Mehta",
        phone: "9999910002",
        className: "9th",
        course: "Maths",
        source: "WhatsApp",
        status: "Contacted",
        remarks: "Parent requested fee details",
      },
      {
        studentName: "Diya Gupta",
        parentName: "Sanjay Gupta",
        phone: "9999910003",
        className: "11th",
        course: "Science",
        source: "Website",
        status: "Interested",
        remarks: "Demo class completed",
      },
      {
        studentName: "Kunal Verma",
        parentName: "Manoj Verma",
        phone: "9999910004",
        className: "12th",
        course: "Maths + Physics",
        source: "Referral",
        status: "Admitted",
        remarks: "Admission completed",
      },
      {
        studentName: "Anaya Singh",
        parentName: "Vikas Singh",
        phone: "9999910005",
        className: "8th",
        course: "Olympiad",
        source: "Website",
        status: "New",
        remarks: "Interested in Olympiad preparation",
      },
      {
        studentName: "Vivaan Kapoor",
        parentName: "Rohit Kapoor",
        phone: "9999910006",
        className: "10th",
        course: "Maths + Science",
        source: "Instagram",
        status: "Contacted",
        remarks: "Follow-up required",
      },
      {
        studentName: "Ishita Malhotra",
        parentName: "Nitin Malhotra",
        phone: "9999910007",
        className: "9th",
        course: "Maths",
        source: "Website",
        status: "Interested",
        remarks: "Parent comparing batches",
      },
      {
        studentName: "Aditya Rao",
        parentName: "Suresh Rao",
        phone: "9999910008",
        className: "12th",
        course: "JEE Foundation",
        source: "Referral",
        status: "Admitted",
        remarks: "Joined weekend batch",
      },
    ];

    const created = await DemoInquiry.insertMany(inquiries);

    res.json({
      success: true,
      message: "Demo inquiries created successfully",
      count: created.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update demo inquiry status/remarks
router.put("/:id", async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const inquiry = await DemoInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Demo inquiry not found",
      });
    }

    if (status) {
      inquiry.status = status;
    }

    if (remarks !== undefined) {
      inquiry.remarks = remarks;
    }

    await inquiry.save();

    res.json({
      success: true,
      message: "Demo inquiry updated successfully",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Open WhatsApp for demo inquiry follow-up
router.post("/:id/whatsapp", async (req, res) => {
  try {
    const inquiry = await DemoInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Demo inquiry not found",
      });
    }

    if (!DEMO_WHATSAPP_NUMBER) {
      return res.status(500).json({
        success: false,
        message: "Demo WhatsApp number is not configured",
      });
    }

    const message = `SmartWay Academy DEMO

Demo Inquiry Follow-up

Student: ${inquiry.studentName}
Parent: ${inquiry.parentName}
Class: ${inquiry.className}
Course: ${inquiry.course || "-"}
Source: ${inquiry.source}
Status: ${inquiry.status}

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