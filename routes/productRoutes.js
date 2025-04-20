import express from 'express';
import dotenv from 'dotenv';
import verifyAdmin from '../middleware/verifyAdmin.js';
import Product from '../models/product.js'; 

const app = express();
dotenv.config();

app.use(express.json());




const router = express.Router();
//adding the new product 

router.post('/', verifyAdmin, async (req, res) => {
    try {
      const product = new Product(req.body);
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      res.status(500).json({ message: 'Error adding product', error: err.message });
    }
  });
  



// findiing the all products
  router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

//getting the product by id 
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }else{
        res.status(202).json(product);

    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});


//edit the details by the admin
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated){
        return res.status(404).json({ message: 'Product not found' });
    }else{
        res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});




//deleting product with the id by admin
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted){
        return res.status(404).json({ message: 'Product not found' });
    }
    else{
        res.json({ message: 'Product deleted successfully' });

    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});


//products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category products', error: err.message });
  }
});

//Products by brand
router.get('/brand/:brandName', async (req, res) => {
  try {
    const products = await Product.find({ brand: req.params.brandName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching brand products', error: err.message });
  }
});


//update the stock
router.put('/:id/stock', verifyAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    const updated = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    else{
        res.json(updated);

    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating stock', error: err.message });
  }
});

export default router;
