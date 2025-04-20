import mongoose from 'mongoose';

const caetItemSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
    quantity : {
        type : Number,
        required : true,
        default : 1
    }
});

const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    items : [caetItemSchema],
    totalPrice : {
        type : Number,
        default : 0
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);            

export default Cart;