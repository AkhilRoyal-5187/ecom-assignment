import express from "express";
import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js'; 
import { IdentificationIcon } from "@heroicons/react/16/solid";

router.post("/signup", async (req, res) => {
  const { name, email, password, age } = req.body;
  console.log(req.body);
  const userExists = await user.findOne({ name });
  if (userExists) {
    return res.status(400).json({ message: "user already exists" });
  }
  const hashedPass = await bcrypt.hash(password, 10);
  const newUser = new user({
    name: name,
    email: email,
    age: age,
    password: hashedPass,
  });
  await newUser.save();

  res
    .status(201)
    .json({ message: "signup successfull", user: { name, email } });
});




router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userExists = await user.findOne({ email });

  if (!userExists) {
    return res.status(400).json({ message: "user not found please register" });
  }
  const ismatch = await bcrypt.compare(password, userExists.password)
  if (!ismatch) {

    return res
      .status(400)
      .json({
        message: "password is incorrect, please give the valid password",
      });
    
  }
  const token = jwt.sign({id: userExists._id, email: userExists.email, role : userExists.role}, process.env.SECRET_KEY, {expiresIn : '1h'});
  return res.status(201).json({message: `${email} login successful. ID is: ${userExists._id}`, token});
});


router.get("/admin", authMiddleware(['admin']), (req, res) => {
    res.json({ message: `Welcome Admin ${req.user.email} ${req.user._id}` });
});



  

  router.delete("/delete", async (req, res) => {
    const { name, email } = req.body; 

    const userExists = await user.findOne({ name, email });
  
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
  
    await user.deleteOne({ name, email });
  
    return res.status(200).json({ message: "User deleted successfully" });
  })

router.put("/update/:id", authMiddleware(["admin", "user"]), async (req, res) => {
    const { id } = req.params;
    const { name, email, age, password } = req.body; 
    const userExists = await user.findById(id);
    
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
  
    if (name) userExists.name = name;
    if (email) userExists.email = email;
    if (age) userExists.age = age;
  
    if (password) {
      userExists.password = await bcrypt.hash(password, 10);
    }
  
    await userExists.save();
  
    return res.status(200).json({ message: "User updated successfully", user: userExists });
  });
  
  

export default router;

