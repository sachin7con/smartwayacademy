const express = require("express")
const jwt = require("jsonwebtokens")

const router = express.Router();

const ADMIN_EMAIL = "sachin7con@gmail.com";
const ADMIN_PASSWORD = "123"

router.post("/login", (req, res) =>{
    const {email, password} = req.body;

    try{
        if(email !== ADMIN_EMAIL ||
            password !== ADMIN_PASSWORD
        ){
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }
        
        const token = jwt.sign(
            {email},
            "smartwaysecretkey",
            {expiresIn: "7d"}
        );

        res.json({
            success: true, 
            token,
        })

        }
        catch(error) {
            res.status(500).json({message: error.message,})
        }


})

module.exports = router;