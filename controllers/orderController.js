import Cart from'../models/Cart.js';
import Order from'../models/Order.js';
import Product from '../models/Product.js';

export const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    let totalPrice = 0;
    // Check stock availability and calculate total price
    for (let item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
      totalPrice += item.product.price * item.quantity;
    }
    
    // Create a new order
  const order = new Order({
      user: req.user.id,
      items: cart.items.map(item => ({ product: item.product._id, quantity: item.quantity })),
      totalPrice,
      status: 'completed'
    });
    await order.save();
    
    // Update product stocks
    for (let item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;
      if (product.stock <= 0) {
        product.status = 'sold';
      }
      await product.save();
    }
    
    // Clear the cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate('user').populate('items.product');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  export const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }).populate('items.product');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
    