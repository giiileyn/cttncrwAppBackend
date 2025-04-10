const Order = require('../models/order');
const Product = require('../models/product');

// const Order = require('../models/order');
// const Product = require('../models/product');

exports.newOrder = async (req, res, next) => {
    try {
        console.log("🔥 Incoming request body:", req.body);

        // Destructure the incoming request body
        const { userId, orderItems, shippingInfo, itemsPrice, totalPrice } = req.body;

        // Check for missing fields
        if (!userId || !orderItems || !shippingInfo || !itemsPrice || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate that all orderItems have the necessary fields (name, quantity, price)
        for (const item of orderItems) {
            if (!item.name || !item.quantity || !item.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Each order item must have a name, quantity, and price'
                });
            }
        }

        // Fetch product details and include product _id for each order item using the product name
        const updatedOrderItems = [];
        for (const item of orderItems) {
            const product = await Product.findOne({ name: item.name });  // Find the product by its name
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product with name ${item.name} not found`
                });
            }
            updatedOrderItems.push({
                product: product._id,  // Store the product _id in the order
                name: product.name,    // Include the name
                quantity: item.quantity,
                price: item.price
            });
        }

        // Create the order in the database with the updated order items
        const order = await Order.create({
            orderItems: updatedOrderItems,
            shippingInfo,
            itemsPrice,
            totalPrice,
            user: userId,
            paidAt: Date.now(),
        });

        // Return the response to the frontend
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("❌ Error in newOrder:", error);
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
        // Get the user ID from the request header (can be set by frontend)
        const userId = req.headers['user-id'];  // Alternatively, pass it in body or query params

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find all orders associated with the user
        const orders = await Order.find({ user: userId })  // Assuming 'user' is the field linking to user
            .populate('orderItems.product', 'name price')  // Populate order items with product details
            .exec();  // Execute the query

        // Return the orders to the frontend
        res.json({ orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
// exports.UserOrders = async (req, res) => {
//     try {
//         console.log("Authenticated user ID:", req.user.id); 
//         const orders = await Order.find({ user: req.user.id }) 
//             .populate('orderItems.product', 'name price') 
//             .exec(); // Execute the query

//         res.json({ orders });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };




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

