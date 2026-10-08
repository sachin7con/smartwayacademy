const mongoose = require("mongoose");

const demoPaymentSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    mode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Other"],
      default: "UPI",
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const demoFeeSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DemoStudent",
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    amountDue: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Due", "Partial", "Paid"],
      default: "Due",
    },

    payments: [demoPaymentSchema],
  },
  {
    timestamps: true,
  }
);

demoFeeSchema.index(
  { student: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model("DemoFee", demoFeeSchema);