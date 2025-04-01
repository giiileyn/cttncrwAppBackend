// const { multerProduct } = require('../utils/multerProduct');
const multer = require('multer');  // Import Multer
const Product = require('../models/product'); 
const APIFeatures = require('../utils/apiFeature');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// const storage = multer.memoryStorage(); // Store files in memory
// const upload = multer({ storage }).array("images", 10); // Accept multiple files


exports.getAdminProducts = async (req, res) => {
    try {
        const resPerPage = 50;
        const productsCount = await Product.countDocuments();
        const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();
        apiFeatures.pagination(resPerPage);
        const products = await apiFeatures.query;
        let filteredProductsCount = products.length;
        
        if (!products) 
            return res.status(400).json({message: 'error loading products'})
       return res.status(200).json({
            success: true,
            count: productsCount,
            data: products, //donot remove e2ng data:
            filteredProductsCount,
            resPerPage,
           
        })
    
    } catch (error) {
        console.error("Error in getProducts:", error); 
        res.status(500).json({
            success: false,
            message: "Error loading the products",
            error: error.stack 
        });
    }
};
// Get All Products
exports.getProducts = async (req, res) => {
    try {
        const resPerPage = 1000;
        const productsCount = await Product.countDocuments();
        const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();
        apiFeatures.pagination(resPerPage);
        const products = await apiFeatures.query;
        let filteredProductsCount = products.length;
        
        if (!products) 
            return res.status(400).json({message: 'error loading products'})
       return res.status(200).json({
            success: true,
            count: productsCount,
            data: products, //donot remove e2ng data:
            filteredProductsCount,
            resPerPage,
           
        })
    
    } catch (error) {
        console.error("Error in getProducts:", error); 
        res.status(500).json({
            success: false,
            message: "Error loading the products",
            error: error.stack 
        });
    }
};

// Get Single Product
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error in getSingleProduct:", error); 
        res.status(500).json({
            success: false,
            message: "Error retrieving the product",
            error: error.stack 
        });
    }
};

// Delete Single Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({
            success: false,
            message: 'Error deleting the product',
            error: error.stack,
        });
    }
};



exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, seller } = req.body;
        const productId = req.params.id;

        // Find the product by ID
        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // If images are provided, upload them to Cloudinary
        let images = product.images; // Keep the existing images if no new ones are provided
        if (req.files && req.files.length > 0) {
            images = []; // Clear existing images if new ones are uploaded

            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'products',
                    crop: 'scale'
                });

                images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }
        }

        // Update the product fields with the provided data
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.seller = seller || product.seller;
        product.images = images; // Update images if provided

        // Save the updated product to the database
        await product.save();

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Error during product update:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// exports.addReview = async (req, res) => {
//     try {
//       const { productId } = req.params;  // Get productId from URL parameters
//       const { comment, name } = req.body;  // Get the comment and name from the request body
  
//       // Check if the comment is a string
//       if (typeof comment !== 'string') {
//         return res.status(400).json({
//           success: false,
//           message: 'Comment must be a string',
//         });
//       }
  
//       // Check if the product exists by its productId
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: 'Product not found',
//         });
//       }
  
//       // If no name is provided, default to "Anonymous"
//       const reviewerName = name ? name : "Anonymous";  // Set the name to "Anonymous" if no name is provided
  
//       // Add the new review
//       const review = {
//         name: reviewerName,  // Use the name from the request body or default to "Anonymous"
//         comment,             // Use the comment from the request body
//       };
  
//       // Add the review to the product's reviews array
//       product.reviews.push(review);
//       product.numOfReviews = product.reviews.length;  // Update the number of reviews
  
//       // Save the product with the new review
//       await product.save();
  
//       // Respond with the updated product
//       res.status(200).json({
//         success: true,
//         message: 'Review added successfully',
//         product,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message: 'Server Error: ' + error.message,
//       });
//     }
//   };
  




// exports.createReview = async (req, res) => {
//     try {
//         const { productId } = req.params;
//         const { ratings, reviews } = req.body;

//         // Ensure ratings is a valid number
//         if (isNaN(ratings) || ratings < 1 || ratings > 5) {
//             return res.status(400).json({ message: "Invalid rating value" });
//         }

//         // Ensure the product ID is valid
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             return res.status(400).json({ message: "Invalid product ID" });
//         }

//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         // Add the review
//         product.reviews.push({
//             name: req.user.name,  // Assuming you're attaching user info via JWT
//             rating: ratings,
//             comment: reviews
//         });

//         // Update the number of reviews and average rating
//         product.numOfReviews = product.reviews.length;
//         product.ratings = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.numOfReviews;

//         await product.save();

//         return res.status(200).json({ success: true, message: 'Review added successfully' });
//     } catch (err) {
//         console.error(err);  // Log the error for debugging
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };



// Bulk Delete Products
exports.deleteMultipleProducts = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No product IDs provided',
            });
        }

        await Product.deleteMany({ _id: { $in: productIds } });

        res.status(200).json({
            success: true,
            message: 'Selected products deleted successfully',
        });
    } catch (error) {
        console.error("Error in deleteMultipleProducts:", error);
        res.status(500).json({
            success: false,
            message: 'Error deleting products',
            error: error.stack,
        });
    }
};






exports.newProduct = async (req, res, next) => {
    try {
        console.log('Files:', req.files); 
        console.log('Body:', req.body); 

        if (!req.files || !req.files.length) {
            return res.status(400).json({ success: false, message: 'Please upload product images.' });
        }

        const images = [];
        for (const file of req.files) {
            // Uploading each image to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'products',
                crop: "scale"
            });

            images.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }

        const { name, price, description, category, seller, stock } = req.body;

        
    

        // Creating a new product
        const product = await Product.create({
            name,
            price,
            description,
            category,
            seller,
            stock,
            images
        });

        return res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Error during product creation:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};



  



// exports.getProdAdmin = async (req, res, next) => {
// 	const products = await Product.find();
// 	if (!products) {
// 		return res.status(404).json({
// 			success: false,
// 			message: 'Product not found'
// 		})
// 	}
// 	return res.status(200).json({
// 		success: true,
// 		products
// 	})
// }