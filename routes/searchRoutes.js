import express from 'express';
import Product from '../models/product.js';
import User from '../models/user.js';
import Order from '../models/order.js';

const router = express.Router();
router.use(express.json());

router.post('/', async(req, res)=>{
    const {query} = req.query;
    try{
        if(!query){
            return res.status(400).json({message: 'Query parameter is required'});
        }
        const products = await Product.find({
            name : {$regex: query, $options : 'i'}
        });
        if(!products || products.length === 0){
            return res.status(404).json({message: 'No products found'});
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({message: 'Error fetching products', error: err.message}); 

    }
});

router.get('/products/sort/:type', async(req, res)=>{
    const {type} = req.params;
    let sortOption = {};

    if(type === 'price') sortOption = {price: 1};
    else if(type === 'price-dec') sortOption = {price: -1};
    else if(type ==="rating") sortOption = {rating : 1};
    else if (type === 'rating-dec') sortOption = {rating : -1};

    try{
        const products = await Product.find().sort(sortOption);
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({message: 'Error fetching products', error: err.message});
    }
});

router.get('/products/low-stock', async(req, res)=>{
    try{
        const products = await Product.find({stock: { $lt : 30 }});
        res.status(200).json(products);
    }
    catch(err){
        res.status(500).json({message: 'Error fetching products', error: err.message});
    }
});

router.get('/stats/dashboard', async(req, res)=>{
    try{
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        
        res.status(200).json({Total_Users : totalUsers, Total_Products : totalProducts});
    }catch(err){
        res.status(500).json({message: 'Error fetching stats', error: err.message});
    }
});

router.get('/user/:id/purchase-history', async(req, res)=>{
    const {id} = req.params;
    try{
        const orders = await  Order.find({userId: id});
        if(!orders || orders.length === 0){
            return res.status(404).json({message: 'No purchase history found for this user'});
    }
    res.status(200).json(orders);
    }catch(err){
        res.status(500).json({message: 'Error fetching purchase history', error: err.message});
    }
});


export default router;