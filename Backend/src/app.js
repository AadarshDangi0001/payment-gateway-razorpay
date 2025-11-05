import express from 'express';
import productRoutes from './routes/product.route.js';
import cors from 'cors';
import paymentRoutes from './routes/payment.route.js';

const app = express();
app.use(express.json());
app.use(cors());


app.use('/products', productRoutes);
app.use('/payments', paymentRoutes);



export default app;