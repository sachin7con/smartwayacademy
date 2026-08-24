// Jay SHree Ganeshay Namah Oum Namah ShivayParivar JSLN JMD JSSR JSRK JBB JSVM JMK JMS JJj JSKS, JSRK JSVL
const express = require("express");
const Fee = require("../models/Fee");

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

module.exports = router;
