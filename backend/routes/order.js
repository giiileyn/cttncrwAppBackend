// const authMiddleware = require ('../middleware/authMiddleware');
const express = require('express');
const {newOrder, UserOrders, adminOrders, updateOrderStatus} = require('../controllers/order')
// const {isAuthenticatedUser} = require ('../middleware/authMiddleware');

const router = express.Router();
router.post('/order/new', newOrder);
router.get('/order/me', UserOrders);
router.get('/admin/orders', adminOrders);
router.put('/admin/updateStatus', updateOrderStatus);


module.exports = router;