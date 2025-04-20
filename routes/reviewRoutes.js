import express from 'express';
import Product from '../models/product.js';
import Review from '../models/review.js';

const router = express.Router();

router.use(express.json());

router.post('/', async (req, res) => {
    const { productId, userId, rating, comment } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }


        const review = new Review({ productId, userId, rating, comment });
        await review.save();
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        res.status(500).json({ message: 'Error adding review', error: err.message });
    }
});

router.get('/product/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ productId });
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this product' });
        } else {
            res.status(200).json(reviews);
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews', error: err.message });
    }
}
);

router.get('/user/:userId', async(req, res)=>{
    const {userId} =req.params;
    try{
        const reviews = await Review.find({userId});
        if(!reviews || reviews.length === 0){
            return res.status(404).json({message: 'No reviews found for this user'});
        }else{
            res.status(200).json(reviews);
        }   
    }catch(err){
        res.status(500).json({message: 'Error fetching reviews', error: err.message});
    }
});

router.put('/:reviewId', async (req, res)=>{
    const {reviewId} = req.params;
    const {rating, comment} = req.body;

    try{
        const review = await Review.findById(reviewId);
        if(!review){
            return res.status(404).json({message: 'Review not found'});
        }
        if(rating) review.rating = rating;
        if(comment) review.comment = comment;
        await review.save();
        res.status(200).json({message: 'Review updated successfully', review});
    }catch(err){
        res.status(500).json({message: 'Error updating review', error: err.message});
    }

});

router.delete('/:reviewId', async(req, res)=>{
    const {reviewId} = req.params;
    try{
        const review = await Review.findByIdAndDelete(reviewId);

        if(!review){
            return res.status(404).json({message: 'Review not found'});
    }
        res.status(200).json({message: 'Review deleted successfully'});
    }catch(err){
        res.status(500).json({message: 'Error deleting review', error: err.message});
    }
});



export default router;

