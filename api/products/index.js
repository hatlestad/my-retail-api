import express from 'express';
import bodyParser from 'body-parser';

import getProduct from './get';
import putProduct from './put';

// initialize the products router
const productsRouter = express.Router();

// products routes
productsRouter.get('/:id', (req, res) => getProduct(req, res));

productsRouter.put('/:id', bodyParser.json(), (req, res) => putProduct(req, res));

module.exports = { productsRouter };