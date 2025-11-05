import express from 'express';

import { createProduct, getProducts } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/get-item', getProducts);

export default router;
