import express from 'express';
import Order from '../models/order.js';
import Payment from '../models/payment.js'; 

const router = express.Router();
router.use(express.json());

router.post('/', async(req, res)=>{
    const {amount, paymentMethod, userId, orderId} = req.body;

    if(!amount || !paymentMethod || !userId || !orderId){
        return res.status(400).json({message: 'All fields are required'});
    }
    try{
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message: 'Order not found'});
        }
        const payment = new Payment({amount, paymentMethod, userId, orderId});
        const savedPayment = await payment.save();
        res.status(201).json({message: 'Payment added successfully', savedPayment});
    }
    catch(err){
        res.status(500).json({message: 'Error adding payment', error: err.message});
    }

});

export default router;