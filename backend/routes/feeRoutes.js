// Jay SHree Ganeshay Namah Oum Namah ShivayParivar JSLN JMD JSSR JSRK JBB JSVM JMK JMS JJj JSKS, JSRK JSVL
const express = require("express");
const Fee = require("../models/Fee");
const Student = require("../models/Student");

const router = express.Router();

router.get("/", (req, res)=> {
    res.json({
        success: true,
        message: "Fee API is working", 
    });
});
router.get("/month/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;

    const fees = await Fee.find({
      year: Number(year),
      month: Number(month),
    }).populate(
      "student",
      "studentName className fatherName phone monthlyFee"
    );

    res.json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch fees",
      error: error.message,
    });
  }
});

router.put("/pay/:id", async (req, res) => {
  try {
    const { amount, paymentMode, note } = req.body;

    // Validate amount
    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    // Find fee record
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    // Calculate already paid
    const totalPaid = fee.payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    // Calculate pending
    const pendingAmount = Number(fee.amountDue) - totalPaid;

    // Prevent overpayment
    if (paymentAmount > pendingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment cannot be greater than pending amount of ₹${pendingAmount}`,
      });
    }

    // Add payment
    fee.payments.push({
      amount: paymentAmount,
      paymentMode: paymentMode || "UPI",
      note: note || "",
    });

    // Calculate new total paid
    const newTotalPaid = fee.payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    // Update status
    if (newTotalPaid === 0) {
      fee.status = "Due";
    } else if (newTotalPaid < Number(fee.amountDue)) {
      fee.status = "Partial";
    } else {
      fee.status = "Paid";
    }

    await fee.save();

    res.json({
      success: true,
      message: "Payment recorded successfully",
      fee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to record payment",
      error: error.message,
    });
  }
});

router.post("/generate/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;

    const selectedYear = Number(year);
    const selectedMonth = Number(month);

    if (
      !selectedYear ||
      !selectedMonth ||
      selectedMonth < 1 ||
      selectedMonth > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid month or year",
      });
    }

    // Get all active students
    const students = await Student.find({
      status: "Active",
    });

    let created = 0;
    let existing = 0;

    for (const student of students) {
      const existingFee = await Fee.findOne({
        student: student._id,
        month: selectedMonth,
        year: selectedYear,
      });

      if (existingFee) {
        existing++;
        continue;
      }

      await Fee.create({
        student: student._id,
        month: selectedMonth,
        year: selectedYear,
        amountDue: Number(student.monthlyFee || 0),
        payments: [],
        status: "Due",
      });

      created++;
    }

    res.json({
      success: true,
      message: "Monthly fees generated successfully",
      created,
      existing,
      totalStudents: students.length,
    });
  } catch (error) {
    console.error("Generate monthly fees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate monthly fees",
      error: error.message,
    });
  }
});


module.exports = router;
