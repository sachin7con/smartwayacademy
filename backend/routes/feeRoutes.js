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


module.exports = router;
