const mongoose = require("mongoose");

const inquirySchema = mongoose.Schema({
    name: String,
    studentClass: String,
    phone: String,
}, {timestamps: true})

module.exports = mongoose.model("Inquiry", inquirySchema);