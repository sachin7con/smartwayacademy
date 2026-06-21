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

    //Update
    router.put("/:id", async (req, res) => {
  try {

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        notes: req.body.notes,
        followUpDate: req.body.followUpDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(inquiry);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

    //delete inquiry route
    router.delete("/:id",async (req, res) =>{
        try{
            await Inquiry.findByIdAndDelete(req.params.id)

            res.json({success: true, message: "inquiry deleted", })
        }
        catch(error){
            res.status(500).json({
                message: error.message,
            });
        }
    });  

    module.exports = router;