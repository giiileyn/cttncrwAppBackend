// const authMiddleware = require ('../middleware/authMiddleware');
const express = require('express');
const {newOrder, UserOrders, adminOrders, updateOrderStatus} = require('../controllers/order')
const {isAuthenticatedUser} = require ('../middleware/authMiddleware');

const router = express.Router();
router.post('/order/new', isAuthenticatedUser, newOrder);
router.get('/order/me', isAuthenticatedUser, UserOrders);
router.get('/admin/orders', isAuthenticatedUser, adminOrders);
router.put('/admin/updateStatus', isAuthenticatedUser, updateOrderStatus);


module.exports = router;