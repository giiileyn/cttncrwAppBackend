const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });


const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con => {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
    }).catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); 
    });
};

module.exports = connectDatabase;