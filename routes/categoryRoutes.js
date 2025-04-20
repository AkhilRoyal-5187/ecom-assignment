import express from 'express';
import Category from '../models/category.js';

const router = express.Router();
router.use(express.json());

router.post('/', async(req, res) => {
    try{
        const category = new Category(req.body);
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    }catch(err){
        res.status(500).json({message: 'Error adding category', error: err.message});
    }
});

router.get('/', async(req, res) => {
    try{
        const categories = await Category.find();
        res.json(categories);
    }catch(err){
        res.status(500).json({message: 'Error fetching categories', error: err.message});
    }   
});


router.get('/:id', async(req, res) => {
   const {id} = req.params;
   try{
    const category = await Category.findById(id);
    if(!category){
        return res.status(404).json({message: 'Category not found'});
   }else{
    res.status(200).json(category);
   }
}
   catch(err){
    res.status(500).json({message: 'Error fetching category', error: err.message});
   }
});

router.put('/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const updatedCat = await Category.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedCat){
            return res.status(404).json({message: 'Category not found'});
        }
        else{
            res.status(200).json(updatedCat);
        }
        
    }catch(err){
        res.status(500).json({message: 'Error updating category', error: err.message});
    }
})

router.delete('/:id', async(req, res) => {
   const {id} = req.params;
   try{
    const deletecat = await Category.findByIdAndDelete(id);
    if(!deletecat){
        return res.status(404).json({message: 'Category not found'}); 
   }else{
    res.status(200).json({message: 'Category deleted successfully'});
   }
}
catch(err){
    res.status(500).json({message: 'Error deleting category', error: err.message});
   }
});

export default router;
