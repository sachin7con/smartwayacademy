require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const inquiryRoutes = require("./routes/inquiryRoutes");
const studentRoutes = require("./routes/studentRoutes");
const feeRoutes = require("./routes/feeRoutes");
const demoStudentRoutes = require("./routes/demoStudentRoutes");
const demoFeeRoutes = require("./routes/demoFeeRoutes");
const demoInquiryRoutes = require("./routes/demoInquiryRoutes");


const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes")



const app= express();


app.use(cors());
app.use(express.json())
app.use("/api/demo/inquiries", demoInquiryRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected successfully !"))
.catch((err) => console.log(err))

app.get("/", (req, res) =>{
    res.send("Backend running")
})

const PORT = process.env.PORT || 5000;

app.use("/api/inquiries", inquiryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/demo/students", demoStudentRoutes);
app.use("/api/demo/fees", demoFeeRoutes);

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
});