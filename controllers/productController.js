import Product from'../models/Product.js';
import Order from'../models/Order.js';

// Retailer: Create a new product
export const createProduct = async (req, res) => {
  console.log("Received request:", req.body); // 🛠 Debugging Log

  const { name, price, stock } = req.body;
  try {
    const newProduct = new Product({
      name,
      price,
      stock,
      retailer: req.user?.id || "No retailer ID provided", // Log retailer ID
      status: 'available'
    });

    await newProduct.save();
    console.log("Product created successfully:", newProduct); // 🛠 Debugging Log

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error("Error in createProduct:", error); // 🛠 Debugging Log
    res.status(500).json({ message: 'Server error' });
  }
};


// Retailer: Mark product as sold (simulate selling once stock is depleted)
export const sellProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({ _id: productId, retailer: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    if (product.stock <= 0) {
      product.status = 'sold';
      await product.save();
      return res.json({ message: 'Product marked as sold', product });
    } else {
      return res.status(400).json({ message: 'Product still in stock; cannot mark as sold' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Retailer: View users who purchased their products
export const viewBuyers = async (req, res) => {
  try {
    // Find orders that include products created by the retailer
    const orders = await Order.find().populate('items.product').populate('user');
    const filteredOrders = orders.filter(order =>
      order.items.some(item => item.product.retailer.toString() === req.user.id)
    );
    // Create a unique list of buyers
    const buyersMap = {};
    filteredOrders.forEach(order => {
      buyersMap[order.user._id] = order.user;
    });
    res.json({ buyers: Object.values(buyersMap) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User: View all available products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'available' });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
