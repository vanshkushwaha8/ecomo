import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectionDB from './config/db.js';

dotenv.config(); // Load environment variables

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';  // ✅ Corrected
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // ✅ Corrected

const app = express();
connectionDB(); // Connect to MongoDB

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);  // ✅ Corrected
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes); // ✅ Corrected

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`.cyan.bold));
