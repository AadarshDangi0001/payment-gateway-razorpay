import dotenv from 'dotenv';
dotenv.config();

import Razorpay from 'razorpay';
import productModel from '../models/product.model.js';
import paymentModel from '../models/payment.model.js';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js'


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    }); 

export const createOrder =  async (req, res) => {
  const product = await productModel.findOne();

  if (!product) {
    return res.status(404).json({ error: 'No product found to create order for' });
  }

  const options = {
    amount: product.price.amount,
    currency: product.price.currency,
  };

  try {
    const order = await razorpay.orders.create(options);

    // create payment record first, then send a single response
    const newPayment = await paymentModel.create({
      orderId: order.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
      status: 'pending',
    });

    // Return the order object directly so frontend code that expects `data` to be the order continues to work.
    return res.status(201).json(order);
  } catch (error) {
    console.error('createOrder error:', error);
    return res.status(500).json({ error: 'Error creating order', details: error.message });
  }
};


export const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET

  try {
    const result = validatePaymentVerification({ order_id: razorpayOrderId, payment_id: razorpayPaymentId }, signature, secret)
    if (result) {
      const payment = await paymentModel.findOne({ orderId: razorpayOrderId });
      if (!payment) {
        console.error('Payment record not found for orderId', razorpayOrderId)
        return res.status(404).json({ error: 'Payment record not found' })
      }
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = 'completed';
      await payment.save();
      res.json({ status: 'success' });
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error verifying payment');
  }
};