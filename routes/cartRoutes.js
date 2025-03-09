import express from'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addToCart, viewCart } from '../controllers/cartController.js';
const router = express.Router();
router.post('/add', authMiddleware(['user']), addToCart);
router.get('/view', authMiddleware(['user']), viewCart);

export default router;
