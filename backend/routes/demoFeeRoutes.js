const express = require("express");
const DemoFee = require("../models/DemoFee");
const DemoStudent = require("../models/DemoStudent");
const authMiddleware = require("../middleware/authMiddleware");
const demoMiddleware = require("../middleware/demoMiddleware");
const DEMO_WHATSAPP_NUMBER = process.env.DEMO_WHATSAPP_NUMBER;

const router = express.Router();

router.use(authMiddleware);
router.use(demoMiddleware);

// GET demo fees for a month
router.get("/month/:year/:month", async (req, res) => {
  try {
    const year = Number(req.params.year);
    const month = Number(req.params.month);

    const fees = await DemoFee.find({
      year,
      month,
    })
      .populate("student")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GENERATE demo fees for all demo students
router.post("/generate", async (req, res) => {
  try {
    const { year, month } = req.body;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    const students = await DemoStudent.find({
      status: "Active",
    });

    let created = 0;
    let existing = 0;

    for (const student of students) {
      const alreadyExists = await DemoFee.findOne({
        student: student._id,
        year,
        month,
      });

      if (alreadyExists) {
        existing++;
        continue;
      }

      await DemoFee.create({
        student: student._id,
        year,
        month,
        amountDue: student.monthlyFee,
        status: "Due",
        payments: [],
      });

      created++;
    }

    res.json({
      success: true,
      message: "Demo fees generated successfully",
      created,
      existing,
      totalStudents: students.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// RECORD demo payment
router.post("/:id/payment", async (req, res) => {
  try {
    const { amount, mode, note } = req.body;

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required",
      });
    }

    const fee = await DemoFee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Demo fee not found",
      });
    }

    const totalPaid = fee.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const pendingAmount = fee.amountDue - totalPaid;

    if (paymentAmount > pendingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment cannot exceed pending amount of ₹${pendingAmount}`,
      });
    }

    fee.payments.push({
      amount: paymentAmount,
      mode: mode || "UPI",
      note: note || "",
      date: new Date(),
    });

    const newTotalPaid = totalPaid + paymentAmount;

    if (newTotalPaid >= fee.amountDue) {
      fee.status = "Paid";
    } else {
      fee.status = "Partial";
    }

    await fee.save();

    const updatedFee = await DemoFee.findById(fee._id).populate(
      "student"
    );

    res.json({
      success: true,
      message: "Demo payment recorded successfully",
      fee: updatedFee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET payment history for a demo fee
router.get("/:id/history", async (req, res) => {
  try {
    const fee = await DemoFee.findById(req.params.id).populate(
      "student"
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Demo fee not found",
      });
    }

    res.json({
      success: true,
      fee,
      payments: fee.payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/:id/whatsapp", async (req, res) => {
  try {
    const fee = await DemoFee.findById(req.params.id).populate("student");

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Demo fee not found",
      });
    }

    const paid = fee.payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    if (paid <= 0) {
      return res.status(400).json({
        success: false,
        message: "No payment has been recorded yet",
      });
    }

    if (!DEMO_WHATSAPP_NUMBER) {
      return res.status(500).json({
        success: false,
        message: "Demo WhatsApp number is not configured",
      });
    }

    const pending = Math.max(
      0,
      Number(fee.amountDue || 0) - paid
    );

    const message = `SmartWay Academy DEMO

Demo Fee Payment Update

Student: ${fee.student?.studentName || "Demo Student"}
Class: ${fee.student?.className || "-"}
Fee Due: ₹${Number(fee.amountDue || 0).toLocaleString("en-IN")}
Total Paid: ₹${paid.toLocaleString("en-IN")}
Pending: ₹${pending.toLocaleString("en-IN")}
Status: ${fee.status}

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