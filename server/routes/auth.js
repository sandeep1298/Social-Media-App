const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRET } = require('../keys')
const requireLogin = require("../middleware/requireLogin")


router.post('/signup', (req, res) => {
   const { name, email, password } = req.body;

   if (!email || !password || !name) {
       return res.status(422).json({ error: "Please fill all the fields" });
   }

   User.findOne({ email: email })
       .then((savedUser) => {
           if (savedUser) {
               return res.status(422).json({ error: "User already exists with that email" });
           } else {
               bcrypt.hash(password, 12)
                   .then(hashedPassword => {
                       const user = new User({
                           email,
                           password: hashedPassword,
                           name
                       });

                       user.save()
                           .then(user => {
                               // Generate a JWT token for the new user
                               const token = jwt.sign({ _id: user._id }, JWT_SECRET);

                               // Send all user details except the password in the response
                               const userResponse = {
                                   _id: user._id,
                                   name: user.name,
                                   email: user.email,
                                   createdAt: user.createdAt,
                                   updatedAt: user.updatedAt,
                                   token: token, // Include the token in the response
                               };

                               res.json({
                                   message: "Registered successfully",
                                   user: userResponse
                               });
                           })
                           .catch(err => {
                               console.error(err);
                               res.status(500).json({ error: "Error saving user" });
                           });
                   })
                   .catch(err => {
                       console.error(err);
                       res.status(500).json({ error: "Error hashing password" });
                   });
           }
       })
       .catch(err => {
           console.error(err);
           res.status(500).json({ error: "Database error" });
       });
});

 
 router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" });
    }

    User.findOne({ email: email })
        .then(saveduser => {
            if (!saveduser) {
                return res.status(422).json({ error: "Invalid Email or password" });
            }

            bcrypt.compare(password, saveduser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: saveduser._id }, JWT_SECRET);

                        // Structure the user response to match the signup format
                        const userResponse = {
                            _id: saveduser._id,
                            name: saveduser.name,
                            email: saveduser.email,
                            createdAt: saveduser.createdAt,
                            updatedAt: saveduser.updatedAt,
                            token : token
                        };

                        res.json({
                            message: "Logged in successfully",
                            
                            user: userResponse
                        });
                    } else {
                        return res.status(422).json({ error: "Invalid Email or password" });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: "Internal server error" });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        });
});


module.exports=router