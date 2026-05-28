const express = require("express");
const mongoose = require("mongoose");
const inquiryRoutes = require("./routes/inquiryRoutes");
const cors = require("cors");
+
require("dotenv").config();

const app= express();

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected successfully !"))
.catch((err) => console.log(err))

app.get("/", (req, res) =>{
    res.send("Backend running")
})

const PORT = process.env.PORT || 5000;

app.use("/api/inquiries", inquiryRoutes);

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
});