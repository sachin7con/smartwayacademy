const express = require("express");
const Student = require("../models/Student");
const Fee = require("../models/Fee");

const router = express.Router();

router.post("/", async(req, res) => {
    try{
        const student = new Student(req.body);

        await student.save();

         res.status(201).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update Student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await Fee.deleteMany({
      student: student._id,
    });

    await Student.findByIdAndDelete(student._id);

    res.json({
      message: "Student and related fee records deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id/pay", async (req, res) => {
  try {

    const { amount } = req.body;

    const student = await Student.findById(req.params.id);

    student.paidFee += Number(amount);

    student.feeHistory.push({
      amount,
    });

    await student.save();

    res.json(student);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/pay/:id", async (req, res) => {
  try {

    const student = await Student.findById(req.params.id);

    student.paidFee =
      Number(student.paidFee) +
      Number(req.body.amount);

    await student.save();

    res.json(student);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;