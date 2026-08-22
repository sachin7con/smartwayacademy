const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        amount:{
            type: Number,
            required: true,
            min: 1,
        },

        paymentDate :{
            type : Date,
            default : Date.now,

        },
        paymentMode : {
            type: String,
            enum: ["Cash", "UPI", "Bank Transfer", "Other"],
            default: "UPI",
        },
        note: {
            type: String,
            default: "",
        },
    },
    { _id: true}
);

const feeSchema = new mongoose.Schema(
    {
        student : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"Student",
        },

        month : {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },

        year : {
            type: Number,
            required: true,

        },
        amountDue : {
            type: Number,
            required: true,
            min:0,
        },
        payments : [paymentSchema],

        status: {
            type: String,
            enum: ["Due", "Partial", "Paid"],
            default: "Due",
        },
        notes:{
            type: String,
            default: "",

        },
    },
    { timestamps: true, }
);

feeSchema.index(
  { student: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model("Fee", feeSchema);