const mongoose = require("mongoose");

const inquirySchema = mongoose.Schema({
    name: String,
    studentClass: String,
    phone: String,

    status: {
        type: String,
        default: "New",
    },
}, {timestamps: true})

module.exports = mongoose.model("Inquiry", inquirySchema);