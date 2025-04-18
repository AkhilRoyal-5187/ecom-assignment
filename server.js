import express from 'express';
import mongoose from 'mongoose';
import user from './models/user.js';
import cors from 'cors';
import router from './routes/userRoutes.js';

import dotenv from 'dotenv';
dotenv.config();


async function dbConnection(){
    try {
        let db = await mongoose.connect(process.env.DB_URL)
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
        
    }
}dbConnection();

let port = process.env.PORT || 3000; 
let app = express();
app.use(cors());
app.use(express.json())
app.use('/api/users', router);
app.use('/', router); 

app.listen((port), ()=>{
    console.log(`server is running at the port : ${port}`);

});
