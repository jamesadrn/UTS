const express = require('express');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productControllers = require('./products-controller');
const productValidator = require('./products-validator');
const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  // Get Products List
  route.get('/', authenticationMiddleware, productControllers.getProducts);

  // Menambahkan Product Baru
  route.post(
    '/add',
    authenticationMiddleware,
    celebrate(productValidator.uploadProduct),
    productControllers.uploadProduct
  );

  // Update Product
  route.put(
    '/update/:id',
    authenticationMiddleware,
    celebrate(productValidator.updateProduct),
    productControllers.updateProduct
  );

  // Delete Product
  route.delete(
    '/delete/:id',
    authenticationMiddleware,
    productControllers.deleteProduct
  );
};
