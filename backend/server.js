const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config/.env' });
// console.log('Loaded JWT_SECRET from .env:', process.env.JWT_SECRET);
// Connect to the database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Start the server
const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://192.168.254.118:${port}`);
});
