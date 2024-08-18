const mongoose = require('mongoose');
const { updateTimestampOnSave, updateTimestampOnUpdate } = require('../../middleware/productMiddleware');

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

productSchema.pre('save', updateTimestampOnSave);
productSchema.pre('findOneAndUpdate', updateTimestampOnUpdate);

const productModel = mongoose.model('products', productSchema);
module.exports = productModel;
