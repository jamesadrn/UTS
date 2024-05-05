const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');

module.exports = {
  uploadProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.string().min(1).max(100).required().label('Price'),
      description: joi.string().min(1).max(100).required().label('Description'),
    },
  },
  updateProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.string().min(1).max(100).required().label('Price'),
      description: joi.string().min(1).max(100).required().label('Description'),
    },
  },
};
