const mongoose = require('mongoose')
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

  // Middleware to update the updatedAt field before saving the document
  productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  // Middleware to update updatedAt field when the document is updated
  productSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
  });

 const productModel = mongoose.model('products', productSchema)
 module.exports = productModel;
