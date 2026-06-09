const mongoose = require("mongoose");

const inquirySchema = mongoose.Schema({
    name: String,
    studentClass: String,
    phone: String,

    status: {
        type: String,
        default: "New",
    },
    notes : {
        type: String,
        default: "",
    },
    followUpDate:{
        type: Date,
        default: null,
    },
}, {timestamps: true})

module.exports = mongoose.model("Inquiry", inquirySchema);