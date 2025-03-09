import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createProduct, sellProduct, viewBuyers, getAllProducts } from '../controllers/productController.js';

const router = express.Router();

// ✅ Retailer endpoints (protected)
router.post('/create', authMiddleware(['retailer']), createProduct);
router.put('/sell/:productId', authMiddleware(['retailer']), sellProduct);
router.get('/buyers', authMiddleware(['retailer']), viewBuyers);

// ✅ Public route (Users, retailers, admins can access)
router.get('/', getAllProducts);

export default router;
