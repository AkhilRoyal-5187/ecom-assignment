import express from 'express';
import Cart from '../models/cart.js';
import Order from '../models/order.js'; 
import User from '../models/user.js';

const router = express.Router();

router.post('/', async(req, res)=>{
    const {userId, shippingAddress} =req.body;

    try{
        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message: 'Cart is empty'});
        }
        const totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * 100, 0);
        const order = new Order({
            userId,
            items: cart.items,
            shippingAddress,
            totalAmount : totalPrice,
            status : 'Pending',
        });
        await order.save();
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        res.status(201).json({message: 'Order placed successfully', order});
     

    }catch(err){
        res.status(500).json({message: 'Error placing order', error: err.message});
    }

});

router.get('/', async (req, res)=>{
    try{
        const user = await User.findById(req.userId);
        if(!user || user.role !== 'admin'){
            return res.status(403).json({message : 'Access denied'});
        }
        const orders = await Order.find()
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json({message: 'Error fetching orders', error: err.message});
    }
});

router.get('/user/:userId', async(req, res)=>{
    const{userId} = req.params;
    try{
        const orders = await Order.find({userId});
        if(!orders || orders.length === 0){
            return res.status(404).json({message: 'No orders found for this user'});
        }else{
            res.status(200).json(orders);
        }
    }catch(err){
        res.status(500).json({message: 'Error fetching orders', error: err.message});
    }
});


router.get('/:orderId', async(req, res)=>{
    const {orderId} = req.params;
    try{
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(400).json({message: 'Order not found'});
        }
        res.status(200).json(order);
    }catch(err){
        res.status(500).json({message: 'Error fetching order', error: err.message});
    }
}
);

router.put('/:orderId/status', async (req, res)=>{
    const{orderId} = req.params;
    const {status} = req.body;

    const validStatus = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if(!validStatus.includes(status)){
        return res.status(400).json({message: 'Invalid status'});
    }
    try{
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message: 'Order not found'});
        }
        order.status = status;
        await order.save();
        res.status(200).json({message: 'Order status updated successfully', order});
    }catch(err){
        res.status(500).json({message: 'Error updating order status', error: err.message});
    }
});

router.delete('/:orderId', async(req, res)=>{
    const {orderId} = req.params;
    try{
        const order = await Order.findByIdAndDelete(orderId);
        if(!order){
            return res.status(404).json({message: 'Order not found'});
        }
        res.status(200).json({message: 'Order deleted successfully', order});
    }catch(err){
        res.status(500).json({message: 'Error deleting order', error: err.message});
    }
}   
);

router.put('/:orderId', async(req, res)=>{
    const {orderId} =req.params;
    const{newAddress} = req.body;
    
    try{
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message: 'Order not found'});
        }
        order.shippingAddress = newAddress;
        await order.save();
        res.status(200).json({message: 'Shipping address updated successfully', order});
    }catch(err){
        res.status(500).json({message: 'Error updating shipping address', error: err.message});
    }
})

router.get('/:orderId/track', async(req, res)=>{
    const {orderId} = req.params;
    try{
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message: 'Order not found'});
        }
        res.status(200).json({message: 'Order status', status: order.status, shippingAddress: order.shippingAddress});
    }catch(err){
        res.status(500).json({message: 'Error tracking order', error: err.message});
    }


})



export default router;  

