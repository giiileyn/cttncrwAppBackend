const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('./models/product'); 
require('dotenv').config({ path: './config/.env' }); 

const connectDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI); 
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        const data = JSON.parse(fs.readFileSync('D:\\cttncrwApp\\backend\\data\\products.json'));
        await Product.create(data);
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    await importData();
};

run();