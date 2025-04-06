const Order = require('../models/order');
const Product = require('../models/product');
exports.newOrder = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        console.log("User in request:", req.user);
        console.log("Order Data received:", req.body);
    const userId = req.user.id;
    const {
        orderItems, shippingInfo, itemsPrice, totalPrice,} = req.body;
    
    if (!orderItems || !shippingInfo || !itemsPrice || !totalPrice) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }


    const order = await Order.create ({
        orderItems,
        shippingInfo,
        itemsPrice,
        totalPrice,
        user: req.user.id,
        paidAt: Date.now(),
      
    })

    res.status(200).json({
        success: true,
        order
    });
} catch (error) {
    console.error("Error in newOrder:", error); 
    res.status(500).json({
        success: false,
        message: "Error creating the order",
        error: error.stack
    });
}
};


// exports.updateOrderStatus = async (req, res, next) => {
//     try {
//         const { orderId, status } = req.body;

//         // Validate the status value
//         if (!['processing', 'cancelled', 'delivered'].includes(status)) {
//             return res.status(400).json({ message: 'Invalid status' });
//         }

//         // Ensure the user is an admin
//         if (req.user.role !== 'admin') {
//             return res.status(403).json({ message: 'You are not authorized to update the order status' });
//         }

//         // Find the order and update its status
//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Update the order status
//         order.status = status;
//         await order.save();

//         res.status(200).json({
//             success: true,
//             message: 'Order status updated successfully',
//             order
//         });
//     } catch (error) {
//         console.error('Error updating order status:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error updating the order status',
//             error: error.message
//         });
//     }
// };


exports.UserOrders = async (req, res) => {
    try {
        console.log("Authenticated user ID:", req.user.id); 
        const orders = await Order.find({ user: req.user.id }) 
            .populate('orderItems.product', 'name price') 
            .exec(); // Execute the query

        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};




exports.adminOrders = async (req, res) => {
    try {
        // Fetch all orders, populate user and order items
        const orders = await Order.find({})
            .populate('user', 'name email')  
            .populate('orderItems.product', 'name price')  
            .exec();

        // Check if no orders are found
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        // Structure the data as needed
        const orderData = orders.map(order => ({
            user: order.user ? order.user.name || order.user.email : 'Unknown User',
            orderId: order._id,
            orderTime: order.createdAt,
            items: order.orderItems.map(item => ({
                product: item.product ? item.product.name : 'Unknown Product',
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.quantity * item.price,
            })),
            totalPrice: order.totalPrice,
            shippingAddress: order.shippingInfo ? order.shippingInfo.address : 'No address provided',
            status: order.status, // Include the status field
        }));

        // Send the structured response to the frontend
        res.json({ orders: orderData });
    } catch (err) {
        // Log the error to the console for debugging
        console.error('Error fetching orders:', err);

        // Provide more details in the error response
        res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
    }
};


exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId, status } = req.body;

        // Validate the status value
        if (!['Delivered', 'Cancelled', 'Pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }


        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        console.log('Order found:', order);


        // Update the order status
        order.status = status;
        try {
            await order.save();
        } catch (saveError) {
            return res.status(500).json({
                success: false,
                message: 'Error saving the updated order',
                error: saveError.message,
            });
        }
        

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating the order status',
            error: error.message
        });
    }
};

// exports.UserOrders = async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ message: 'User not authenticated' });
//         }

//         console.log('User in request:', req.user);

//         // Fetch orders for the authenticated user
//         const orders = await Order.find({ user: req.user.id })
//             .populate({
//                 path: 'orderItems.product',
//                 select: 'name price', // Include necessary fields only
//             });

//         console.log('Orders fetched:', orders);

//         res.status(200).json({
//             success: true,
//             orders,
//         });
//     } catch (err) {
//         console.error('Error fetching user orders:', err);
//         res.status(500).json({
//             success: false,
//             message: 'Server error',
//             error: err.message,
//         });
//     }
// };

