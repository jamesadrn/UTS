const { Product } = require('../../../models');

async function getProduct() {
  return Product.find({});
}

async function getProductByName(name) {
  return Product.findOne({ name });
}

async function getProducts(id) {
  return Product.findById(id);
}

async function uploadProduct(product_name, product_price, product_description) {
  try {
    return await Product.create({
      name: product_name,
      price: product_price,
      description: product_description,
    });
  } catch (error) {
    console.error('Error uploading product:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

async function updateProduct(id, name, price, description) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        price,
        description,
      },
    }
  );
}

async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

module.exports = {
  deleteProduct,
  updateProduct,
  getProducts,
  getProduct,
  getProductByName,
  uploadProduct,
};
