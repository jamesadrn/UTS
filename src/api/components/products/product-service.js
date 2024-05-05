const productsRepository = require('./products-repository');

async function getProducts() {
  const products = await productsRepository.getProduct();

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
    });
  }

  return results;
}

async function updateProduct(id, name, price, description) {
  const product = await productsRepository.getProducts(id);

  if (!product) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Product not found');
  }

  const success = await productsRepository.updateProduct(
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

  return {
    id: id,
    name: name,
    price: price,
    description: description,
  };
}

async function uploadProduct(product_name, product_price, product_description) {
  try {
    await productsRepository.uploadProduct(
      product_name,
      product_price,
      product_description
    );
  } catch (err) {
    return null;
  }
  return true;
}

async function productIsRegistered(product_name) {
  const product = await productsRepository.getProductByName(product_name);

  if (product) {
    return true;
  }

  return false;
}

async function deleteProduct(id) {
  const product = await productsRepository.getProducts(id);

  if (!product) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Product not found');
  }

  const success = await productsRepository.deleteProduct(id);
  if (!success) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Failed to delete product'
    );
  }
  return true;
}

module.exports = {
  deleteProduct,
  updateProduct,
  productIsRegistered,
  getProducts,
  uploadProduct,
};
