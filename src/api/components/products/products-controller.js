const productService = require('./product-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function uploadProduct(request, response, next) {
  try {
    const name = request.body.name;
    const price = request.body.price;
    const description = request.body.description;

    // Product name must be unique
    const productIsRegistered = await productService.productIsRegistered(name);

    if (productIsRegistered) {
      throw errorResponder(
        errorTypes.PRODUCT_ALREADY_REGISTERED,
        'Product is already registered'
      );
    }

    // Upload product
    const success = await productService.uploadProduct(
      name,
      price,
      description
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({ name, price, description });
  } catch (error) {
    return next(error);
  }
}

async function getProducts(request, response, next) {
  try {
    const product = await productService.getProducts();
    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const price = request.body.price;
    const description = request.body.description;

    const success = await productService.updateProduct(
      id,
      name,
      price,
      description
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response.status(200).json({
      id,
      name,
      price,
      description,
      message: 'Update berhasil',
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await productService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ id, message: 'Delete berhasil' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  deleteProduct,
  updateProduct,
  uploadProduct,
  getProducts,
};
