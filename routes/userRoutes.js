import express from "express";
import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js'; 

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
  return res.status(201).json({ message: `${email}, login successfull. `, token });
});

router.get("/admin", authMiddleware(['admin']), (req, res) => {
    res.json({ message: `Welcome Admin ${req.user.email}` });
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

  router.put("/update", authMiddleware(["admin", "user"]), async (req, res) => {
        const { email, name, age, password } = req.body;
      
        const userExists = await user.findOne({ email });
      
        if (!userExists) {
          return res.status(404).json({ message: "User not found" });
        }
      
        let hashedPassword = userExists.password;
        if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
        }
      
        userExists.name = name || userExists.name;
        userExists.age = age || userExists.age;
        userExists.password = hashedPassword;
      
        await userExists.save();
      
        return res.status(200).json({ message: "User updated successfully", user: userExists });
      

});
  

export default router;

