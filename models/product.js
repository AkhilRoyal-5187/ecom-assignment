import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
   
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
