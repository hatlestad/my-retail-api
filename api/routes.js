import express from 'express';

import { productsRouter } from './products';

// initialize the global router
const router = express.Router();

// mount endpoint's router onto the global router
router.use('/products', productsRouter);

module.exports = router;