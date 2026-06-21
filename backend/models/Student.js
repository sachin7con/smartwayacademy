const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    monthlyFee: {
      type: Number,
      required: true,
    },

    paidFee: {
      type: Number,
      default: 0,
    },

    feeHistory: {
        amount: Number,
        date: {
            type: Date,
            default: Date.now,
        }

    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    remarks: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);