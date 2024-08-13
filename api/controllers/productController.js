const Product = require('../models/productModel');

const view_all_product = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    // const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
};

const view_a_product = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).send(err);
  }
};

const delete_a_product = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json({ message: "Delete a product succeed!" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const delete_all_product = async (req, res) => {
  try {
    await Product.deleteMany();
    res.json({ message: "Delete all products succeed!" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const add_product = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Add new product succeed!", product });
  } catch (err) {
    res.status(400).send(err);
  }
};

const update_product = async (req, res) => {
  try {
    const id = req.params.id;
    const product = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.json({ message: "Update product succeed!", updatedProduct });
  } catch (err) {
    res.status(400).send(err);
  }
};

const products_categorized = async (req, res) => {
  try {
    const { category, subCategory } = req.params; // Use req.params for route parameters
    const query = {};

    if (category) {
      query.category = new RegExp(`^${category}$`, 'i'); // Case-insensitive match
    }
    
    if (subCategory) {
      query.subCategory = new RegExp(`^${subCategory}$`, 'i'); // Case-insensitive match
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const search_products = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    // Create a search query object
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' }; // Case-insensitive search
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
      }
    }
    // Fetch products matching the search criteria
    const products = await Product.find(query);

    res.json(products);
  } catch (err) {
    res.status(500).send({ message: 'An error occurred while searching for products', error: err.message });
  }
};

const updateProductQuantities = async (req, res) => {
  const { cartItems } = req.body;

  try {
    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'Invalid cart items' });
    }

    const session = await Product.startSession();
    session.startTransaction();

    for (const item of cartItems) {
      const { _id, quantity } = item;

      // Log to verify _id is valid
      console.log(`Processing item with _id: ${_id}`);

      const productId = mongoose.Types.ObjectId(_id); // Convert to ObjectId
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error(`Product with ID ${_id} not found`);
      }

      if (product.stock < quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }

      product.stock -= quantity;
      await product.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Product quantities updated successfully' });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error('Error updating product quantities:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  view_all_product,
  add_product,
  view_a_product,
  update_product,
  delete_all_product,
  delete_a_product,
  search_products,
  products_categorized,
  updateProductQuantities,
};
