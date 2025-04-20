import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';  
import cartRoutes from './routes/cartRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js'; 
import reviewRoutes from './routes/reviewRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);




const PORT = process.env.PORT || 5000;  

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})

