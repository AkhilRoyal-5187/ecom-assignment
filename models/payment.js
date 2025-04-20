import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        amount:{
            type: Number,
            required: true,
        },
        paymentMethod :{
            type: String,
            required:true
        },
        userId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
        },
        orderId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        status : {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending'
        },
    
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;