import express from 'express';
import Cart from '../models/cart.js';

const router = express.Router();
router.use(express.json());

router.post('/add', async (req, res)=>{
    const{userId,productId, quantity } = req.body;

    try{
        let cart = await Cart.findOne({userId});
        if(!cart){
            cart = new Cart({ userId, items :[{productId, quantity}]})
        }else{
            const itemIndex = Cart.items.findIndex(item => item.productId.toString() === productId);
            if(itemIndex > -1){
                cart.items[itemIndex].quantity += quantity;
        }else{
            cart.items.push({productId, quantity});
        }
    }
    await cart.save();
    res.status(201).json(cart);
    }catch(err){
        res.status(500).json({message: 'Error adding to cart', error: err.message});
    }
})

router.delete('/remove/:productId', async(req, res)=>{
    const {userId} = req.body;
    const {productId} = req.params;

    try{
        const cart =  await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message: 'Cart not found'});
    }
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.status(200).json({message: 'Item removed from cart', cart});
    }catch(err){
        res.status(500).json({message: 'Error removing item from cart', error: err.message});
    }
});

router.put('/update/:productId', async(req, res)=>{
    const {userId} = req.body;
    const {productId} = req.params;
    const {quantity} = req.body;

    try{
        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message: 'Cart not found'});
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if(itemIndex > -1){
            cart.items[itemIndex].quantity = quantity;
            res.status(200).json({message: 'Item updated in cart', cart});
        }else{
            cart.items.push({productId, quantity});
            res.status(200).json({message: 'Item updated in cart'});
        }
        await cart.save();

    }catch(err){
        res.status(500).json({message: 'Error updating item in cart', error: err.message});
    }
})


router.get('/', async (req, res) => {

    try {
        const cart = await Cart.find();

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cart', error: err.message });
    }
});


router.delete('/clear', async(req,res)=>{
    const {userId} = req.body;
    try{
        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message : 'Cart not found'});
        }
        cart.items = [];
        await cart.save();
        res.status(200).json({message : 'Cart cleared successfully', cart});
    }catch(err){
        res.status(500).json({message : 'Error clearing cart', error: err.message});
    }


});
export default router;