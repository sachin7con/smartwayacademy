const mongoose = require("mongoose");

const demoInquirySchema = mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    parentName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      trim: true,
      default: "",
    },

    source: {
      type: String,
      trim: true,
      default: "Website",
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Admitted"],
      default: "New",
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DemoInquiry", demoInquirySchema);