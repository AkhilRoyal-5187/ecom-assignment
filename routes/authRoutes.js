import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import verifyAdmin from '../middleware/verifyAdmin.js'
const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message: 'User not found'});
        }else{
            const isMatch = await bcrypt.compare(password, user.password);  
            if(!isMatch){
                res.status(400).json({message: 'Invalid credentials'});
        }else{
            const token = await jwt.sign(
                { _id: user._id, role: user.role }, // payload
                process.env.JWT_SECRET,             // secret key
                { expiresIn: '10h' }                 // optional: token expiry
              );
                res.status(200).json({message: 'Login successful', userId: user._id, token});
            }
        }
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
});

router.get('/users', async (req, res) => {
  try {
   const users = await User.find({});
   res.send(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error});
  }
});

router.get('/users/:id', async (req, res)=>{
    const {id} = req.params;
    try{
        const user = await User.findById(id);
            if(user){
                res.status(200).json({message : 'User found', user});
            }else{
                res.status(404).json({message : 'user not found'});
            }
        
    }catch(error){
        res.status(400).json({message : "error occurred", error});
    }
});

router.put('/users/:id', async (req, res)=>{
    const{id} = req.params;
    try{
        const user = await User.findById(id);
        if(!user){
            res.status(404).json({message : 'user not found'});
        }else{
            const {email,name,password,role} = req.body;
            user.email = email || user.email;
            user.name = name || user.name;
            user.role = role || user.role;

            if(password){
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            const updatedUser = await user.save();
            res.status(200).json({ message: 'User updated successfully', user: updatedUser });

        }
    }catch(error){
        res.status(400).json({message : "error occurred", error});
    }
})

router.delete('/users/:id',verifyAdmin, async(req, res)=>{
    const{id} = req.params;
    try{
        const user = await User.findById(id);
        if(!user){
            res.status(404).json({message : 'user not found'});
        }else{
            await User.findByIdAndDelete(id);
            res.status(200).json({message : 'User deleted successfully'});
        }
    }catch(error){
        console.error('the error is', error);
        res.status(400).json({message : "error occurred", error});
    }
})

router.put('/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }else{
        user.role = role || user.role;
        const updatedUser = await user.save();
        res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/users/:id/email', async(req,res)=>{

    const{id} = req.params;

    try{
        const user = await User.findById(id);
        if(!user){
            res.status(404).json({message : 'user not found'});
        }
        else{
            res.status(200).json({message : 'User found', email: user.email});

        }
    }
    catch(error){
        res.status(400).json({message : "error occurred", error});
    }   
})


export default router;
