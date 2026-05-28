const express = require("express");
const Inquiry = require("../models/Inquiry");
const router = express.Router();


router.post("/", async (req, res) =>{
    try{
        const inquiry = new Inquiry(req.body)
        await inquiry.save();

        res.status(201).json({success: true, message: "Inquiry Submitted", })


    }catch(error){
        res.status(500).json({ success: false, message: error.message, })

    }
} );

router.get("/", async (req, res) =>{
    try{
        const inquiries = await Inquiry.find().sort({ createdAt: -1});

        res.json(inquiries);
    } catch (error) {
        res.status(500).json({message: error.message, })
    }
})

module.exports = router;