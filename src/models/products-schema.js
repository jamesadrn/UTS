const productsSchema = {
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
};

module.exports = productsSchema;
